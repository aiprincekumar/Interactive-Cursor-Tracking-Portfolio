const fs = require('fs');
const path = require('path');

const changeId = 'CHG-20261024-020';
const timestamp = '2026-10-24 03:15:00';
const author = 'changes_log_manager / Agentic Engineer';
const targetFiles = 'src/components/RoleFloatingPill.jsx, src/components/FloatingActionHub.jsx';
const summaryReason = "Added Dedicated Job Role Floating Button and Selector Pill (RoleFloatingPill.jsx), Positioned Directly Below Audience Type in FloatingActionHub.jsx, and Suppressed Audience Filter Floating Button in Basic PDF View (viewMode === 'basic').";
const entryFilename = 'change_CHG-20261024-020_2026-10-24_03-15-00.md';
const entryRelPath = `changes_log/entries/2026-10-24/${entryFilename}`;
const absEntryPath = path.resolve(entryRelPath);

// 1. Create entry file
const entryContent = `# Change Entry: CHG-20261024-020

> **Change ID:** \`CHG-20261024-020\`  
> **Timestamp:** \`2026-10-24 03:15:00\`  
> **Author / Agent:** \`changes_log_manager\` / Agentic Engineer  
> **Target Files:** 
> - \`src/components/RoleFloatingPill.jsx\`
> - \`src/components/FloatingActionHub.jsx\`

---

## 🎯 Task & Objective
Add Dedicated Job Role Floating Button and Selector Pill (\`RoleFloatingPill.jsx\`), Positioned Directly Below Audience Type in \`FloatingActionHub.jsx\`, and Suppress Audience Filter Floating Button in Basic PDF View (\`viewMode === 'basic'\`).

---

## 🔍 Detailed Changes & Implementation

1. **\`src/components/RoleFloatingPill.jsx\` (New Component):**
   - Created dedicated Job Role selection pill allowing users to switch between target roles with instant state updates and feedback.

2. **\`src/components/FloatingActionHub.jsx\`:**
   - Imported and integrated \`RoleFloatingPill\`.
   - Added \`handleToggleRoleFilter\` and state \`isRolePillOpen\` mutually exclusive with audience filter and view mode pills.
   - Positioned the Job Role floating button directly below the Audience Type button in the floating action hub.
   - Suppressed the Audience Filter floating button when \`viewMode === 'basic'\`.

---

## 🔄 Rollback Instructions
To rollback this change:
1. Delete \`src/components/RoleFloatingPill.jsx\`.
2. Restore \`src/components/FloatingActionHub.jsx\` using git.
`;

fs.mkdirSync(path.dirname(absEntryPath), { recursive: true });
fs.writeFileSync(absEntryPath, entryContent, 'utf8');
console.log('Entry file created.');

// 2. Update changes_summary.md
const summaryPath = path.resolve('changes_log/summary/changes_summary.md');
let summaryContent = fs.readFileSync(summaryPath, 'utf8');
const summaryHeader = '| Change ID | Timestamp | Author / Agent | Target File(s) | Summary & Reason |';
const newSummaryRow = `| **${changeId}** | \`${timestamp}\` | \`${author}\` | \`${targetFiles}\` | ${summaryReason} |`;
if (summaryContent.includes(summaryHeader)) {
  summaryContent = summaryContent.replace(summaryHeader, summaryHeader + '\n' + newSummaryRow);
  fs.writeFileSync(summaryPath, summaryContent, 'utf8');
  console.log('Changes summary updated.');
}

// 3. Update master_changes_log.md
const masterPath = path.resolve('changes_log/master/master_changes_log.md');
let masterContent = fs.readFileSync(masterPath, 'utf8');
const masterHeader = '| Change ID | Date & Time | Author / Agent | Target Files | Summary Link |';
const fileUri = 'file:///' + absEntryPath.replace(/\\/g, '/');
const newMasterRow = `| **[${changeId}](${fileUri})** | \`${timestamp}\` | \`${author}\` | \`${targetFiles}\` | Added RoleFloatingPill and suppressed audience filter in basic view |`;
if (masterContent.includes(masterHeader)) {
  masterContent = masterContent.replace(masterHeader, masterHeader + '\n' + newMasterRow);
  masterContent = masterContent.replace(/Last Updated:.*?\n/, `Last Updated: ${timestamp}  \n`);
  fs.writeFileSync(masterPath, masterContent, 'utf8');
  console.log('Master changes log updated.');
}

// 4. Update daily_master_log.md
const dailyPath = path.resolve('changes_log/daily/2026-10-24/daily_master_log.md');
if (fs.existsSync(dailyPath)) {
  let dailyContent = fs.readFileSync(dailyPath, 'utf8');
  const dailyEntry = `
### New Change: [${changeId}](${fileUri})
- **Timestamp:** \`${timestamp}\`
- **Author:** \`${author}\`
- **Target Files:** \`${targetFiles}\`
- **Summary:** ${summaryReason}
`;
  dailyContent += '\n' + dailyEntry;
  fs.writeFileSync(dailyPath, dailyContent, 'utf8');
  console.log('Daily master log updated.');
} else {
  const dailyContent = `# Daily Master Log — 2026-10-24

> **Date:** 2026-10-24  
> **Total Changes Recorded:** 1  

---

## 🕒 Recorded Changes

### 1. [${changeId}](${fileUri})
- **Timestamp:** \`${timestamp}\`
- **Author:** \`${author}\`
- **Target Files:** \`${targetFiles}\`
- **Summary:** ${summaryReason}
`;
  fs.mkdirSync(path.dirname(dailyPath), { recursive: true });
  fs.writeFileSync(dailyPath, dailyContent, 'utf8');
  console.log('Daily master log created.');
}

// 5. Rotate recent_10/ (FIFO)
const recentDir = path.resolve('changes_log/recent_10');
fs.mkdirSync(recentDir, { recursive: true });
for (let i = 9; i >= 1; i--) {
  const oldFile = path.join(recentDir, `change_recent_${String(i).padStart(2, '0')}.md`);
  const newFile = path.join(recentDir, `change_recent_${String(i+1).padStart(2, '0')}.md`);
  if (fs.existsSync(oldFile)) {
    fs.writeFileSync(newFile, fs.readFileSync(oldFile, 'utf8'), 'utf8');
  }
}
const recent01 = path.join(recentDir, 'change_recent_01.md');
fs.writeFileSync(recent01, entryContent, 'utf8');
console.log('recent_10 rotated successfully.');
