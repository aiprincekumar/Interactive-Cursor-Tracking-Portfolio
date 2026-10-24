const fs = require('fs');
const path = require('path');

const changeId = 'CHG-20261024-021';
const timestamp = '2026-10-24 03:18:00';
const author = 'changes_log_manager / Agentic Engineer';
const targetFiles = 'src/components/FloatingActionHub.jsx';
const summaryReason = 'Fixed ReferenceError (isBasicView is not defined) in FloatingActionHub.jsx by properly declaring isBasicView and viewMode at component root scope with safe optional fallbacks.';

// 1. Create entry file
const entryDir = path.join('changes_log', 'entries', '2026-10-24');
fs.mkdirSync(entryDir, { recursive: true });
const entryFilePath = path.join(entryDir, `change_${changeId}_2026-10-24_03-18-00.md`);

const entryContent = `# Change Entry: ${changeId}

- **Change ID:** \`${changeId}\`
- **Timestamp:** \`${timestamp}\`
- **Author / Agent:** \`${author}\`
- **Target File:** \`${targetFiles}\`
- **Summary & Reason:** ${summaryReason}

## Technical Details & Changes
- Declared \`viewMode\` with safe optional chaining from \`useViewMode()\`.
- Defined \`isBasicView = viewMode === 'basic'\` at component root scope.
- Prevented ReferenceError when evaluating conditional rendering for basic view.

## Rollback Instructions
To rollback this change:
\`\`\`bash
git checkout HEAD^ -- src/components/FloatingActionHub.jsx
\`\`\`
`;

fs.writeFileSync(entryFilePath, entryContent, 'utf8');

// 2. Update changes_summary.md
const summaryPath = path.join('changes_log', 'summary', 'changes_summary.md');
let summaryContent = fs.readFileSync(summaryPath, 'utf8');
const summaryHeaderIndex = summaryContent.indexOf('| :--- |');
const newSummaryRow = `| **${changeId}** | \`${timestamp}\` | \`${author}\` | \`${targetFiles}\` | ${summaryReason} |\n`;
if (summaryHeaderIndex !== -1) {
  const insertPos = summaryContent.indexOf('\n', summaryHeaderIndex) + 1;
  summaryContent = summaryContent.slice(0, insertPos) + newSummaryRow + summaryContent.slice(insertPos);
} else {
  summaryContent += '\n' + newSummaryRow;
}
fs.writeFileSync(summaryPath, summaryContent, 'utf8');

// 3. Update master_changes_log.md
const masterPath = path.join('changes_log', 'master', 'master_changes_log.md');
let masterContent = fs.readFileSync(masterPath, 'utf8');
const masterHeaderIndex = masterContent.indexOf('| :--- |');
const absoluteEntryLink = `file:///C:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/changes_log/entries/2026-10-24/change_${changeId}_2026-10-24_03-18-00.md`;
const newMasterRow = `| **[${changeId}](${absoluteEntryLink})** | \`${timestamp}\` | \`${author}\` | \`${targetFiles}\` | ${summaryReason} |\n`;
if (masterHeaderIndex !== -1) {
  const insertPos = masterContent.indexOf('\n', masterHeaderIndex) + 1;
  masterContent = masterContent.slice(0, insertPos) + newMasterRow + masterContent.slice(insertPos);
} else {
  masterContent += '\n' + newMasterRow;
}
// Update Last Updated header
masterContent = masterContent.replace(/Last Updated: [^\n]*/, `Last Updated: ${timestamp}`);
fs.writeFileSync(masterPath, masterContent, 'utf8');

// 4. Update daily_master_log.md
const dailyDir = path.join('changes_log', 'daily', '2026-10-24');
fs.mkdirSync(dailyDir, { recursive: true });
const dailyPath = path.join(dailyDir, 'daily_master_log.md');
let dailyContent = fs.existsSync(dailyPath) ? fs.readFileSync(dailyPath, 'utf8') : `# Daily Master Log — 2026-10-24\n\n> **Date:** 2026-10-24  \n> **Total Changes Recorded:** 0  \n\n---\n\n## 🕒 Recorded Changes\n\n`;

const newDailyEntry = `### [${changeId}](${absoluteEntryLink})
- **Timestamp:** \`${timestamp}\`
- **Author:** \`${author}\`
- **Target Files:** \`${targetFiles}\`
- **Reason:** ${summaryReason}

`;

// Insert after ## 🕒 Recorded Changes \n\n
const recChangesIdx = dailyContent.indexOf('## 🕒 Recorded Changes');
if (recChangesIdx !== -1) {
  const insertPos = dailyContent.indexOf('\n\n', recChangesIdx) + 2;
  dailyContent = dailyContent.slice(0, insertPos) + newDailyEntry + dailyContent.slice(insertPos);
} else {
  dailyContent += '\n' + newDailyEntry;
}

// Update total changes count
const totalMatch = dailyContent.match(/Total Changes Recorded: (\d+)/);
if (totalMatch) {
  const newTotal = parseInt(totalMatch[1]) + 1;
  dailyContent = dailyContent.replace(/Total Changes Recorded: \d+/, `Total Changes Recorded: ${newTotal}`);
}
fs.writeFileSync(dailyPath, dailyContent, 'utf8');

// 5. Update recent_10/ (FIFO rotation)
const recentDir = path.join('changes_log', 'recent_10');
fs.mkdirSync(recentDir, { recursive: true });
for (let i = 1; i < 10; i++) {
  const src = path.join(recentDir, `change_recent_${String(i + 1).padStart(2, '0')}.md`);
  const dest = path.join(recentDir, `change_recent_${String(i).padStart(2, '0')}.md`);
  if (fs.existsSync(src)) {
    fs.writeFileSync(dest, fs.readFileSync(src, 'utf8'), 'utf8');
  }
}
const recent10Path = path.join(recentDir, 'change_recent_10.md');
const recentContent = `# Recent Change: ${changeId}

- **Change ID:** \`${changeId}\`
- **Timestamp:** \`${timestamp}\`
- **Author:** \`${author}\`
- **Target Files:** \`${targetFiles}\`
- **Summary:** ${summaryReason}
`;
fs.writeFileSync(recent10Path, recentContent, 'utf8');

console.log('Successfully recorded CHG-20261024-021 in all required change log locations.');
