const fs = require('fs');
const path = require('path');
const dir = 'changes_log/recent_10';

for (let i = 9; i >= 1; i--) {
  const src = path.join(dir, `change_recent_${String(i).padStart(2, '0')}.md`);
  const dest = path.join(dir, `change_recent_${String(i + 1).padStart(2, '0')}.md`);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
}

const newContent = `# Recent Change: CHG-20261024-024

- **Change ID:** \`CHG-20261024-024\`
- **Timestamp:** \`2026-10-24 03:45:00\`
- **Author:** \`changes_log_manager\` / Agentic Engineer
- **Target Files:** \`src/utils/portfolioAssistantEngine.js\`, \`src/components/AIChatWidget.jsx\`
- **Summary:** Fix Job Role and Audience Switching Inside AI Chat Box. Inject explicit \`audience\` and \`role\` properties into \`ONBOARDING_DECISION_TREE\` and \`getOnboardingDecisionTree\` options in \`portfolioAssistantEngine.js\`, map options in \`handleTriggerAudienceDecisionTree\` and \`handleTriggerRoleDecisionTree\`, and update chip rendering logic in \`AIChatWidget.jsx\` with multi-step fallback detection to reliably bind \`handleAudienceDecisionSelect\` and \`handleRoleDecisionSelect\`.
`;

fs.writeFileSync(path.join(dir, 'change_recent_01.md'), newContent, 'utf8');
console.log('Rotation completed successfully.');
