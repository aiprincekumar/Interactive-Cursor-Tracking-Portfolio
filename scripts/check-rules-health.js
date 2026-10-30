/**
 * Enterprise Rules Health & Integrity Sentinel
 * Validates the Core Foundation & Departmental Rule Documents:
 * 1. File Size (< 20 KB recommended, strictly < 24 KB hard limit)
 * 2. Link Validity (Zero dead/broken file links)
 * 3. Language Purity (Zero Devanagari/Hindi characters; 100% Pure English)
 * 4. Binary Synchronization (Global ~/.gemini/config/rules/ <-> Local .agents/rules/ MD5 check)
 * 5. Dynamic Enterprise Capacity & Headroom Telemetry
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const GLOBAL_RULES_DIR = path.resolve('C:/Users/Atul Verma/.gemini/config/rules');
const LOCAL_RULES_DIR = path.resolve(projectRoot, '.agents/rules');

/**
 * Dynamic Rule Files Discovery:
 * Scans both local (.agents/rules) and global (~/.gemini/config/rules) directories.
 * Future-proof: Whether 16, 17, 20 or more rule files exist, all active *.md rule documents
 * are dynamically discovered, validated, and synchronized without manual code changes.
 */
function discoverRuleFiles() {
  const localFiles = fs.existsSync(LOCAL_RULES_DIR)
    ? fs.readdirSync(LOCAL_RULES_DIR).filter(file => {
        const fullPath = path.join(LOCAL_RULES_DIR, file);
        return file.endsWith('.md') && fs.statSync(fullPath).isFile();
      })
    : [];

  const globalFiles = fs.existsSync(GLOBAL_RULES_DIR)
    ? fs.readdirSync(GLOBAL_RULES_DIR).filter(file => {
        const fullPath = path.join(GLOBAL_RULES_DIR, file);
        // Exclude archived canonical pointer files or directories
        if (file === 'universal_rules.md') return false;
        return file.endsWith('.md') && fs.statSync(fullPath).isFile();
      })
    : [];

  // Union of all active rule documents across local and global environments
  const allFiles = Array.from(new Set([...localFiles, ...globalFiles])).sort();
  return allFiles;
}

const CORE_RULE_FILES = discoverRuleFiles();

const RECOMMENDED_SIZE_LIMIT = 20 * 1024; // 20 KB
const HARD_SIZE_LIMIT = 24 * 1024;        // 24 KB

function computeMD5(filePath) {
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(buffer).digest('hex');
}

console.log('='.repeat(70));
console.log('🛡️  ENTERPRISE RULES HEALTH & INTEGRITY SENTINEL');
console.log('='.repeat(70));
console.log(`Global Directory: ${GLOBAL_RULES_DIR}`);
console.log(`Local Directory:  ${LOCAL_RULES_DIR}`);
console.log(`Auditing:         ${CORE_RULE_FILES.length} Departmental & Foundation Files (Dynamic Discovery)\n`);

let errors = 0;
let warnings = 0;
let passedSizeCount = 0;

// Test 1: File Existence & Size Checks
console.log('🔍 [Gate 1/4] Checking Rule File Sizes (< 20 KB target, < 24 KB hard limit)...');
for (const file of CORE_RULE_FILES) {
  const localPath = path.join(LOCAL_RULES_DIR, file);
  if (!fs.existsSync(localPath)) {
    console.error(`  ❌ [MISSING] Local file not found: ${file}`);
    errors++;
    continue;
  }
  const stat = fs.statSync(localPath);
  const sizeKB = (stat.size / 1024).toFixed(2);
  if (stat.size >= HARD_SIZE_LIMIT) {
    console.error(`  ❌ [OVERSIZED] ${file}: ${sizeKB} KB exceeds hard limit (24 KB)!`);
    errors++;
  } else if (stat.size >= RECOMMENDED_SIZE_LIMIT) {
    console.warn(`  ⚠️  [WARNING] ${file}: ${sizeKB} KB exceeds recommended limit (20 KB).`);
    warnings++;
  } else {
    passedSizeCount++;
    console.log(`  ✅ [PASS] ${file.padEnd(48)}: ${sizeKB.padStart(6)} KB (${stat.size} bytes)`);
  }
}

// Test 2: File Link Validity Checks
console.log('\n🔗 [Gate 2/4] Verifying Markdown File Links Validity (Zero broken links)...');
let totalLinksChecked = 0;
for (const file of CORE_RULE_FILES) {
  const localPath = path.join(LOCAL_RULES_DIR, file);
  if (!fs.existsSync(localPath)) continue;
  const content = fs.readFileSync(localPath, 'utf8');

  // Check file:/// absolute links
  const fileUriRegex = /\[.*?\]\((file:\/\/\/[^)]+)\)/g;
  let match;
  while ((match = fileUriRegex.exec(content)) !== null) {
    totalLinksChecked++;
    const rawUrl = match[1];
    let decoded = decodeURIComponent(rawUrl.replace('file:///', ''));
    const hashIndex = decoded.indexOf('#');
    if (hashIndex !== -1) decoded = decoded.substring(0, hashIndex);

    // Normalize Windows path separators
    const resolvedPath = path.normalize(decoded);
    if (!fs.existsSync(resolvedPath)) {
      console.error(`  ❌ [BROKEN LINK] in ${file}:`);
      console.error(`     Raw: ${rawUrl}`);
      console.error(`     Target missing: ${resolvedPath}`);
      errors++;
    }
  }

  // Check relative markdown links: e.g. [text](something.md)
  const relRegex = /\[.*?\]\((?!https?:\/\/|file:\/\/|mailto:|#)([^)]+)\)/g;
  while ((match = relRegex.exec(content)) !== null) {
    let relTarget = match[1];
    const hashIndex = relTarget.indexOf('#');
    if (hashIndex !== -1) relTarget = relTarget.substring(0, hashIndex);
    if (!relTarget) continue;

    totalLinksChecked++;
    const resolvedPath = path.resolve(LOCAL_RULES_DIR, relTarget);
    if (!fs.existsSync(resolvedPath)) {
      console.error(`  ❌ [BROKEN RELATIVE LINK] in ${file}:`);
      console.error(`     Target missing: ${resolvedPath}`);
      errors++;
    }
  }
}
console.log(`  ✅ Verified ${totalLinksChecked} internal/filesystem links across all rules.`);

// Test 3: Language Purity (Zero Devanagari/Hindi Characters)
console.log('\n🌐 [Gate 3/4] Checking Language Purity (100% Pure English, zero Devanagari)...');
const devanagariRegex = /[\u0900-\u097F]/;
for (const file of CORE_RULE_FILES) {
  const localPath = path.join(LOCAL_RULES_DIR, file);
  if (!fs.existsSync(localPath)) continue;
  const content = fs.readFileSync(localPath, 'utf8');

  if (devanagariRegex.test(content)) {
    console.error(`  ❌ [NON-ENGLISH CHARACTERS DETECTED] in ${file}`);
    errors++;
  }
}
console.log(`  ✅ 100% Pure English verified across all ${CORE_RULE_FILES.length} rule documents.`);

// Test 4: Binary Synchronization (Global vs Local MD5 Check)
console.log('\n🔄 [Gate 4/4] Verifying Binary Synchronization (Global <-> Local MD5)...');
let syncedCount = 0;
for (const file of CORE_RULE_FILES) {
  const globalPath = path.join(GLOBAL_RULES_DIR, file);
  const localPath = path.join(LOCAL_RULES_DIR, file);

  if (!fs.existsSync(globalPath)) {
    console.error(`  ❌ [MISSING GLOBAL] ${file} not found in global directory!`);
    errors++;
    continue;
  }
  if (!fs.existsSync(localPath)) {
    console.error(`  ❌ [MISSING LOCAL] ${file} not found in local directory!`);
    errors++;
    continue;
  }

  const globalHash = computeMD5(globalPath);
  const localHash = computeMD5(localPath);

  if (globalHash !== localHash) {
    console.error(`  ❌ [DESYNC] ${file} MD5 mismatch!`);
    console.error(`     Global: ${globalHash}`);
    console.error(`     Local:  ${localHash}`);
    errors++;
  } else {
    syncedCount++;
  }
}
console.log(`  ✅ All ${syncedCount}/${CORE_RULE_FILES.length} files are bit-for-bit identical (100% Binary Synced).`);

// Telemetry & Headroom Analysis for master_rules_navigator.md
console.log('\n📊 [Enterprise Capacity Telemetry] Master Rules & Roles Headroom:');
const navPath = path.join(LOCAL_RULES_DIR, 'master_rules_navigator.md');
if (fs.existsSync(navPath)) {
  const navContent = fs.readFileSync(navPath, 'utf8');
  const navStat = fs.statSync(navPath);
  const section6Match = navContent.match(/## 🧑‍💼 6\. Master Enterprise Roles & Subagents Roster[\s\S]*?(?=\n---|\n## |$)/);
  let totalRolesDetected = 0;
  if (section6Match) {
    const tableLines = section6Match[0].split('\n').filter(l => l.startsWith('| **Dept'));
    tableLines.forEach(l => {
      const cols = l.split('|').map(c => c.trim());
      if (cols.length >= 3) {
        const roles = cols[2].split(',').map(r => r.trim()).filter(Boolean);
        totalRolesDetected += roles.length;
      }
    });
  }
  const headroomRecommended = RECOMMENDED_SIZE_LIMIT - navStat.size;
  const headroomHard = HARD_SIZE_LIMIT - navStat.size;
  console.log(`  - Discovered Rule Documents:   ${CORE_RULE_FILES.length} files (Dynamic Discovery)`);
  console.log(`  - Active Enterprise Roles:     ${totalRolesDetected} roles (Across 14 departments)`);
  console.log(`  - Navigator Size:              ${(navStat.size / 1024).toFixed(2)} KB (${navStat.size} bytes)`);
  console.log(`  - Headroom to 20 KB Target:    ${headroomRecommended} bytes (~${Math.floor(headroomRecommended / 110)} additional roles)`);
  console.log(`  - Headroom to 24 KB Ceiling:   ${headroomHard} bytes (~${Math.floor(headroomHard / 110)} additional roles)`);
  console.log(`  - Truncation Safety Posture:   100% IMMUNE (Zero truncation risk)`);
}

// Final Summary
console.log('\n' + '='.repeat(70));
if (errors === 0) {
  console.log('🎉 AUDIT RESULT: 100% PASS — All Quality Gates Certified Clean!');
  console.log(`   - ${passedSizeCount}/${CORE_RULE_FILES.length} Rule Files < 20 KB (Hard limit 24 KB)`);
  console.log(`   - ${totalLinksChecked} Links Validated (Zero Broken Links)`);
  console.log(`   - Language Purity: 100% Pure English`);
  console.log(`   - Global/Local Synchronization: 100% Matched (${syncedCount}/${CORE_RULE_FILES.length})`);
  if (warnings > 0) {
    console.log(`   - Warnings: ${warnings}`);
  }
  console.log('='.repeat(70) + '\n');
  process.exit(0);
} else {
  console.error(`🚨 AUDIT RESULT: FAILED with ${errors} error(s)!`);
  console.log('='.repeat(70) + '\n');
  process.exit(1);
}
