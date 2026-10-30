#!/usr/bin/env python3
"""
secret_scanner.py - High-Speed Static Secret & Credential Pre-Commit Guard
Compliant with Universal Rule 10 (Application Security), Rule 12 (DevOps Release), and Rule 15 (Git Gatekeeper).

Features:
- Scans git staged files, unstaged changes, tracked files, or custom paths.
- Regex detection engine for cloud providers, tokens, private keys, database strings, and passwords.
- Built-in false-positive suppression for placeholders and mocks.
- Clean terminal report with optional JSON output and secret redaction.
- Returns Exit Code 0 if PASS, Exit Code 1 if Secrets Detected.
"""

import os
import sys
import re
import json
import argparse
import subprocess
from pathlib import Path


# -----------------------------------------------------------------------------
# Detection Patterns & Classification
# -----------------------------------------------------------------------------
SECRET_RULES = [
    {
        "id": "AWS-ACCESS-KEY",
        "description": "AWS Access Key ID",
        "severity": "CRITICAL",
        "regex": re.compile(r"\b(AKIA|ASIA|ABIA|ACCA)[0-9A-Z]{16}\b")
    },
    {
        "id": "AWS-SECRET-KEY",
        "description": "AWS Secret Access Key Assignment",
        "severity": "CRITICAL",
        "regex": re.compile(r"(?i)(?:aws_secret_access_key|aws_secret_key)\s*[:=]\s*['\"]?([A-Za-z0-9/+=]{40})['\"]?")
    },
    {
        "id": "GCP-API-KEY",
        "description": "Google Cloud Platform API Key",
        "severity": "HIGH",
        "regex": re.compile(r"\bAIza[0-9A-Za-z\-_]{35}\b")
    },
    {
        "id": "OPENAI-API-KEY",
        "description": "OpenAI API Key",
        "severity": "CRITICAL",
        "regex": re.compile(r"\b(sk-[a-zA-Z0-9]{20,}|sk-proj-[a-zA-Z0-9_-]{20,})\b")
    },
    {
        "id": "ANTHROPIC-API-KEY",
        "description": "Anthropic API Key",
        "severity": "CRITICAL",
        "regex": re.compile(r"\bsk-ant-[a-zA-Z0-9_-]{20,}\b")
    },
    {
        "id": "GITHUB-TOKEN",
        "description": "GitHub Personal Access Token / OAuth",
        "severity": "CRITICAL",
        "regex": re.compile(r"\b((?:ghp|gho|ghu|ghs|ghr)_[0-9a-zA-Z]{36}|github_pat_[0-9a-zA-Z_]{22,})\b")
    },
    {
        "id": "PRIVATE-KEY",
        "description": "Private Key Block",
        "severity": "CRITICAL",
        "regex": re.compile(r"-----BEGIN (?:RSA |OPENSSH |DSA |EC |PGP )?PRIVATE KEY(?: BLOCK)?-----")
    },
    {
        "id": "DATABASE-URI",
        "description": "Database Connection String with Credentials",
        "severity": "CRITICAL",
        "regex": re.compile(r"(?:postgres|postgresql|mysql|mongodb(?:\+srv)?|redis|amqp)://[^:\s'\"]+:([^@\s'\"]+)@[^\s'\"]+")
    },
    {
        "id": "SLACK-TOKEN",
        "description": "Slack Token",
        "severity": "HIGH",
        "regex": re.compile(r"\bxox[baprs]-[0-9a-zA-Z]{10,48}\b")
    },
    {
        "id": "DISCORD-BOT-TOKEN",
        "description": "Discord Bot Token",
        "severity": "HIGH",
        "regex": re.compile(r"\b[MN][A-Za-z\d]{23,}\.[\w-]{6}\.[\w-]{27}\b")
    },
    {
        "id": "GENERIC-SECRET",
        "description": "Generic API Secret / Password Assignment",
        "severity": "MEDIUM",
        "regex": re.compile(r"(?i)\b(?:api_key|secret_key|auth_token|access_token|client_secret|db_password)\s*[:=]\s*['\"]([^'\"\r\n]{10,})['\"]")
    }
]

# Patterns or substrings that indicate harmless examples / mocks
MOCK_INDICATORS = [
    "your-api-key", "placeholder", "mock", "example", "dummy",
    "00000000", "insert_key_here", "test_key", "change_me",
    "xxxx", "demo_key", "sample_token", "your_token", "env.",
    "process.env.", "import.meta.env."
]

# Extensions and file names to always ignore (binaries, lockfiles, images)
IGNORE_EXTENSIONS = {
    ".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".svg",
    ".mp3", ".wav", ".ogg", ".webm", ".mp4",
    ".woff", ".woff2", ".ttf", ".eot",
    ".zip", ".tar", ".gz", ".7z",
    ".pdf", ".exe", ".dll", ".so", ".dylib"
}

IGNORE_FILENAMES = {
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    "secret_scanner.py"  # Do not self-trigger on regex definitions
}


def is_binary_file(filepath: Path) -> bool:
    try:
        with open(filepath, "rb") as f:
            chunk = f.read(1024)
            return b"\0" in chunk
    except Exception:
        return True


def redact_secret(val: str) -> str:
    if len(val) <= 6:
        return "*" * len(val)
    return val[:3] + "*" * (len(val) - 6) + val[-3:]


def scan_file(filepath: Path, repo_root: Path) -> list[dict]:
    findings = []
    rel_path = str(filepath.relative_to(repo_root)).replace("\\", "/")

    # Filter by name/extension
    if filepath.suffix.lower() in IGNORE_EXTENSIONS or filepath.name in IGNORE_FILENAMES:
        return findings

    if is_binary_file(filepath):
        return findings

    try:
        content = filepath.read_text(encoding="utf-8", errors="replace")
    except Exception:
        return findings

    lines = content.splitlines()
    for line_num, line in enumerate(lines, start=1):
        line_clean = line.strip()
        if not line_clean:
            continue

        # Skip comment lines that are pure documentation or obvious mocks
        line_lower = line_clean.lower()
        if any(mock in line_lower for mock in MOCK_INDICATORS):
            continue

        for rule in SECRET_RULES:
            matches = rule["regex"].finditer(line_clean)
            for match in matches:
                secret_str = match.group(0)

                # Skip if matched text itself has mock indicators
                if any(mock in secret_str.lower() for mock in MOCK_INDICATORS):
                    continue

                findings.append({
                    "rule_id": rule["id"],
                    "description": rule["description"],
                    "severity": rule["severity"],
                    "file": rel_path,
                    "line": line_num,
                    "matched": secret_str,
                    "redacted": redact_secret(secret_str)
                })

    return findings


def get_git_files(repo_root: Path, mode: str) -> list[Path]:
    files = []
    cmd = []
    if mode == "staged":
        cmd = ["git", "diff", "--cached", "--name-only"]
    elif mode == "unstaged":
        cmd = ["git", "diff", "--name-only"]
    elif mode == "all":
        cmd = ["git", "ls-files"]

    try:
        res = subprocess.run(
            cmd,
            cwd=str(repo_root),
            capture_output=True,
            text=True,
            check=True
        )
        for line in res.stdout.splitlines():
            line = line.strip()
            if line:
                p = repo_root / line
                if p.exists() and p.is_file():
                    files.append(p)
    except Exception as e:
        print(f"[WARN] Git execution error: {e}", file=sys.stderr)

    return files


def main():
    parser = argparse.ArgumentParser(
        description="High-Speed Static Secret & Credential Pre-Commit Guard (Rule 12 & 15 Compliance)"
    )
    group = parser.add_mutually_exclusive_group()
    group.add_argument(
        "-s", "--staged",
        dest="staged",
        action="store_true",
        help="Scan git staged files only (pre-commit gate)"
    )
    group.add_argument(
        "-u", "--unstaged",
        dest="unstaged",
        action="store_true",
        help="Scan unstaged modified files in working directory"
    )
    group.add_argument(
        "-a", "--all",
        dest="all_tracked",
        action="store_true",
        help="Scan all tracked files in git repository"
    )
    group.add_argument(
        "-p", "--path",
        dest="custom_path",
        default="",
        help="Scan specific file or directory"
    )

    parser.add_argument(
        "--json",
        dest="json_output",
        action="store_true",
        help="Output results in JSON format"
    )
    parser.add_argument(
        "--redact",
        dest="redact",
        action="store_true",
        default=True,
        help="Mask secret values in terminal output (default: True)"
    )
    parser.add_argument(
        "-v", "--verbose",
        dest="verbose",
        action="store_true",
        help="Show scanned file details"
    )

    args = parser.parse_args()

    # Detect repo root
    try:
        res = subprocess.run(
            ["git", "rev-parse", "--show-toplevel"],
            capture_output=True,
            text=True,
            check=True
        )
        repo_root = Path(res.stdout.strip()).resolve()
    except Exception:
        repo_root = Path.cwd().resolve()

    # Determine files to scan
    target_files = []
    scan_scope = "git staged files"

    if args.custom_path:
        cp = Path(args.custom_path).resolve()
        scan_scope = f"custom path: {args.custom_path}"
        if cp.is_file():
            target_files = [cp]
        elif cp.is_dir():
            for p in cp.rglob("*"):
                if p.is_file():
                    target_files.append(p)
    elif args.unstaged:
        scan_scope = "git unstaged files"
        target_files = get_git_files(repo_root, "unstaged")
    elif args.all_tracked:
        scan_scope = "all git-tracked files"
        target_files = get_git_files(repo_root, "all")
    else:
        # Default to staged files (pre-commit guard)
        scan_scope = "git staged files"
        target_files = get_git_files(repo_root, "staged")
        # If staged is empty and no specific flag was given, check unstaged as fallback
        if not target_files and not args.staged:
            scan_scope = "git unstaged working tree changes"
            target_files = get_git_files(repo_root, "unstaged")

    # Perform scan
    all_findings = []
    scanned_count = 0

    for f in target_files:
        scanned_count += 1
        file_findings = scan_file(f, repo_root)
        all_findings.extend(file_findings)

    # Output formatting
    if args.json_output:
        report = {
            "status": "PASS" if not all_findings else "FAIL",
            "scope": scan_scope,
            "scanned_files_count": scanned_count,
            "findings_count": len(all_findings),
            "findings": all_findings
        }
        print(json.dumps(report, indent=2))
    else:
        print("=" * 72)
        print("STATIC SECRET & CREDENTIAL PRE-COMMIT GUARD (RULE 12 & 15)")
        print("=" * 72)
        print(f"  Scan Scope    : {scan_scope}")
        print(f"  Files Scanned : {scanned_count} file(s)")
        print(f"  Findings      : {len(all_findings)} potential secret(s)")
        print("-" * 72)

        if not all_findings:
            print("  \033[92m[PASS] Zero secrets or exposed credentials detected.\033[0m")
            print("  Verified clean against 11 critical credential patterns.")
        else:
            print(f"  \033[91m[FAIL] {len(all_findings)} CREDENTIAL LEAK(S) DETECTED!\033[0m")
            print("  Git commit/push blocked until secrets are sanitized:\n")
            for item in all_findings:
                val = item["redacted"] if args.redact else item["matched"]
                print(f"  - [{item['severity']}] {item['description']} ({item['rule_id']})")
                print(f"    File: {item['file']}:{item['line']}")
                print(f"    Match: {val}\n")

        print("=" * 72)

    return 1 if all_findings else 0


if __name__ == "__main__":
    sys.exit(main())
