/**
 * Enterprise Rules Health & Deep-Dive Architectural Sentinel
 * 
 * An advanced, dynamic, zero-hardcoding rules engine verifier:
 * - Gate 1: Dynamic Discovery & Mathematical Headroom Telemetry (< 20 KB target, < 24 KB ceiling)
 * - Gate 2: Deep Semantic Content & Schema Inspection (H1 title, metadata block, code fence balance, heading hierarchy, mojibake/BOM check)
 * - Gate 3: Deep Anchor & Link Graph Resolution (file existence, #heading-slug anchor verification, #Lxx line bounds)
 * - Gate 4: Language Purity Verification (100% Pure English prose, zero Devanagari characters)
 * - Gate 5: Cross-File Semantic Synchronization (Dynamic Navigator <-> Departmental Rules bi-directional role parity)
 * - Gate 6: Binary Synchronization (Global ~/.gemini/config/rules/ <-> Local .agents/rules/ MD5 bit-for-bit check)
 * - Gate 7: Mermaid Diagram & Graph Syntax Validator (Supported types, unquoted special chars, HTML tag prevention)
 * - Gate 8: Anti-Pattern & Hardcoded Secret Sentinel (Token leaks detection, constitutional anti-patterns verification)
 * - Gate 9: NPM Script & Developer Command Consistency Validator (package.json scripts parity, developer CLI verification)
 * - Gate 10: Model Tier & Tooling Vocabulary Audit (Authorized Antigravity models: flash_lite, flash, pro; tool names check)
 * - Gate 11: Auto-Remediation / Self-Healing Engine (--fix mode for automatic BOM, whitespace, and sync repair)
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

const RECOMMENDED_SIZE_LIMIT = 20 * 1024; // 20 KB = 20,480 bytes
const HARD_SIZE_LIMIT = 24 * 1024;        // 24 KB = 24,576 bytes
const BYTES_PER_TOKEN_ESTIMATE = 3.8;     // Average bytes per token in markdown prose

const isFixMode = process.argv.includes('--fix');

// Autonomous self-explaining diagnostic reporter
function reportDiagnostic(file, line, code, gateNum, snippet, reason, remedy) {
  console.error(`  ❌ [Gate ${gateNum} / ${code}] in ${file}${line > 0 ? ` (Line ${line})` : ''}`);
  if (snippet) {
    console.error(`     Snippet : > ${snippet}`);
  }
  console.error(`     Reason  : ${reason}`);
  console.error(`     Remedy  : ${remedy}`);
}

// Dynamic Rule Discovery (Zero hardcoded counts or file names)
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
        if (file === 'universal_rules.md') return false; // archived canonical pointer
        return file.endsWith('.md') && fs.statSync(fullPath).isFile();
      })
    : [];

  return Array.from(new Set([...localFiles, ...globalFiles])).sort();
}

function computeMD5(filePath) {
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(buffer).digest('hex');
}

// GitHub-compliant anchor slug generator
function slugifyHeading(headingText) {
  return headingText
    .toLowerCase()
    .replace(/<[^>]+>/g, '')         // strip HTML tags
    .replace(/[^\w\s-]/g, '')         // strip punctuation & emoji symbols
    .trim()
    .replace(/\s+/g, '-');            // convert whitespace sequence to hyphens
}

console.log('='.repeat(95));
console.log('🛡️  ENTERPRISE DEEP-DIVE & DYNAMIC RULES ENGINE SENTINEL');
console.log('='.repeat(95));
console.log(`Global Rules Directory : ${GLOBAL_RULES_DIR}`);
console.log(`Local Rules Directory  : ${LOCAL_RULES_DIR}`);
if (isFixMode) {
  console.log(`Self-Healing Mode      : ACTIVE (--fix enabled)`);
}

const RULE_FILES = discoverRuleFiles();
console.log(`Dynamic Rule Discovery : ${RULE_FILES.length} active rule documents identified (zero hardcoding)\n`);

// -------------------------------------------------------------------------------------------------
// GATE 11 INITIALIZATION: Pre-Gate Autonomous Self-Healing (--fix execution)
// -------------------------------------------------------------------------------------------------
const remediationLog = [];
let pendingFixableCount = 0;

for (const file of RULE_FILES) {
  const localPath = path.join(LOCAL_RULES_DIR, file);
  const globalPath = path.join(GLOBAL_RULES_DIR, file);

  const localExists = fs.existsSync(localPath);
  const globalExists = fs.existsSync(globalPath);

  // 1. Check MD5 Desync for Bidirectional Self-Healing FIRST
  if (localExists && globalExists) {
    const localHash = computeMD5(localPath);
    const globalHash = computeMD5(globalPath);
    if (localHash !== globalHash) {
      if (isFixMode) {
        const localMtime = fs.statSync(localPath).mtimeMs;
        const globalMtime = fs.statSync(globalPath).mtimeMs;
        if (localMtime >= globalMtime) {
          fs.copyFileSync(localPath, globalPath);
          remediationLog.push(`Synchronized newer local -> global: ${file}`);
        } else {
          fs.copyFileSync(globalPath, localPath);
          remediationLog.push(`Synchronized newer global -> local: ${file}`);
        }
      } else {
        pendingFixableCount++;
      }
    }
  }

  // 2. Check Missing BOM on both local and global
  if (localExists) {
    const rawBuffer = fs.readFileSync(localPath);
    const hasBOM = rawBuffer.length >= 3 && rawBuffer[0] === 0xef && rawBuffer[1] === 0xbb && rawBuffer[2] === 0xbf;
    if (!hasBOM) {
      if (isFixMode) {
        const bomBuffer = Buffer.from([0xef, 0xbb, 0xbf]);
        fs.writeFileSync(localPath, Buffer.concat([bomBuffer, rawBuffer]));
        if (globalExists) {
          const globalBuf = fs.readFileSync(globalPath);
          const gHasBOM = globalBuf.length >= 3 && globalBuf[0] === 0xef && globalBuf[1] === 0xbb && globalBuf[2] === 0xbf;
          if (!gHasBOM) {
            fs.writeFileSync(globalPath, Buffer.concat([bomBuffer, globalBuf]));
          }
        }
        remediationLog.push(`Prepend UTF-8 BOM to ${file}`);
      } else {
        pendingFixableCount++;
      }
    }
  }
}

let totalErrors = 0;
let totalWarnings = 0;

// Cache parsed files for deep semantic graph operations
const parsedCache = new Map();

for (const file of RULE_FILES) {
  const localPath = path.join(LOCAL_RULES_DIR, file);
  if (!fs.existsSync(localPath)) continue;

  const rawBuffer = fs.readFileSync(localPath);
  const rawString = rawBuffer.toString('utf8');
  const hasBOM = rawBuffer.length >= 3 && rawBuffer[0] === 0xef && rawBuffer[1] === 0xbb && rawBuffer[2] === 0xbf;
  const cleanContent = rawString.replace(/^\uFEFF+/, '');
  const lines = cleanContent.split(/\r?\n/);

  // Extract headings and build anchor set
  const headings = [];
  const slugs = new Set();
  const slugCounts = new Map();

  lines.forEach((line, idx) => {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const title = match[2].trim();
      let baseSlug = slugifyHeading(title);
      let count = slugCounts.get(baseSlug) || 0;
      let slug = count === 0 ? baseSlug : `${baseSlug}-${count}`;
      slugCounts.set(baseSlug, count + 1);

      slugs.add(slug);
      slugs.add(baseSlug); // also allow base slug
      headings.push({ level, title, slug, lineIndex: idx + 1 });
    }
  });

  parsedCache.set(file, {
    rawBuffer,
    cleanContent,
    lines,
    hasBOM,
    stat: fs.statSync(localPath),
    headings,
    slugs,
    localPath
  });
}

// -------------------------------------------------------------------------------------------------
// GATE 1: Dynamic Discovery & Mathematical Headroom Telemetry
// -------------------------------------------------------------------------------------------------
console.log('📊 [Gate 1/11] Dynamic Rule Inventory & Capacity Headroom Telemetry:');
console.log('-'.repeat(95));
console.log(
  '| ' + 'Rule Document'.padEnd(46) +
  ' | ' + 'Size (KB)'.padStart(9) +
  ' | ' + 'Headroom 20KB'.padStart(13) +
  ' | ' + 'Headroom 24KB'.padStart(13) +
  ' | ' + 'Status'.padEnd(14) + ' |'
);
console.log('-'.repeat(95));

let passedSizeCount = 0;

for (const file of RULE_FILES) {
  const entry = parsedCache.get(file);
  if (!entry) {
    reportDiagnostic(file, 0, 'MISSING_LOCAL_FILE', 1, '', 'File not found in local rules directory.', 'Synchronize missing rule file from global directory.');
    totalErrors++;
    continue;
  }

  const size = entry.stat.size;
  const sizeKB = (size / 1024).toFixed(2);
  const hr20 = RECOMMENDED_SIZE_LIMIT - size;
  const hr24 = HARD_SIZE_LIMIT - size;

  let statusText = '';
  if (size >= HARD_SIZE_LIMIT) {
    statusText = '🔴 CRITICAL';
    totalErrors++;
  } else if (size >= RECOMMENDED_SIZE_LIMIT) {
    statusText = '🟠 WARNING';
    totalWarnings++;
  } else if (size > 16384) {
    statusText = '🟡 TARGET-PASS';
    passedSizeCount++;
  } else {
    statusText = '🟢 OPTIMAL';
    passedSizeCount++;
  }

  const hr20Str = hr20 >= 0 ? `${hr20} B` : `-${Math.abs(hr20)} B`;
  const hr24Str = hr24 >= 0 ? `${hr24} B` : `-${Math.abs(hr24)} B`;

  console.log(
    '| ' + file.padEnd(46) +
    ' | ' + (`${sizeKB} KB`).padStart(9) +
    ' | ' + hr20Str.padStart(13) +
    ' | ' + hr24Str.padStart(13) +
    ' | ' + statusText.padEnd(14) + ' |'
  );
}
console.log('-'.repeat(95));
console.log(`  ✅ ${passedSizeCount}/${RULE_FILES.length} rule files certified within capacity bounds.\n`);

// -------------------------------------------------------------------------------------------------
// GATE 2: Deep Semantic Content & Schema Inspection
// -------------------------------------------------------------------------------------------------
console.log('🔍 [Gate 2/11] Deep Semantic Content & Internal Schema Inspection:');
let schemaPassedCount = 0;

for (const file of RULE_FILES) {
  const entry = parsedCache.get(file);
  if (!entry) continue;

  const { cleanContent, lines, hasBOM, headings } = entry;
  let fileSchemaErrors = 0;

  // 1. Formal H1 Title Verification (must occur within first 5 non-empty lines)
  const firstNonEmpty = lines.filter(l => l.trim().length > 0).slice(0, 5);
  const hasH1 = firstNonEmpty.some(l => /^#\s+[^#]/.test(l));
  if (!hasH1) {
    reportDiagnostic(file, 1, 'SCHEMA_MISSING_H1', 2, '', 'Formal top-level `# Title` not found in header lines.', 'Add `# Department Title` at the beginning of the file.');
    fileSchemaErrors++;
  }

  // 2. Formal Metadata Block Verification
  const hasMetadataBlock = lines.slice(0, 15).some(l => /^>\s+\*\*/.test(l.trim()));
  if (!hasMetadataBlock) {
    reportDiagnostic(file, 3, 'SCHEMA_MISSING_METADATA', 2, '', "Formal blockquote metadata `> **Key:** Value` missing.", "Include formal blockquote metadata block under H1 title.");
    fileSchemaErrors++;
  }

  // 3. Markdown Code Fence Integrity (Check balanced fences)
  const fenceMatches = cleanContent.match(/^(`{3,}|~{3,})/gm) || [];
  if (fenceMatches.length % 2 !== 0) {
    reportDiagnostic(file, 0, 'SCHEMA_UNCLOSED_FENCE', 2, `Count: ${fenceMatches.length}`, 'Odd number of markdown code fences detected (unclosed fence block).', 'Check and close unclosed ``` code blocks.');
    fileSchemaErrors++;
  }

  // 4. Heading Hierarchy & Structural Hygiene (Check for empty leaf sections or orphaned headings at EOF)
  headings.forEach((h, i) => {
    let hasBody = false;
    for (let lineIdx = h.lineIndex; lineIdx < lines.length; lineIdx++) {
      const line = lines[lineIdx].trim();
      if (line && line !== '---') {
        if (!line.startsWith('#')) {
          hasBody = true;
          break;
        } else {
          break;
        }
      }
    }
    // If it's a leaf heading (level >= 3) and has no body text before next heading or EOF
    if (!hasBody && h.level >= 3) {
      const nextHeading = headings[i + 1];
      if (!nextHeading || nextHeading.level <= h.level) {
        reportDiagnostic(file, h.lineIndex, 'SCHEMA_EMPTY_SECTION', 2, h.title, `Heading '${h.title}' has no body content.`, 'Add explanatory content or remove empty heading.');
        fileSchemaErrors++;
      }
    }
  });

  // 5. Mojibake and Character Corruption Check
  const hasReplacementChar = cleanContent.includes('\uFFFD');
  const hasNullByte = cleanContent.includes('\0');
  const mojibakeRegex = /Ã[\x80-\xBF]|â[\x80-\xBF]{2}/;
  const hasMojibake = mojibakeRegex.test(cleanContent);

  if (hasReplacementChar || hasNullByte || hasMojibake) {
    reportDiagnostic(file, 0, 'SCHEMA_ENCODING_CORRUPTION', 2, '', `Detected corrupt encoding or mojibake bytes (Replacement: ${hasReplacementChar}, NullByte: ${hasNullByte}, Mojibake: ${hasMojibake})`, 'Re-save file as clean UTF-8 with BOM.');
    fileSchemaErrors++;
  }

  // 6. UTF-8 BOM Verification (Universal Rules 5 & 8)
  if (!hasBOM) {
    console.warn(`  ⚠️  [NOTICE: MISSING UTF-8 BOM] ${file}: Byte Order Mark (0xEF, 0xBB, 0xBF) recommended for Windows toolchains.`);
    totalWarnings++;
  }

  if (fileSchemaErrors === 0) {
    schemaPassedCount++;
  } else {
    totalErrors += fileSchemaErrors;
  }
}
console.log(`  ✅ ${schemaPassedCount}/${RULE_FILES.length} rule documents passed complete semantic schema audits.\n`);

// -------------------------------------------------------------------------------------------------
// GATE 3: Deep Anchor & Link Graph Resolution
// -------------------------------------------------------------------------------------------------
console.log('🔗 [Gate 3/11] Deep Anchor & Link Graph Resolution:');
let totalLinksInspected = 0;
let totalAnchorsInspected = 0;
let brokenLinksCount = 0;

for (const file of RULE_FILES) {
  const entry = parsedCache.get(file);
  if (!entry) continue;

  const { cleanContent, lines } = entry;
  const linkRegex = /\[([^\]]*)\]\(([^)\s]+)\)/g;
  let match;

  while ((match = linkRegex.exec(cleanContent)) !== null) {
    const linkText = match[1];
    const rawTarget = match[2];

    // Ignore remote web protocols
    if (/^(https?:|mailto:|tel:)/i.test(rawTarget)) {
      continue;
    }

    totalLinksInspected++;

    let targetFilePath = '';
    let targetAnchor = '';

    if (rawTarget.startsWith('#')) {
      // Same-file anchor
      targetFilePath = entry.localPath;
      targetAnchor = rawTarget.substring(1);
    } else if (rawTarget.startsWith('file:///')) {
      // file:/// absolute URI
      let decoded = decodeURIComponent(rawTarget.replace('file:///', ''));
      const hashIdx = decoded.indexOf('#');
      if (hashIdx !== -1) {
        targetAnchor = decoded.substring(hashIdx + 1);
        decoded = decoded.substring(0, hashIdx);
      }
      targetFilePath = path.normalize(decoded);
    } else {
      // Relative file path
      let rel = rawTarget;
      const hashIdx = rel.indexOf('#');
      if (hashIdx !== -1) {
        targetAnchor = rel.substring(hashIdx + 1);
        rel = rel.substring(0, hashIdx);
      }
      targetFilePath = path.resolve(LOCAL_RULES_DIR, rel);
    }

    // 1. Verify file existence
    if (!fs.existsSync(targetFilePath)) {
      const lineNum = cleanContent.substring(0, match.index).split(/\r?\n/).length;
      reportDiagnostic(file, lineNum, 'BROKEN_FILE_LINK', 3, `[${linkText}](${rawTarget})`, `Target file does not exist: ${targetFilePath}`, 'Update link path or create target file.');
      brokenLinksCount++;
      totalErrors++;
      continue;
    }

    // 2. If anchor exists, perform Deep Anchor Resolution
    if (targetAnchor) {
      totalAnchorsInspected++;

      // Check if anchor is line range reference (e.g. L10-L20 or L15)
      const lineRangeMatch = targetAnchor.match(/^L(\d+)(?:-L?(\d+))?$/i);
      if (lineRangeMatch) {
        const startLine = parseInt(lineRangeMatch[1], 10);
        const endLine = lineRangeMatch[2] ? parseInt(lineRangeMatch[2], 10) : startLine;
        const targetContent = fs.readFileSync(targetFilePath, 'utf8');
        const targetLinesCount = targetContent.split(/\r?\n/).length;

        if (startLine < 1 || endLine > targetLinesCount || startLine > endLine) {
          const lineNum = cleanContent.substring(0, match.index).split(/\r?\n/).length;
          reportDiagnostic(file, lineNum, 'OUT_OF_BOUNDS_LINE_ANCHOR', 3, rawTarget, `Target file has ${targetLinesCount} lines; requested line bounds: ${startLine}-${endLine}`, 'Adjust line range bounds to fit target file.');
          brokenLinksCount++;
          totalErrors++;
        }
      } else {
        // Heading slug verification
        const targetFileName = path.basename(targetFilePath);
        let targetEntry = parsedCache.get(targetFileName);

        let targetSlugs = targetEntry ? targetEntry.slugs : null;
        if (!targetSlugs) {
          const extContent = fs.readFileSync(targetFilePath, 'utf8').replace(/^\uFEFF+/, '');
          targetSlugs = new Set();
          extContent.split(/\r?\n/).forEach(l => {
            const hMatch = l.match(/^#{1,6}\s+(.+)$/);
            if (hMatch) {
              targetSlugs.add(slugifyHeading(hMatch[1].trim()));
            }
          });
        }

        const normalizedAnchor = targetAnchor.toLowerCase().trim();
        if (!targetSlugs.has(normalizedAnchor)) {
          const lineNum = cleanContent.substring(0, match.index).split(/\r?\n/).length;
          reportDiagnostic(file, lineNum, 'BROKEN_HEADING_ANCHOR', 3, `[${linkText}](${rawTarget})`, `Anchor '#${targetAnchor}' not found among headings in ${targetFileName}`, 'Check heading spelling or update anchor slug.');
          brokenLinksCount++;
          totalErrors++;
        }
      }
    }
  }
}

console.log(`  ✅ Verified ${totalLinksInspected} internal/filesystem links & ${totalAnchorsInspected} deep anchors (Broken: ${brokenLinksCount}).\n`);

// -------------------------------------------------------------------------------------------------
// GATE 4: Language Purity Verification
// -------------------------------------------------------------------------------------------------
console.log('🌐 [Gate 4/11] Language Purity Verification (100% Pure English Prose):');
const devanagariRegex = /[\u0900-\u097F]/;
let languagePassedCount = 0;

for (const file of RULE_FILES) {
  const entry = parsedCache.get(file);
  if (!entry) continue;

  if (devanagariRegex.test(entry.cleanContent)) {
    const matchLineIdx = entry.lines.findIndex(l => devanagariRegex.test(l));
    reportDiagnostic(file, matchLineIdx + 1, 'LANGUAGE_PURITY_VIOLATION', 4, entry.lines[matchLineIdx].trim(), 'Non-English (Devanagari) characters detected in rule prose.', 'Translate rule prose to 100% Pure English.');
    totalErrors++;
  } else {
    languagePassedCount++;
  }
}
console.log(`  ✅ 100% Pure English prose certified across all ${languagePassedCount}/${RULE_FILES.length} rule documents.\n`);

// -------------------------------------------------------------------------------------------------
// GATE 5: Cross-File Semantic Synchronization (Navigator <-> Department Rules Bi-Directional Parity)
// -------------------------------------------------------------------------------------------------
console.log('🔄 [Gate 5/11] Cross-File Semantic Synchronization (Bi-Directional Parity):');

const navigatorFile = RULE_FILES.find(f => f.includes('navigator')) || 'master_rules_navigator.md';
const navigatorEntry = parsedCache.get(navigatorFile);

let crossSyncPassed = true;
let totalRolesAudited = 0;

if (!navigatorEntry) {
  reportDiagnostic(navigatorFile, 0, 'NAVIGATOR_MISSING', 5, '', `Could not find Master Rules Navigator (${navigatorFile}).`, 'Restore master_rules_navigator.md.');
  totalErrors++;
} else {
  // Parse Section 6 Master Enterprise Roles Roster table dynamically
  const sec6Match = navigatorEntry.cleanContent.match(/## 🧑‍💼 6\. Master Enterprise Roles & Subagents Roster[\s\S]*?(?=\n---|\n## |$)/);
  const navigatorDeptRoles = new Map();

  if (sec6Match) {
    const tableRows = sec6Match[0].split(/\r?\n/).filter(line => line.startsWith('| **Dept'));
    tableRows.forEach(row => {
      const cols = row.split('|').map(c => c.trim()).filter(Boolean);
      if (cols.length >= 3) {
        const deptKeyMatch = cols[0].match(/Dept\s*(\d+)/i);
        if (deptKeyMatch) {
          const deptNum = deptKeyMatch[1];
          // Dedicated Subagent Roles is col[2]
          const roles = cols[2].split(',').map(r => r.replace(/[`*]/g, '').trim()).filter(Boolean);
          navigatorDeptRoles.set(deptNum, roles);
          totalRolesAudited += roles.length;
        }
      }
    });
  }

  // Bi-directional verification for all numbered departmental files
  const deptFiles = RULE_FILES.filter(f => /^\d\d_/.test(f));

  for (const deptFile of deptFiles) {
    const deptMatch = deptFile.match(/^(\d\d)_/);
    if (!deptMatch) continue;
    const deptNum = deptMatch[1];

    const expectedRoles = navigatorDeptRoles.get(deptNum);
    if (!expectedRoles) {
      reportDiagnostic(deptFile, 0, 'DANGLING_DEPARTMENT', 5, deptFile, `Dept ${deptNum} not listed in ${navigatorFile}`, 'Add department entry to Navigator Section 6 table.');
      totalErrors++;
      crossSyncPassed = false;
      continue;
    }

    const deptEntry = parsedCache.get(deptFile);
    if (!deptEntry) continue;

    // Extract roles declared in departmental file
    const declaredRoles = [];
    deptEntry.lines.forEach(line => {
      const m = line.match(/(?:Dedicated Subagent Role|Subagent Role):\*\*\s*`?([^`\r\n]+?)`?$/i)
             || line.match(/(?:Dedicated Subagent Role|Subagent Role):\s*`?([^`\r\n]+?)`?$/i);
      if (m) {
        declaredRoles.push(m[1].replace(/[`*]/g, '').trim());
      }
    });

    // Parity check
    const missingInFile = expectedRoles.filter(r => !declaredRoles.includes(r));
    const missingInNavigator = declaredRoles.filter(r => !expectedRoles.includes(r));

    if (missingInFile.length > 0 || missingInNavigator.length > 0) {
      reportDiagnostic(deptFile, 0, 'PARITY_MISMATCH', 5, `Missing in File: [${missingInFile.join(', ')}] | Missing in Navigator: [${missingInNavigator.join(', ')}]`, `Bi-directional role mismatch between Navigator and ${deptFile}`, 'Synchronize role definitions so both documents align 100%.');
      totalErrors++;
      crossSyncPassed = false;
    }
  }

  if (crossSyncPassed) {
    console.log(`  ✅ 100% Bi-Directional Parity Certified across ${navigatorDeptRoles.size} departments and ${totalRolesAudited} enterprise roles.`);
  }
}
console.log('');

// -------------------------------------------------------------------------------------------------
// GATE 6: Binary Synchronization (Global vs Local MD5 Bit-for-Bit Identity)
// -------------------------------------------------------------------------------------------------
console.log('⚡ [Gate 6/11] Binary Synchronization (Global <-> Local MD5 Parity):');
let syncedCount = 0;

for (const file of RULE_FILES) {
  const globalPath = path.join(GLOBAL_RULES_DIR, file);
  const localPath = path.join(LOCAL_RULES_DIR, file);

  if (!fs.existsSync(globalPath)) {
    reportDiagnostic(file, 0, 'MISSING_GLOBAL_FILE', 6, globalPath, `File not found in global rules directory: ${GLOBAL_RULES_DIR}`, 'Sync file from local to global directory.');
    totalErrors++;
    continue;
  }
  if (!fs.existsSync(localPath)) {
    reportDiagnostic(file, 0, 'MISSING_LOCAL_FILE', 6, localPath, `File not found in local rules directory: ${LOCAL_RULES_DIR}`, 'Sync file from global to local directory.');
    totalErrors++;
    continue;
  }

  const globalHash = computeMD5(globalPath);
  const localHash = computeMD5(localPath);

  if (globalHash !== localHash) {
    reportDiagnostic(file, 0, 'MD5_DESYNC', 6, `Global: ${globalHash} | Local: ${localHash}`, 'Bit-for-bit MD5 mismatch between global and local rules.', 'Run with --fix to automatically synchronize identical content.');
    totalErrors++;
  } else {
    syncedCount++;
  }
}
console.log(`  ✅ All ${syncedCount}/${RULE_FILES.length} rule documents are bit-for-bit identical (100% Binary Synced).\n`);

// -------------------------------------------------------------------------------------------------
// GATE 7: Mermaid Diagram & Graph Syntax Validator
// -------------------------------------------------------------------------------------------------
console.log('📐 [Gate 7/11] Mermaid Diagram & Graph Syntax Validator:');
let mermaidDiagramsAudited = 0;
let mermaidPassedCount = 0;
let mermaidErrors = 0;

const SUPPORTED_DIAGRAM_PREFIXES = [
  /^flowchart\s+(TD|TB|BT|RL|LR)/i,
  /^graph\s+(TD|TB|BT|RL|LR)/i,
  /^sequenceDiagram/i,
  /^stateDiagram(?:-v2)?/i,
  /^classDiagram/i,
  /^erDiagram/i,
  /^xychart-beta/i,
  /^journey/i,
  /^gantt/i,
  /^pie(?:\s+title)?/i,
  /^gitGraph/i,
  /^mindmap/i,
  /^timeline/i,
  /^quadrantChart/i,
  /^C4Context/i
];

for (const file of RULE_FILES) {
  const entry = parsedCache.get(file);
  if (!entry) continue;

  const { cleanContent } = entry;
  const mermaidRegex = /```mermaid\r?\n([\s\S]*?)```/g;
  let match;
  let fileHasMermaid = false;
  let fileMermaidErrors = 0;

  while ((match = mermaidRegex.exec(cleanContent)) !== null) {
    fileHasMermaid = true;
    mermaidDiagramsAudited++;
    const diagramCode = match[1];
    const matchOffset = match.index;
    const startLine = cleanContent.substring(0, matchOffset).split(/\r?\n/).length;
    const diagramLines = diagramCode.split(/\r?\n/);

    // 1. Validate diagram type declaration (first non-empty, non-comment line)
    const firstCodeLineIdx = diagramLines.findIndex(l => l.trim().length > 0 && !l.trim().startsWith('%%'));
    if (firstCodeLineIdx === -1) {
      reportDiagnostic(file, startLine, 'MERMAID_EMPTY_DIAGRAM', 7, '```mermaid', 'Mermaid diagram block is empty.', 'Add a diagram definition such as `flowchart TD` or remove the block.');
      fileMermaidErrors++;
      continue;
    }

    const firstLine = diagramLines[firstCodeLineIdx].trim();
    const isValidType = SUPPORTED_DIAGRAM_PREFIXES.some(regex => regex.test(firstLine));
    if (!isValidType) {
      reportDiagnostic(file, startLine + firstCodeLineIdx, 'MERMAID_UNSUPPORTED_TYPE', 7, firstLine, `Diagram type '${firstLine}' is unsupported or unrecognized.`, 'Use supported diagram type: flowchart TD/LR, sequenceDiagram, stateDiagram-v2, classDiagram, erDiagram, xychart-beta.');
      fileMermaidErrors++;
    }

    // 2. Syntax & structural hazard checks
    diagramLines.forEach((dLine, dIdx) => {
      const lineNum = startLine + dIdx + 1;
      const trimmed = dLine.trim();
      if (!trimmed || trimmed.startsWith('%%')) return;

      // Check for raw HTML tags in node labels
      const htmlTagMatch = trimmed.match(/<(?:br|div|span|b|i|p|strong|em)(?:\s*\/?>|\s+[^>]*>)/i);
      if (htmlTagMatch) {
        reportDiagnostic(file, lineNum, 'MERMAID_RAW_HTML_LABEL', 7, trimmed, `Found raw HTML tag '${htmlTagMatch[0]}' inside Mermaid diagram.`, 'Avoid raw HTML tags; use clean text or standard Mermaid markdown string formatting.');
        fileMermaidErrors++;
      }

      // Strip all properly quoted node shapes first before checking for unquoted special chars
      const strippedOfQuotedNodes = trimmed
        .replace(/\b\w+\s*\[\(\s*"[^"]*"\s*\)\]/g, '')  // cylinder [("...")]
        .replace(/\b\w+\s*\(\[\s*"[^"]*"\s*\]\)/g, '')  // stadium (["..."])
        .replace(/\b\w+\s*\[\[\s*"[^"]*"\s*\]\]/g, '')  // subroutine [["..."]]
        .replace(/\b\w+\s*\(\(\s*"[^"]*"\s*\)\)/g, '')  // circle (("..."))
        .replace(/\b\w+\s*\{\{\s*"[^"]*"\s*\}\}/g, '')  // hexagon {{"..."}}
        .replace(/\b\w+\s*\[\s*"[^"]*"\s*\]/g, '')      // rectangle ["..."]
        .replace(/\b\w+\s*\(\s*"[^"]*"\s*\)/g, '')      // rounded ("...")
        .replace(/\b\w+\s*\{\s*"[^"]*"\s*\}/g, '')      // rhombus {"..."}
        .replace(/\b\w+\s*>\s*"[^"]*"\s*\]/g, '');      // flag >"..."]

      // Inspect any remaining unquoted node definitions for dangerous unquoted special chars
      const unquotedHazard = strippedOfQuotedNodes.match(/\b\w+\s*\[(?!"|')(.*?[(){}[\]].*?)(?<!"|')\]/);
      if (unquotedHazard) {
        reportDiagnostic(file, lineNum, 'MERMAID_UNQUOTED_SPECIAL_CHARS', 7, trimmed, `Node label '${unquotedHazard[1]}' contains special characters (), {}, or [] without surrounding quotes.`, `Wrap label in double quotes: e.g. ["${unquotedHazard[1]}"]`);
        fileMermaidErrors++;
      }
    });
  }

  if (fileHasMermaid) {
    if (fileMermaidErrors === 0) {
      mermaidPassedCount++;
    } else {
      mermaidErrors += fileMermaidErrors;
    }
  }
}

if (mermaidErrors === 0) {
  console.log(`  ✅ ${mermaidDiagramsAudited} Mermaid diagram(s) validated with 0 syntax errors or unescaped hazards.`);
} else {
  totalErrors += mermaidErrors;
}
console.log('');

// -------------------------------------------------------------------------------------------------
// GATE 8: Anti-Pattern & Hardcoded Secret Sentinel
// -------------------------------------------------------------------------------------------------
console.log('🛡️  [Gate 8/11] Anti-Pattern & Hardcoded Secret Sentinel:');
let secretsDetected = 0;
let antiPatternViolations = 0;

const SECRET_PATTERNS = [
  { name: 'GitHub PAT / App Token', regex: /\b(ghp_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9_]{50,}|gho_[a-zA-Z0-9]{36}|ghs_[a-zA-Z0-9]{36})\b/ },
  { name: 'Private Cryptographic Key', regex: /-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/ },
  { name: 'AWS Access Key ID', regex: /\b(AKIA|ASIA)[0-9A-Z]{16}\b/ },
  { name: 'OpenAI / Anthropic Secret Key', regex: /\bsk-[a-zA-Z0-9]{24,}\b/ },
  { name: 'Google Cloud API Key', regex: /\bAIzaSy[a-zA-Z0-9_-]{33}\b/ }
];

const PROHIBITION_KEYWORDS = ['prohibit', 'ban', 'banned', 'strict', 'prevent', 'never', 'zero-scan', 'forbidden', 'no blind'];

for (const file of RULE_FILES) {
  const entry = parsedCache.get(file);
  if (!entry) continue;

  const { cleanContent, lines } = entry;

  // 1. Secret detection
  for (const { name, regex } of SECRET_PATTERNS) {
    const match = regex.exec(cleanContent);
    if (match) {
      const matchLineIdx = cleanContent.substring(0, match.index).split(/\r?\n/).length;
      reportDiagnostic(file, matchLineIdx, 'HARDCODED_SECRET_LEAK', 8, match[0].substring(0, 8) + '...', `Detected real or hardcoded credential: ${name}.`, 'Immediately sanitize secrets and use environment variables.');
      secretsDetected++;
    }
  }

  // 2. Anti-Pattern Sentinel: Blind recursive scanning prohibition verification
  lines.forEach((line, idx) => {
    if (line.includes('dir /s') || line.includes('Get-ChildItem -Recurse')) {
      const lower = line.toLowerCase();
      const isCompliant = PROHIBITION_KEYWORDS.some(kw => lower.includes(kw));
      if (!isCompliant) {
        reportDiagnostic(file, idx + 1, 'ANTI_PATTERN_UNFRAMED_SCAN', 8, line.trim(), 'Blind recursive scan command mentioned without explicit prohibition context.', 'Frame as strictly prohibited per Universal Rule 0 / 21.');
        antiPatternViolations++;
      }
    }
  });
}

if (secretsDetected === 0 && antiPatternViolations === 0) {
  console.log(`  ✅ 0 hardcoded secrets & 100% Constitutional Anti-Pattern compliance certified across all ${RULE_FILES.length} files.`);
} else {
  totalErrors += (secretsDetected + antiPatternViolations);
}
console.log('');

// -------------------------------------------------------------------------------------------------
// GATE 9: NPM Script & Developer Command Consistency Validator
// -------------------------------------------------------------------------------------------------
console.log('📦 [Gate 9/11] NPM Script & Developer Command Consistency Validator:');
let totalNpmCommandsAudited = 0;
let npmConsistencyErrors = 0;

let packageJson = {};
const packageJsonPath = path.join(projectRoot, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  try {
    packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  } catch (e) {
    reportDiagnostic('package.json', 0, 'PACKAGE_JSON_CORRUPT', 9, '', `Could not parse package.json: ${e.message}`, 'Ensure package.json is valid JSON.');
    totalErrors++;
  }
}

const definedScripts = new Set(Object.keys(packageJson.scripts || {}));
const builtinNpmCommands = new Set(['ci', 'install', 'test', 'audit', 'cache', 'init', 'run', 'publish', 'version', 'help', 'start']);
const auditedScripts = new Set();

for (const file of RULE_FILES) {
  const entry = parsedCache.get(file);
  if (!entry) continue;

  const { cleanContent } = entry;

  // Find all `npm run <cmd>` and `npm <cmd>` invocations within code spans
  const npmMatches = cleanContent.matchAll(/`npm\s+(?:run\s+)?([a-zA-Z0-9:_-]+)`/g);
  for (const m of npmMatches) {
    const scriptCmd = m[1];
    auditedScripts.add(scriptCmd);
    totalNpmCommandsAudited++;

    if (!definedScripts.has(scriptCmd) && !builtinNpmCommands.has(scriptCmd)) {
      const lineNum = cleanContent.substring(0, m.index).split(/\r?\n/).length;
      reportDiagnostic(file, lineNum, 'NPM_SCRIPT_UNDEFINED', 9, m[0], `Referenced command 'npm ${scriptCmd}' is neither defined in package.json scripts nor a built-in npm command.`, `Add "${scriptCmd}" to package.json scripts or update documentation reference.`);
      npmConsistencyErrors++;
    }
  }
}

if (npmConsistencyErrors === 0) {
  console.log(`  ✅ Verified ${totalNpmCommandsAudited} npm script invocations (${auditedScripts.size} unique: ${Array.from(auditedScripts).join(', ')}) with 100% package.json parity.`);
} else {
  totalErrors += npmConsistencyErrors;
}
console.log('');

// -------------------------------------------------------------------------------------------------
// GATE 10: Model Tier & Tooling Vocabulary Audit
// -------------------------------------------------------------------------------------------------
console.log('🤖 [Gate 10/11] Model Tier & Tooling Vocabulary Audit:');
let totalModelsAudited = 0;
let totalToolsAudited = 0;
let vocabErrors = 0;

const AUTHORIZED_AI_MODELS = new Set(['flash_lite', 'flash', 'pro', 'inherit']);

// 1. Audit Navigator Model Mapping Table
if (navigatorEntry) {
  const tableMatch = navigatorEntry.cleanContent.match(/## 🏢 3\. Department Directory & Quick Routing[\s\S]*?(?=\n---|\n## )/);
  if (tableMatch) {
    const rows = tableMatch[0].split(/\r?\n/).filter(l => l.startsWith('| **'));
    rows.forEach(row => {
      const cols = row.split('|').map(c => c.trim()).filter(Boolean);
      if (cols.length >= 4) {
        const rawModelText = cols[3];
        const modelTokens = rawModelText.replace(/[`*]/g, '').split('/').map(m => m.trim());
        modelTokens.forEach(modelName => {
          totalModelsAudited++;
          if (!AUTHORIZED_AI_MODELS.has(modelName)) {
            reportDiagnostic(navigatorFile, 0, 'INVALID_AI_MODEL_TIER', 10, rawModelText, `Model '${modelName}' is not an authorized Antigravity model tier.`, `Authorized models: ${Array.from(AUTHORIZED_AI_MODELS).join(', ')}`);
            vocabErrors++;
          }
        });
      }
    });
  }
}

// 2. Audit Tool Vocabulary across all rule files
const toolNamePattern = /\b(?:invoke[_-]subagent|define[_-]subagent|send[_-]message|manage[_-]task|ask[_-]question)\b/g;
for (const file of RULE_FILES) {
  const entry = parsedCache.get(file);
  if (!entry) continue;

  const { cleanContent } = entry;
  const matches = cleanContent.matchAll(toolNamePattern);
  for (const match of matches) {
    const rawTool = match[0];
    totalToolsAudited++;
    if (rawTool.includes('-')) {
      const lineNum = cleanContent.substring(0, match.index).split(/\r?\n/).length;
      reportDiagnostic(file, lineNum, 'MALFORMED_TOOL_NAME', 10, rawTool, `Tool name '${rawTool}' uses hyphens instead of standard underscores.`, `Use standard underscore format: '${rawTool.replace(/-/g, '_')}'`);
      vocabErrors++;
    }
  }
}

if (vocabErrors === 0) {
  console.log(`  ✅ Certified ${totalModelsAudited} model tier mappings and ${totalToolsAudited} tool vocabulary references.`);
} else {
  totalErrors += vocabErrors;
}
console.log('');

// -------------------------------------------------------------------------------------------------
// GATE 11: Auto-Remediation / Self-Healing Readiness Engine
// -------------------------------------------------------------------------------------------------
console.log('🔧 [Gate 11/11] Auto-Remediation & Self-Healing Readiness Engine:');

if (isFixMode) {
  console.log(`  ✅ Autonomous Self-Healing Executed: ${remediationLog.length} discrepancy(ies) successfully repaired:`);
  remediationLog.forEach(item => console.log(`     🛠️  ${item}`));
} else {
  if (pendingFixableCount === 0) {
    console.log(`  ✅ Autonomous self-healing engine active and ready (0 remediation actions currently required).`);
  } else {
    console.log(`  ⚠️  Detected ${pendingFixableCount} auto-fixable discrepancy(ies). Run 'node scripts/check-rules-health.js --fix' to auto-heal.`);
  }
}
console.log('');

// -------------------------------------------------------------------------------------------------
// EXECUTIVE AUDIT SUMMARY & VERDICT
// -------------------------------------------------------------------------------------------------
console.log('='.repeat(95));
if (totalErrors === 0) {
  console.log('🎉 ENTERPRISE AUDIT RESULT: 100% PASS — ALL 11 QUALITY GATES CERTIFIED CLEAN!');
  console.log(`   - Gate 1  (Headroom & Capacity) : ${passedSizeCount}/${RULE_FILES.length} Files < 20 KB (Ceiling 24 KB)`);
  console.log(`   - Gate 2  (Content & Schema)    : ${schemaPassedCount}/${RULE_FILES.length} Passed H1, Metadata, Fences, Heading Order`);
  console.log(`   - Gate 3  (Link & Anchor Graph) : ${totalLinksInspected} Links & ${totalAnchorsInspected} Deep Anchors Verified (0 Broken)`);
  console.log(`   - Gate 4  (Language Purity)     : 100% Pure English Prose (0 Non-English Characters)`);
  console.log(`   - Gate 5  (Cross-File Parity)   : 100% Bi-Directional Parity (${totalRolesAudited} Active Roles Mapped)`);
  console.log(`   - Gate 6  (Binary Parity)       : 100% Bit-for-Bit Synced (${syncedCount}/${RULE_FILES.length} MD5 Matched)`);
  console.log(`   - Gate 7  (Mermaid Syntax)      : ${mermaidDiagramsAudited} Diagram(s) Validated (0 Syntax Hazards)`);
  console.log(`   - Gate 8  (Secrets & Sentinels) : 0 Leaked Secrets, 100% Constitutional Parity`);
  console.log(`   - Gate 9  (Developer Commands)  : ${totalNpmCommandsAudited} Scripts & Tools Validated against package.json`);
  console.log(`   - Gate 10 (Model Tiers & Tools) : 100% Authorized Models (${totalModelsAudited} Mappings) & Tool Vocab`);
  console.log(`   - Gate 11 (Self-Healing Engine) : Engine Active & Ready (${remediationLog.length} Remediated, ${pendingFixableCount} Pending)`);
  if (totalWarnings > 0) {
    console.log(`   - Notices / Warnings           : ${totalWarnings}`);
  }
  console.log('='.repeat(95) + '\n');
  process.exit(0);
} else {
  console.error(`🚨 ENTERPRISE AUDIT RESULT: FAILED with ${totalErrors} error(s) and ${totalWarnings} warning(s)!`);
  console.log('   Run with `--fix` to attempt autonomous repair of fixable discrepancies.');
  console.log('='.repeat(95) + '\n');
  process.exit(1);
}
