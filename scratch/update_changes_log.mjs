import fs from 'fs';
import path from 'path';

const changeId = 'CHG-20261024-025';
const timestamp = '2026-10-24 03:50:00';
const author = 'changes_log_manager / Agentic Engineer';
const targetFiles = 'src/components/AIChatWidget.jsx, src/utils/portfolioAssistantEngine.js';
const summaryReason = 'Fix Header Trigger Decision Trees in AIChatWidget.jsx. Rebuilt handleTriggerAudienceDecisionTree and handleTriggerRoleDecisionTree to inject explicit audience and role properties on every option chip, aligning with the working welcome message pattern and ensuring clicking header icons (👥, 💼) instantly switches Audience and Job Role throughout the application.';

// 1. Create entry file: changes_log/entries/2026-10-24/change_CHG-20261024-025_2026-10-24_03-50-00.md
const entryDir = path.join('changes_log', 'entries', '2026-10-24');
fs.mkdirSync(entryDir, { recursive: true });
const entryPath = path.join(entryDir, `change_${changeId}_2026-10-24_03-50-00.md`);
const entryContent = `# Change Entry: ${changeId}

- **Change ID:** \`${changeId}\`
- **Timestamp:** \`${timestamp}\`
- **Author / Agent:** \`${author}\`
- **Target Files:** \`${targetFiles}\`
- **Summary Reason:** ${summaryReason}

---

## 🔍 Detailed Description & Technical Changes

1. **\`src/components/AIChatWidget.jsx\` & \`src/utils/portfolioAssistantEngine.js\`**:
   - Rebuilt \`handleTriggerAudienceDecisionTree\` and \`handleTriggerRoleDecisionTree\` to inject explicit \`audience\` and \`role\` properties on every option chip.
   - Aligned with the working welcome message pattern, ensuring clicking header icons (\`👥\`, \`💼\`) instantly switches Audience and Job Role throughout the application.

---

## 🔄 Rollback Instructions

To rollback this change:
\`\`\`bash
git checkout HEAD~1 -- src/components/AIChatWidget.jsx src/utils/portfolioAssistantEngine.js
\`\`\`
`;
fs.writeFileSync(entryPath, entryContent, 'utf8');

// 2. Update changes_log/summary/changes_summary.md
const summaryPath = path.join('changes_log', 'summary', 'changes_summary.md');
let summaryContent = fs.readFileSync(summaryPath, 'utf8');
const summaryHeaderTableDivider = '| :--- | :--- | :--- | :--- | :--- |';
const newSummaryRow = `| **${changeId}** | \`${timestamp}\` | \`${author}\` | \`${targetFiles}\` | ${summaryReason} |`;
if (summaryContent.includes(summaryHeaderTableDivider)) {
  summaryContent = summaryContent.replace(summaryHeaderTableDivider, `${summaryHeaderTableDivider}\n${newSummaryRow}`);
} else {
  summaryContent = summaryContent.replace('| Change ID | Timestamp | Author / Agent | Target File(s) | Summary & Reason |\n| --- | --- | --- | --- | --- |', `| Change ID | Timestamp | Author / Agent | Target File(s) | Summary & Reason |\n| --- | --- | --- | --- | --- |\n${newSummaryRow}`);
}
fs.writeFileSync(summaryPath, summaryContent, 'utf8');

// 3. Update changes_log/master/master_changes_log.md
const masterPath = path.join('changes_log', 'master', 'master_changes_log.md');
let masterContent = fs.readFileSync(masterPath, 'utf8');
const entryFileLink = `changes_log/entries/2026-10-24/change_${changeId}_2026-10-24_03-50-00.md`;
const newMasterRow = `| **[${changeId}](${entryFileLink})** | \`${timestamp}\` | \`${author}\` | \`${targetFiles}\` | [View Entry](${entryFileLink}) |`;
masterContent = masterContent.replace('## 📋 Table of Changes\n\n| Change ID | Date & Time | Author / Agent | Target Files | Summary Link |\n| --- | --- | --- | --- | --- |\n', `## 📋 Table of Changes\n\n| Change ID | Date & Time | Author / Agent | Target Files | Summary Link |\n| --- | --- | --- | --- | --- |\n${newMasterRow}\n`);

const newMasterDetails = `### [${changeId}] Fix Header Trigger Decision Trees in AIChatWidget.jsx
- **Entry File:** [change_${changeId}_2026-10-24_03-50-00.md](${entryFileLink})
- **Target Files:** \`${targetFiles}\`
- **Author:** \`${author}\`
- **Scope:** ${summaryReason}
- **Rollback Instructions:** Revert modified files using \`git checkout HEAD~1 -- src/components/AIChatWidget.jsx src/utils/portfolioAssistantEngine.js\`.

`;
masterContent = masterContent.replace('## 📌 Master Change Details & Rollback Index\n\n', `## 📌 Master Change Details & Rollback Index\n\n${newMasterDetails}`);
fs.writeFileSync(masterPath, masterContent, 'utf8');

// 4. Update changes_log/daily/2026-10-24/daily_master_log.md
const dailyPath = path.join('changes_log', 'daily', '2026-10-24', 'daily_master_log.md');
let dailyContent = fs.readFileSync(dailyPath, 'utf8');
const newDailyEntry = `### [${changeId}](${entryFileLink})
- **Timestamp:** \`${timestamp}\`
- **Author:** \`${author}\`
- **Target Files:** \`${targetFiles}\`
- **Reason:** ${summaryReason}

`;
dailyContent = dailyContent.replace('## 🕒 Recorded Changes\n\n', `## 🕒 Recorded Changes\n\n${newDailyEntry}`);
dailyContent = dailyContent.replace(/> Total Changes Recorded: (\d+)/, (match, p1) => `> Total Changes Recorded: ${parseInt(p1) + 1}`);
fs.writeFileSync(dailyPath, dailyContent, 'utf8');

// 5. Update changes_log/recent_10/ (rotate FIFO ensuring 10 recent standalone change logs exist)
const recentDir = path.join('changes_log', 'recent_10');
for (let i = 9; i >= 1; i--) {
  const srcName = `change_recent_${String(i).padStart(2, '0')}.md`;
  const dstName = `change_recent_${String(i + 1).padStart(2, '0')}.md`;
  const srcPath = path.join(recentDir, srcName);
  const dstPath = path.join(recentDir, dstName);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, dstPath);
  }
}
const recent01Path = path.join(recentDir, 'change_recent_01.md');
const recent01Content = `# Recent Change: ${changeId}

- **Change ID:** \`${changeId}\`
- **Timestamp:** \`${timestamp}\`
- **Author:** \`${author}\`
- **Target Files:** \`${targetFiles}\`
- **Summary:** ${summaryReason}
`;
fs.writeFileSync(recent01Path, recent01Content, 'utf8');

console.log('Successfully updated all changes_log files for CHG-20261024-025!');
