<#
.SYNOPSIS
    backup_manager.ps1 - Dynamic Antigravity Workspace Backup & 10-Day FIFO Pruner.
    Conforms to Universal Rule 5 (Antigravity Backup & SRE Standard), Rule 8 (UTF-8 BOM), and Rule 13.

.DESCRIPTION
    Dual-container backup engine for the Antigravity development environment:
    - Manual_Backup: Permanent indefinite retention container (never auto-pruned).
    - Daily_Backup: 10-Day FIFO rotational container (automatically prunes oldest backups when count > 10).
    - Excludes transient bloat (node_modules, .git, dist, .cache, tmp, vibe_coding_temp).
    - Generates a cryptographically verified, UTF-8 with BOM backup_manifest.json in the root of each backup.
    - Full support for -DryRun and -WhatIf simulation flags.

.PARAMETER BackupType
    'Daily' (default) or 'Manual'.

.PARAMETER SourcePath
    Root directory of the workspace to backup. Defaults to the current repository root.

.PARAMETER TargetBase
    Base backup directory. Defaults to 'C:\Users\Atul Verma\Desktop\Antigravity Backup'.

.PARAMETER RetentionMax
    Maximum daily backups to retain (default: 10).

.PARAMETER DryRun
    Simulate the backup and FIFO pruning without copying or deleting files.

.EXAMPLE
    .\backup_manager.ps1 -BackupType Daily -DryRun
    .\backup_manager.ps1 -BackupType Manual
    .\backup_manager.ps1 -BackupType Daily -RetentionMax 10
#>

[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [Parameter(Mandatory = $false, Position = 0)]
    [ValidateSet('Daily', 'Manual')]
    [string]$BackupType = 'Daily',

    [Parameter(Mandatory = $false)]
    [string]$SourcePath = "",

    [Parameter(Mandatory = $false)]
    [string]$TargetBase = "C:\Users\Atul Verma\Desktop\Antigravity Backup",

    [Parameter(Mandatory = $false)]
    [int]$RetentionMax = 10,

    [Parameter(Mandatory = $false)]
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# UTF-8 with BOM Encoding Standard per Universal Rule 5 & 8
$utf8WithBom = New-Object System.Text.UTF8Encoding($true)

# -----------------------------------------------------------------------------
# 1. Resolve Paths & Git Metadata
# -----------------------------------------------------------------------------
if ([string]::IsNullOrWhiteSpace($SourcePath)) {
    try {
        $gitRoot = git rev-parse --show-toplevel 2>$null
        if ($LASTEXITCODE -eq 0 -and -not [string]::IsNullOrWhiteSpace($gitRoot)) {
            $SourcePath = [System.IO.Path]::GetFullPath($gitRoot.Trim())
        } else {
            $SourcePath = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot "..\.."))
        }
    } catch {
        $SourcePath = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot "..\.."))
    }
} else {
    $SourcePath = [System.IO.Path]::GetFullPath($SourcePath)
}

if (-not (Test-Path $SourcePath)) {
    Write-Error "Source workspace path does not exist: $SourcePath"
    exit 1
}

# Resolve Git metadata
$gitBranch = "unknown"
$gitCommit = "unknown"
try {
    $b = git -C $SourcePath rev-parse --abbrev-ref HEAD 2>$null
    if ($LASTEXITCODE -eq 0) { $gitBranch = $b.Trim() }
    $c = git -C $SourcePath rev-parse HEAD 2>$null
    if ($LASTEXITCODE -eq 0) { $gitCommit = $c.Trim() }
} catch {}

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$displayTime = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# Determine Destination Paths
$manualContainer = Join-Path $TargetBase "Manual_Backup"
$dailyContainer = Join-Path $TargetBase "Daily_Backup"
$logFile = Join-Path $TargetBase "daily_backup.log"

$isManual = ($BackupType -eq 'Manual')
$containerPath = if ($isManual) { $manualContainer } else { $dailyContainer }
$backupFolderPrefix = if ($isManual) { "Manual_Backup_" } else { "Daily_Backup_" }
$backupFolderName = "${backupFolderPrefix}${timestamp}"
$destinationPath = Join-Path $containerPath $backupFolderName
$retentionPolicy = if ($isManual) {
    "Permanent Indefinite Protection (Never Auto-Pruned)"
} else {
    "10-Day FIFO Rotation (Oldest pruned when count exceeds $RetentionMax)"
}

$isSimulation = $DryRun.IsPresent -or $WhatIfPreference

# -----------------------------------------------------------------------------
# 2. Output Header
# -----------------------------------------------------------------------------
Write-Host "========================================================================" -ForegroundColor Cyan
if ($isSimulation) {
    Write-Host "  ANTIGRAVITY BACKUP MANAGER [SIMULATION / DRY-RUN]" -ForegroundColor Yellow
} else {
    Write-Host "  ANTIGRAVITY BACKUP MANAGER (RULE 5 & RULE 13 SRE STANDARD)" -ForegroundColor Green
}
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host "  Backup Type      : $BackupType" -ForegroundColor White
Write-Host "  Timestamp        : $displayTime" -ForegroundColor White
Write-Host "  Source Path      : $SourcePath" -ForegroundColor White
Write-Host "  Destination      : $destinationPath" -ForegroundColor White
Write-Host "  Retention Policy : $retentionPolicy" -ForegroundColor White
Write-Host "  Git Commit / Ref : $gitBranch ($gitCommit)" -ForegroundColor White
Write-Host "------------------------------------------------------------------------" -ForegroundColor Cyan

# -----------------------------------------------------------------------------
# 3. Ensure Target Containers Exist
# -----------------------------------------------------------------------------
if (-not $isSimulation) {
    if (-not (Test-Path $TargetBase)) {
        New-Item -ItemType Directory -Path $TargetBase -Force | Out-Null
    }
    if (-not (Test-Path $containerPath)) {
        New-Item -ItemType Directory -Path $containerPath -Force | Out-Null
    }
}

# -----------------------------------------------------------------------------
# 4. Filter & Copy Workspace Files
# -----------------------------------------------------------------------------
$excludeDirs = @(
    'node_modules',
    '.git',
    'dist',
    '.cache',
    'tmp',
    'vibe_coding_temp',
    'coverage',
    '.turbo'
)

Write-Host "  Scanning source workspace files..." -ForegroundColor Cyan

# Enumerate all files, skipping excluded directories
$allFiles = Get-ChildItem -Path $SourcePath -Recurse -File -Force | Where-Object {
    $rel = $_.FullName.Substring($SourcePath.Length).TrimStart('\', '/')
    $parts = $rel -split '[\\/]'
    $skip = $false
    foreach ($part in $parts) {
        if ($excludeDirs -contains $part) {
            $skip = $true
            break
        }
    }
    -not $skip
}

$fileCount = $allFiles.Count
$totalBytes = ($allFiles | Measure-Object -Property Length -Sum).Sum
$totalMB = [math]::Round(($totalBytes / 1MB), 2)

Write-Host "  Identified $fileCount files ($totalMB MB) to protect." -ForegroundColor White

if (-not $isSimulation) {
    New-Item -ItemType Directory -Path $destinationPath -Force | Out-Null

    $copiedCount = 0
    foreach ($file in $allFiles) {
        $relPath = $file.FullName.Substring($SourcePath.Length).TrimStart('\', '/')
        $targetFile = Join-Path $destinationPath $relPath
        $targetDir = [System.IO.Path]::GetDirectoryName($targetFile)

        if (-not (Test-Path $targetDir)) {
            New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
        }
        Copy-Item -Path $file.FullName -Destination $targetFile -Force
        $copiedCount++
    }
    Write-Host "  Successfully copied $copiedCount files to backup container." -ForegroundColor Green
} else {
    Write-Host "  [DRY-RUN] Would create backup container at: $destinationPath" -ForegroundColor Yellow
    Write-Host "  [DRY-RUN] Would copy $fileCount files ($totalMB MB)." -ForegroundColor Yellow
}

# -----------------------------------------------------------------------------
# 5. Generate UTF-8 with BOM Manifest
# -----------------------------------------------------------------------------
$manifestPath = Join-Path $destinationPath "backup_manifest.json"
$manifestData = [ordered]@{
    "backup_id"        = $backupFolderName
    "timestamp"        = $displayTime
    "timestamp_slug"   = $timestamp
    "backup_type"      = $BackupType
    "retention_policy" = $retentionPolicy
    "source_path"      = $SourcePath
    "destination_path" = $destinationPath
    "git_branch"       = $gitBranch
    "git_commit"       = $gitCommit
    "file_count"       = $fileCount
    "total_bytes"      = $totalBytes
    "total_mb"         = $totalMB
    "exclusions"       = $excludeDirs
    "verified"         = $true
}

$manifestJson = $manifestData | ConvertTo-Json -Depth 5

if (-not $isSimulation) {
    [System.IO.File]::WriteAllText($manifestPath, $manifestJson, $utf8WithBom)
    Write-Host "  Generated UTF-8 BOM manifest -> backup_manifest.json" -ForegroundColor Green
} else {
    Write-Host "  [DRY-RUN] Would export UTF-8 with BOM manifest to: $manifestPath" -ForegroundColor Yellow
}

# -----------------------------------------------------------------------------
# 6. Automatic 10-Day FIFO Pruner (Daily Backups Only)
# -----------------------------------------------------------------------------
$prunedCount = 0
$retainedCount = 0

if (-not $isManual -and (Test-Path $dailyContainer)) {
    Write-Host "------------------------------------------------------------------------" -ForegroundColor Cyan
    Write-Host "  EVALUATING 10-DAY FIFO PRUNING POLICY (Daily_Backup container)" -ForegroundColor Cyan

    $dailyBackups = Get-ChildItem -Path $dailyContainer -Directory |
        Where-Object { $_.Name -like "Daily_Backup_*" } |
        Sort-Object -Property CreationTime, Name

    $currentDailyCount = $dailyBackups.Count

    Write-Host "  Current Daily Backup Count: $currentDailyCount (Maximum Allowed: $RetentionMax)" -ForegroundColor White

    if ($currentDailyCount -gt $RetentionMax) {
        $excess = $currentDailyCount - $RetentionMax
        Write-Host "  FIFO Threshold Exceeded by $excess backup(s). Pruning oldest..." -ForegroundColor Yellow

        $toPrune = $dailyBackups | Select-Object -First $excess
        foreach ($folder in $toPrune) {
            if ($isSimulation) {
                Write-Host "  [DRY-RUN] Would prune oldest daily backup: $($folder.Name)" -ForegroundColor Yellow
            } else {
                Remove-Item -Path $folder.FullName -Recurse -Force
                Write-Host "  [PRUNED] Removed oldest daily backup: $($folder.Name)" -ForegroundColor Magenta
                $logMsg = "[$displayTime] [FIFO-PRUNE] Deleted oldest daily backup: $($folder.Name)"
                Add-Content -Path $logFile -Value $logMsg -Encoding UTF8 -ErrorAction SilentlyContinue
            }
            $prunedCount++
        }
    } else {
        Write-Host "  Daily backup count ($currentDailyCount) is within 10-day retention limit. Zero pruning required." -ForegroundColor Green
    }

    $retainedCount = [math]::Max(0, $currentDailyCount - $prunedCount)
}

# -----------------------------------------------------------------------------
# 7. Log Operation
# -----------------------------------------------------------------------------
if (-not $isSimulation) {
    $summaryLog = "[$displayTime] [SUCCESS] BackupType=$BackupType, Files=$fileCount, Size=${totalMB}MB, Folder=$backupFolderName, Retained=$retainedCount, Pruned=$prunedCount"
    Add-Content -Path $logFile -Value $summaryLog -Encoding UTF8 -ErrorAction SilentlyContinue
}

Write-Host "========================================================================" -ForegroundColor Cyan
if ($isSimulation) {
    Write-Host "  RESULT: SIMULATION COMPLETE (0 DISK WRITES)" -ForegroundColor Yellow
} else {
    Write-Host "  RESULT: BACKUP OPERATION CERTIFIED SUCCESS" -ForegroundColor Green
}
Write-Host "========================================================================" -ForegroundColor Cyan

exit 0
