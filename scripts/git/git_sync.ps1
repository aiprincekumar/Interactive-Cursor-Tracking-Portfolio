<#
.SYNOPSIS
    git_sync.ps1 - Automated Git Synchronization and Verification Engine.

.DESCRIPTION
    Autonomous Git synchronization tool designed for robust developer and CI workflows.
    - Inspects working tree status using `git status --porcelain`.
    - Enforces strict sensitive-file filters (.env*, *.pem, *.key, *secret*, *credential*, id_rsa*).
    - Blocks and un-stages sensitive files to prevent credential leaks.
    - Auto-generates standardized commit messages from `changes_log` or modified files if omitted.
    - Fetches and pulls remote changes with `--rebase`.
    - In case of rebase conflict, safely aborts rebase and stashes into safety backup branch/stash.
    - Pushes local commits to current tracking branch.
    - Outputs a 3-point terminal verification block.
    - Exits 0 on success.

.PARAMETER Message
    Optional custom commit message. If omitted, automatically derived from
    `changes_log/summary/changes_summary.md` or the list of modified files.

.PARAMETER Remote
    The git remote name (default: "origin").

.EXAMPLE
    .\git_sync.ps1
    .\git_sync.ps1 -Message "feat: add real-time telemetry stream"
#>

[CmdletBinding()]
param(
    [Parameter(Position = 0, Mandatory = $false)]
    [string]$Message = "",

    [Parameter(Mandatory = $false)]
    [string]$Remote = "origin"
)

$ErrorActionPreference = "Continue"
$ProgressPreference = "SilentlyContinue"

# -----------------------------------------------------------------------------
# 1. Helper Functions
# -----------------------------------------------------------------------------

function Test-IsSensitiveFile {
    param([string]$FilePath)

    if ([string]::IsNullOrWhiteSpace($FilePath)) { return $false }

    $fileName = [System.IO.Path]::GetFileName($FilePath).ToLowerInvariant()
    $normalizedPath = $FilePath.Replace('\', '/').ToLowerInvariant()

    # Environment and Key patterns
    if ($fileName -match '^\.env' -or $fileName -like '*.env*') { return $true }
    if ($fileName -like '*.pem' -or $fileName -like '*.key' -or $fileName -like '*.p12' -or $fileName -like '*.pfx') { return $true }
    if ($fileName -like 'id_rsa*' -or $fileName -like 'id_ed25519*' -or $fileName -like 'id_dsa*') { return $true }

    # Secret and credential keywords in filename or path
    if ($fileName -match 'secret' -or $normalizedPath -match '/secrets?/') { return $true }
    if ($fileName -match 'credential' -or $normalizedPath -match '/credentials?/') { return $true }
    if ($fileName -match 'token' -and ($fileName -like '*.json' -or $fileName -like '*.txt' -or $fileName -like '*.env*')) { return $true }

    return $false
}

function Get-AutoCommitMessage {
    param([string]$RepoRoot)

    # Strategy A: Read latest entry from changes_log/summary/changes_summary.md
    $summaryPath = Join-Path $RepoRoot "changes_log\summary\changes_summary.md"
    if (Test-Path $summaryPath) {
        try {
            $lines = Get-Content -Path $summaryPath -Encoding UTF8 -ErrorAction Stop
            foreach ($line in $lines) {
                # Table row match: | **CHG-YYYYMMDD-XXX** | Timestamp | Author | Files | Description |
                if ($line -match '\|\s*\*\*([A-Za-z0-9_-]+)\*\*\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|') {
                    $chgId = $Matches[1].Trim()
                    $desc = $Matches[5].Trim()
                    if ($desc.Length -gt 72) {
                        $desc = $desc.Substring(0, 69) + "..."
                    }
                    return "chore/sync: [$chgId] $desc"
                }
            }
        } catch {
            # Fall through to Strategy B
        }
    }

    # Strategy B: Summarize from modified/added files
    $changedFiles = & git status --short 2>&1 | ForEach-Object {
        $clean = ($_ -replace '^[MADRCU?! ]+\s+', '').Trim().Trim('"').Trim("'")
        [System.IO.Path]::GetFileName($clean)
    } | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | Select-Object -Unique

    if ($changedFiles -and $changedFiles.Count -gt 0) {
        $sample = ($changedFiles | Select-Object -First 3) -join ", "
        if ($changedFiles.Count -gt 3) {
            $sample += " (+$($changedFiles.Count - 3) more)"
        }
        return "chore/sync: update $sample"
    }

    # Strategy C: Standard fallback timestamp
    $stamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    return "chore/sync: automated workspace sync at $stamp"
}

function Display-VerificationBlock {
    param(
        [string]$RemoteName,
        [string]$BranchName,
        [string]$PushStatusMessage
    )

    Write-Host ""
    Write-Host "================================================================================" -ForegroundColor Cyan
    Write-Host "                       GIT SYNC 3-POINT VERIFICATION BLOCK                       " -ForegroundColor Cyan
    Write-Host "================================================================================" -ForegroundColor Cyan

    # [1] git log -1 --stat
    Write-Host "[1] Latest Commit Summary (git log -1 --stat):" -ForegroundColor Green
    & git log -1 --stat
    Write-Host ""

    # [2] Push status
    Write-Host "[2] Push Status:" -ForegroundColor Green
    Write-Host "  Target Remote : $RemoteName" -ForegroundColor Gray
    Write-Host "  Target Branch : $BranchName" -ForegroundColor Gray
    Write-Host "  Push Result   : $PushStatusMessage" -ForegroundColor Green
    $localHeadRaw = (& git rev-parse HEAD 2>&1)
    $remoteHeadRaw = (& git rev-parse "$RemoteName/$BranchName" 2>&1)
    if ($LASTEXITCODE -eq 0 -and $localHeadRaw) { Write-Host "  Local HEAD    : $($localHeadRaw.ToString().Trim())" -ForegroundColor Gray }
    if ($remoteHeadRaw -and -not ($remoteHeadRaw -match 'fatal')) { Write-Host "  Remote HEAD   : $($remoteHeadRaw.ToString().Trim())" -ForegroundColor Gray }
    Write-Host ""

    # [3] git status (confirming working tree clean)
    Write-Host "[3] Working Tree Status (git status):" -ForegroundColor Green
    $remaining = (& git status --short 2>&1)
    if ([string]::IsNullOrWhiteSpace($remaining)) {
        Write-Host "  Status: Working tree clean (zero uncommitted/untracked changes)" -ForegroundColor Green
    } else {
        Write-Host "  Status: Protected / uncommitted files remaining in working tree:" -ForegroundColor Yellow
        $remaining | ForEach-Object { Write-Host "    $_" -ForegroundColor Yellow }
    }

    Write-Host "================================================================================" -ForegroundColor Cyan
    Write-Host ""
}

# -----------------------------------------------------------------------------
# 2. Pre-Flight Verification & Context Discovery
# -----------------------------------------------------------------------------

Write-Host ">>> Starting Git Autonomous Sync Engine..." -ForegroundColor Cyan

$repoRootRaw = (& git rev-parse --show-toplevel 2>&1)
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($repoRootRaw)) {
    Write-Error "CRITICAL: Current directory is not within a Git repository."
    exit 1
}
$repoRoot = $repoRootRaw.ToString().Trim()

$currentBranchRaw = (& git branch --show-current 2>&1)
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($currentBranchRaw)) {
    Write-Error "CRITICAL: Could not determine current branch (detached HEAD or uninitialized repo)."
    exit 1
}
$currentBranch = $currentBranchRaw.ToString().Trim()
Write-Host "  Repository Root : $repoRoot" -ForegroundColor Gray
Write-Host "  Current Branch  : $currentBranch" -ForegroundColor Gray

# Ensure Git Author Identity Standards (Universal Rule 16)
$currentUserName = & git config user.name 2>&1
$currentUserEmail = & git config user.email 2>&1
if ([string]::IsNullOrWhiteSpace($currentUserName) -or $currentUserName -match 'fatal') {
    & git config user.name "aiprincekumar" 2>&1 | Out-Null
    Write-Host "  Configured git user.name: aiprincekumar" -ForegroundColor Gray
}
if ([string]::IsNullOrWhiteSpace($currentUserEmail) -or $currentUserEmail -match 'fatal') {
    & git config user.email "aiprincekumar010100@gmail.com" 2>&1 | Out-Null
    Write-Host "  Configured git user.email: aiprincekumar010100@gmail.com" -ForegroundColor Gray
}

# -----------------------------------------------------------------------------
# 3. Sensitive File Filter & Safety Scan
# -----------------------------------------------------------------------------

$porcelain = (& git status --porcelain 2>&1)
$sensitiveFiles = @()

if ($porcelain -and $LASTEXITCODE -eq 0) {
    foreach ($line in $porcelain) {
        if ([string]::IsNullOrWhiteSpace($line)) { continue }
        $lineStr = $line.ToString()
        if ($lineStr.Length -lt 4) { continue }
        $rawPath = $lineStr.Substring(3).Trim()
        if ($rawPath -match ' -> ') {
            $rawPath = ($rawPath -split ' -> ')[-1].Trim()
        }
        $cleanPath = $rawPath.Trim('"').Trim("'")

        if (Test-IsSensitiveFile -FilePath $cleanPath) {
            $sensitiveFiles += $cleanPath
        }
    }
}

if ($sensitiveFiles.Count -gt 0) {
    Write-Host ""
    Write-Host "================================================================================" -ForegroundColor Yellow
    Write-Host " [SECURITY GUARD] Sensitive file(s) detected in working tree! Staging BLOCKED:  " -ForegroundColor Yellow
    Write-Host "================================================================================" -ForegroundColor Yellow
    foreach ($sf in $sensitiveFiles) {
        Write-Host "  [BLOCKED] $sf" -ForegroundColor Red
    }
    Write-Host " These files will NOT be added to git index or committed to remote." -ForegroundColor Yellow
    Write-Host "================================================================================" -ForegroundColor Yellow
    Write-Host ""
}

# -----------------------------------------------------------------------------
# 4. Check for Clean Working Tree & Unpushed Commits
# -----------------------------------------------------------------------------

$configuredRemotes = (& git remote 2>&1)
$hasRemote = ($configuredRemotes -contains $Remote)

if ([string]::IsNullOrWhiteSpace($porcelain)) {
    Write-Host "  Working tree is clean. Checking remote synchronization..." -ForegroundColor Gray
    
    $aheadCount = 0
    if ($hasRemote) {
        $null = & git fetch $Remote $currentBranch 2>&1
        $remoteBranchExists = (& git ls-remote --heads $Remote $currentBranch 2>&1)
        if ($LASTEXITCODE -eq 0 -and -not [string]::IsNullOrWhiteSpace($remoteBranchExists)) {
            $aheadStr = (& git rev-list "$Remote/$currentBranch..HEAD" --count 2>&1)
            if ($LASTEXITCODE -eq 0) {
                [int]::TryParse($aheadStr.ToString().Trim(), [ref]$aheadCount) | Out-Null
            }
        }
    }

    if ($aheadCount -eq 0) {
        Write-Host "[SUCCESS] Working tree is clean and up to date with remote. Nothing to commit or push." -ForegroundColor Green
        Display-VerificationBlock -RemoteName $Remote -BranchName $currentBranch -PushStatusMessage "Working tree clean, up to date with remote"
        exit 0
    } else {
        Write-Host "[INFO] Working tree is clean, but local branch has $aheadCount unpushed commit(s). Proceeding to push." -ForegroundColor Cyan
    }
}

# -----------------------------------------------------------------------------
# 5. Staging (with Sensitive Exclusions)
# -----------------------------------------------------------------------------

Write-Host "  Staging modified and untracked changes (excluding sensitive patterns)..." -ForegroundColor Cyan
$null = & git add -A -- ":(exclude)*.env*" ":(exclude)*.pem" ":(exclude)*.key" ":(exclude)*secret*" ":(exclude)*credential*" ":(exclude)id_rsa*" ":(exclude)id_ed25519*" 2>&1

# Failsafe: check index for any accidentally staged sensitive files and unstage them immediately
$stagedFiles = (& git diff --name-only --cached 2>&1)
if ($stagedFiles -and $LASTEXITCODE -eq 0) {
    foreach ($staged in $stagedFiles) {
        $stagedStr = $staged.ToString().Trim()
        if (Test-IsSensitiveFile -FilePath $stagedStr) {
            Write-Warning "[SECURITY RESET] Unstaging sensitive file from index: $stagedStr"
            $null = & git reset HEAD -- $stagedStr 2>&1
        }
    }
}

$finalStaged = (& git diff --name-only --cached 2>&1)

# -----------------------------------------------------------------------------
# 6. Commit Staged Changes
# -----------------------------------------------------------------------------

if ($finalStaged -and $LASTEXITCODE -eq 0 -and -not [string]::IsNullOrWhiteSpace($finalStaged)) {
    if ([string]::IsNullOrWhiteSpace($Message)) {
        $Message = Get-AutoCommitMessage -RepoRoot $repoRoot
    }
    Write-Host "  Committing staged changes with message: '$Message'..." -ForegroundColor Cyan
    $commitOutput = (& git commit -m "$Message" 2>&1)
    if ($LASTEXITCODE -ne 0) {
        Write-Error "CRITICAL: git commit failed with code $LASTEXITCODE. Output: $commitOutput"
        exit 1
    }
    Write-Host "[COMMIT OK] Changes successfully committed." -ForegroundColor Green
} else {
    Write-Host "  No staged files to commit." -ForegroundColor Gray
}

# -----------------------------------------------------------------------------
# 7. Remote Pull with Rebase & Push
# -----------------------------------------------------------------------------

$pushStatusText = "Local commits preserved"

if ($hasRemote) {
    Write-Host "  Checking remote '$Remote/$currentBranch'..." -ForegroundColor Cyan
    $null = & git fetch $Remote $currentBranch 2>&1

    $remoteBranchExists = (& git ls-remote --heads $Remote $currentBranch 2>&1)
    if ($LASTEXITCODE -eq 0 -and -not [string]::IsNullOrWhiteSpace($remoteBranchExists)) {
        $behindStr = (& git rev-list "HEAD..$Remote/$currentBranch" --count 2>&1)
        $behindCount = 0
        if ($LASTEXITCODE -eq 0 -and [int]::TryParse($behindStr.ToString().Trim(), [ref]$behindCount) -and $behindCount -gt 0) {
            Write-Host "  Remote has $behindCount new commit(s). Pulling with --rebase..." -ForegroundColor Cyan
            $pullOutput = (& git pull --rebase $Remote $currentBranch 2>&1)
            if ($LASTEXITCODE -ne 0) {
                Write-Warning "[CONFLICT] Rebase failed due to merge conflicts! Initiating safety protocols..."
                $null = & git rebase --abort 2>&1
                
                $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
                $backupBranch = "backup_sync_$timestamp"
                $null = & git branch $backupBranch 2>&1
                $null = & git stash push -m "git_sync_safety_backup_$timestamp" 2>&1

                Write-Error "CRITICAL: Rebase aborted to prevent code loss. Your changes are saved in backup branch '$backupBranch' and git stash. Please resolve conflicts manually."
                exit 1
            }
            Write-Host "[REBASE OK] Rebase completed cleanly." -ForegroundColor Green
        }
    }

    # Push to current branch
    Write-Host "  Pushing commits to '$Remote $currentBranch'..." -ForegroundColor Cyan
    $pushOutput = (& git push $Remote $currentBranch 2>&1)
    if ($LASTEXITCODE -ne 0) {
        Write-Error "CRITICAL: git push failed: $pushOutput"
        exit 1
    }
    Write-Host "[PUSH OK] Successfully pushed to '$Remote/$currentBranch'." -ForegroundColor Green
    $pushStatusText = "Successfully pushed to $Remote/$currentBranch"
} else {
    Write-Warning "[NOTICE] Remote '$Remote' is not configured. Skipping remote pull and push."
    $pushStatusText = "Committed locally (no remote configured)"
}

# -----------------------------------------------------------------------------
# 8. 3-Point Terminal Verification Block
# -----------------------------------------------------------------------------

Display-VerificationBlock -RemoteName $Remote -BranchName $currentBranch -PushStatusMessage $pushStatusText

Write-Host ">>> Git Autonomous Sync completed successfully." -ForegroundColor Green
exit 0
