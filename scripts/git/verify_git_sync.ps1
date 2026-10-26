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

$repoRoot = (git rev-parse --show-toplevel 2>$null)
if (-not $repoRoot) {
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

$currentBranch = (git branch --show-current 2>$null)
if ($currentBranch) {
    $currentBranch = $currentBranch.Trim()
} else {
    $currentBranch = "HEAD"
}

# Fetch remote tracking branch quietly unless -SkipFetch is specified
if (-not $SkipFetch) {
    git fetch $Remote $currentBranch 2>$null | Out-Null
}

# [a] Check working tree cleanliness
$porcelain = (git status --porcelain 2>$null)
$isCleanWorkingTree = [string]::IsNullOrWhiteSpace($porcelain)

# [b] Compare local HEAD commit hash with remote tracking branch
$localCommit = (git rev-parse HEAD 2>$null)
if ($localCommit) { $localCommit = $localCommit.Trim() } else { $localCommit = "" }

$remoteCommit = (git rev-parse "$Remote/$currentBranch" 2>$null)
if ($remoteCommit) { $remoteCommit = $remoteCommit.Trim() } else { $remoteCommit = "" }

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
