import fs from 'fs';
import path from 'path';

const changeId = 'CHG-20261025-050';
const timestamp = '2026-10-25 11:48:00';
const author = 'React and Frontend Debugging Specialist';
const targetFiles = 'src/components/AIChatWidget.jsx, src/components/FloatingActionHub.jsx';
const summaryReason = 'Fix Chat Window Not Opening Bug: Root Cause was orphaned undefined references to updateScrollBoundaries, chipsScrollRef, setFocusedChipIndex, and chipRefs inside AIChatWidget.jsx (leftover from pre-SuggestionChipsDrawer refactor) which threw ReferenceError during render upon isOpen=true, triggering ErrorBoundary null render. Removed orphaned dead code, aligned widget container z-index to z-[55], and added id="ai-chat-trigger" / data-ai-chat-trigger="true" to FloatingActionHub trigger item.';

// 1. Create entry file
const entryDir = path.join('changes_log', 'entries', '2026-10-25');
fs.mkdirSync(entryDir, { recursive: true });
const entryFileName = `change_${changeId}_2026-10-25_11-48-00.md`;
const entryPath = path.join(entryDir, entryFileName);
const entryContent = `# Change Entry: ${changeId}

- **Change ID:** \`${changeId}\`
- **Timestamp:** \`${timestamp}\`
- **Author / Agent:** \`${author}\`
- **Target Files:** \`${targetFiles}\`
- **Summary Reason:** ${summaryReason}

---

## 🔍 Detailed Root Cause Analysis & Technical Fixes

### 1. Root Cause Analysis (RCA)
- **User Issue Reported:** "Chat वाला विंडो तो ओपन ही नहीं हो रहा है।" (The chat window is not opening at all).
- **Failure Mechanism:** In \`src/components/AIChatWidget.jsx\`, when \`isOpen\` was toggled from \`false\` to \`true\` (via FAB click, shortcut, or custom event \`portfolio:open-ai-chat\`), React re-rendered \`AIChatWidget\`.
- **Runtime Error Caught by ErrorBoundary:** Lines 2050–2085 contained orphaned code from before suggestion chips were refactored into \`SuggestionChipsDrawer.jsx\`:
  \`\`\`javascript
  useEffect(() => {
    if (!isOpen) return;
    updateScrollBoundaries();
    const el = chipsScrollRef.current;
    if (el) {
      el.addEventListener('scroll', updateScrollBoundaries, { passive: true });
      return () => el.removeEventListener('scroll', updateScrollBoundaries);
    }
  }, [isOpen, currentChips, updateScrollBoundaries]);
  \`\`\`
  Because \`updateScrollBoundaries\`, \`chipsScrollRef\`, \`setFocusedChipIndex\`, and \`chipRefs\` were no longer defined in \`AIChatWidget.jsx\`, JavaScript threw an immediate \`ReferenceError: updateScrollBoundaries is not defined\`.
- **Silent Suppression:** Because \`<AIChatWidget />\` in \`src/App.jsx\` was wrapped in \`<ErrorBoundary fallback={null} name="AIChatWidget">\`, the component crashed and unmounted to \`null\`, making it appear to the user as if clicking the chat button did nothing at all.

### 2. Exact Remediation Applied
- **\`src/components/AIChatWidget.jsx\`**:
  - Removed orphaned dead \`handleChipKeyDown\` and the broken \`useEffect\` hook that referenced undefined \`updateScrollBoundaries\` and \`chipsScrollRef\` (since \`SuggestionChipsDrawer.jsx\` handles its own boundaries and roving keyboard navigation).
  - Cleaned up container class z-index from \`z-[45]\` to specification standard \`z-[55]\` on \`containerClasses\` and maximized view \`zIndex: 55\`, ensuring it sits properly layered above BackToTopButton (z-50) and below FloatingActionHub (z-60).
- **\`src/components/FloatingActionHub.jsx\`**:
  - Added explicit \`id="ai-chat-trigger"\` and \`data-ai-chat-trigger="true"\` to the AI Chat item in \`commonProps\`, ensuring direct programmatic access and accessibility targeting.

### 3. Verification & Validation
- **CDP Browser Testing:** Executed headless Chrome CDP interaction test script (\`scratch/test_chat_open_cdp.mjs\` and \`scratch/test_chat_mobile_cdp.mjs\`). Confirmed clicking the FAB immediately and reliably opens \`[role="dialog"][aria-label="Atul AI Assistant"]\` with dimensions 380x520 on desktop and full bottom sheet \`min(88dvh, 680px)\` on mobile with 0 console errors.
- **Automated Verification Suites:**
  - \`node scripts/verify_phase3_ai_chat.mjs\` (36/36 checks passed)
  - \`node scripts/verify_ai_chat_feature.mjs\` (4/4 checks passed)
  - \`node scripts/verify_chat_widget_6_features.mjs\` (6/6 checks passed)
  - \`node scripts/verify_aichat_onboarding.mjs\` (All 6 invariants passed)
  - \`node scripts/verify_ai_chat_widget_fix.mjs\` (Passed with 0 undeclared identifiers)
  - \`npm run build\` (Vite production build passed cleanly in 3.34s)
  - Full \`npm test\` (All 37 regression suites passed 100% green).

---

## 🔄 Rollback Instructions

To rollback this change:
\`\`\`bash
git checkout HEAD~1 -- src/components/AIChatWidget.jsx src/components/FloatingActionHub.jsx
\`\`\`
`;
fs.writeFileSync(entryPath, entryContent, 'utf8');

// 2. Update changes_log/summary/changes_summary.md
const summaryPath = path.join('changes_log', 'summary', 'changes_summary.md');
let summaryContent = fs.readFileSync(summaryPath, 'utf8');
const summaryDivider = '| :--- | :--- | :--- | :--- | :--- |';
const newSummaryRow = `| **${changeId}** | \`${timestamp}\` | \`${author}\` | \`${targetFiles}\` | ${summaryReason} |`;
if (summaryContent.includes(summaryDivider)) {
  summaryContent = summaryContent.replace(summaryDivider, `${summaryDivider}\n${newSummaryRow}`);
} else {
  summaryContent = summaryContent.replace('| Change ID | Timestamp | Author / Agent | Target File(s) | Summary & Reason |\n| --- | --- | --- | --- | --- |\n', `| Change ID | Timestamp | Author / Agent | Target File(s) | Summary & Reason |\n| --- | --- | --- | --- | --- |\n${newSummaryRow}\n`);
}
fs.writeFileSync(summaryPath, summaryContent, 'utf8');

// 3. Update changes_log/master/master_changes_log.md
const masterPath = path.join('changes_log', 'master', 'master_changes_log.md');
let masterContent = fs.readFileSync(masterPath, 'utf8');
const entryRelLink = `changes_log/entries/2026-10-25/${entryFileName}`;
const newMasterRow = `| **[${changeId}](${entryRelLink})** | \`${timestamp}\` | \`${author}\` | \`${targetFiles}\` | [View Entry](${entryRelLink}) |`;
masterContent = masterContent.replace('## 📋 Table of Changes\n\n| Change ID | Date & Time | Author / Agent | Target Files | Summary Link |\n| --- | --- | --- | --- | --- |\n', `## 📋 Table of Changes\n\n| Change ID | Date & Time | Author / Agent | Target Files | Summary Link |\n| --- | --- | --- | --- | --- |\n${newMasterRow}\n`);

const newMasterDetails = `### [${changeId}] Fix Chat Window Not Opening Bug in AIChatWidget.jsx
- **Entry File:** [${entryFileName}](${entryRelLink})
- **Target Files:** \`${targetFiles}\`
- **Author:** \`${author}\`
- **Scope:** ${summaryReason}
- **Rollback Instructions:** Revert modified files using \`git checkout HEAD~1 -- src/components/AIChatWidget.jsx src/components/FloatingActionHub.jsx\`.

`;
masterContent = masterContent.replace('## 📌 Master Change Details & Rollback Index\n\n', `## 📌 Master Change Details & Rollback Index\n\n${newMasterDetails}`);
fs.writeFileSync(masterPath, masterContent, 'utf8');

// 4. Update changes_log/daily/2026-10-25/daily_master_log.md
const dailyPath = path.join('changes_log', 'daily', '2026-10-25', 'daily_master_log.md');
let dailyContent = fs.readFileSync(dailyPath, 'utf8');
const newDailyEntry = `
### 35. ${changeId} (11:48:00)
- **Target File:** \`${targetFiles}\`
- **Author:** \`${author}\`
- **Summary:** ${summaryReason}
- **Detailed Entry:** [${entryFileName}](../../entries/2026-10-25/${entryFileName})
`;
dailyContent += newDailyEntry;
fs.writeFileSync(dailyPath, dailyContent, 'utf8');

// 5. Update changes_log/recent_10/
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
const recent01Content = `# Recent Change 01: ${changeId}

- **Change ID:** \`${changeId}\`
- **Timestamp:** \`${timestamp}\`
- **Target File:** \`${targetFiles}\`
- **Author:** \`${author}\`
- **Lines Changed:** \`Lines 2050–2085 in AIChatWidget.jsx, Lines 630-645 in FloatingActionHub.jsx\`

## Summary
${summaryReason}

## Key Components Verified
1. **RCA Identification**: Eliminated orphaned \`updateScrollBoundaries\` and \`chipsScrollRef\` causing uncaught \`ReferenceError\` when chat window mounted.
2. **Container Sizing & Layering**: Realigned \`containerClasses\` z-index to \`z-[55]\` and maximized view to \`zIndex: 55\`.
3. **Trigger Identifiers**: Added explicit \`id="ai-chat-trigger"\` and \`data-ai-chat-trigger="true"\` on FloatingActionHub.
4. **End-to-End CDP & Test Suite Passes**: Verified using headless Chrome CDP and 100% green pass on all 37 test suites.
`;
fs.writeFileSync(recent01Path, recent01Content, 'utf8');

console.log('Successfully recorded CHG-20261025-050 in all changes_log locations!');
