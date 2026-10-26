<#
.SYNOPSIS
    verify_git_sync.ps1 - Automated Git Synchronization & Clean State Verifier.

.DESCRIPTION
    Validates that:
    1. Working tree is completely clean (`git status --porcelain` is empty).
    2. Local HEAD commit hash matches the remote tracking branch (`git rev-parse HEAD` vs `git rev-parse origin/<branch>`).
    3. Outputs a structured JSON summary.
    4. Exits with 0 if PASS, 1 if FAIL.

.PARAMETER Remote
    The git remote to verify against (default: "origin").

.PARAMETER SkipFetch
    Switch to bypass network fetch and verify against local tracking cache.

.EXAMPLE
    .\verify_git_sync.ps1
    .\verify_git_sync.ps1 -Remote origin -SkipFetch
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $false)]
    [string]$Remote = "origin",

    [Parameter(Mandatory = $false)]
    [switch]$SkipFetch = $false
)

$ErrorActionPreference = "Continue"
$ProgressPreference = "SilentlyContinue"

$repoRootRaw = (& git rev-parse --show-toplevel 2>&1)
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($repoRootRaw)) {
    $errObj = [PSCustomObject]@{
        status             = "FAIL"
        branch             = ""
        local_commit       = ""
        remote_commit      = ""
        synced             = $false
        clean_working_tree = $false
        error              = "Not a git repository"
    }
    $errObj | ConvertTo-Json -Depth 5
    exit 1
}

$currentBranchRaw = (& git branch --show-current 2>&1)
if ($LASTEXITCODE -eq 0 -and -not [string]::IsNullOrWhiteSpace($currentBranchRaw)) {
    $currentBranch = $currentBranchRaw.ToString().Trim()
} else {
    $currentBranch = "HEAD"
}

# Fetch remote tracking branch quietly unless -SkipFetch is specified
if (-not $SkipFetch) {
    $null = (& git fetch $Remote $currentBranch 2>&1)
}

# [a] Check working tree cleanliness
$porcelainRaw = (& git status --porcelain 2>&1)
$isCleanWorkingTree = ($LASTEXITCODE -eq 0 -and [string]::IsNullOrWhiteSpace($porcelainRaw))

# [b] Compare local HEAD commit hash with remote tracking branch
$localCommitRaw = (& git rev-parse HEAD 2>&1)
$localCommit = if ($LASTEXITCODE -eq 0 -and -not [string]::IsNullOrWhiteSpace($localCommitRaw)) {
    $localCommitRaw.ToString().Trim()
} else { "" }

$remoteCommitRaw = (& git rev-parse "$Remote/$currentBranch" 2>&1)
$remoteCommit = if ($LASTEXITCODE -eq 0 -and -not [string]::IsNullOrWhiteSpace($remoteCommitRaw)) {
    $remoteCommitRaw.ToString().Trim()
} else { "" }

$isSynced = ($localCommit -ne "" -and $remoteCommit -ne "" -and $localCommit -eq $remoteCommit)
$isPass = ($isCleanWorkingTree -and $isSynced)

$statusValue = if ($isPass) { "PASS" } else { "FAIL" }

$summary = [PSCustomObject]@{
    status             = $statusValue
    branch             = $currentBranch
    local_commit       = $localCommit
    remote_commit      = $remoteCommit
    synced             = [bool]$isSynced
    clean_working_tree = [bool]$isCleanWorkingTree
}

$summaryJson = $summary | ConvertTo-Json -Depth 5
Write-Output $summaryJson

if ($isPass) {
    exit 0
} else {
    exit 1
}
