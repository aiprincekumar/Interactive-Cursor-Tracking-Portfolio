const fs = require('fs');
const path = require('path');
const dir = path.join('changes_log', 'recent_10');
const f01 = path.join(dir, 'change_recent_01.md');
if (fs.existsSync(f01)) fs.unlinkSync(f01);
for (let i = 2; i <= 10; i++) {
  const oldName = path.join(dir, 'change_recent_' + String(i).padStart(2, '0') + '.md');
  const newName = path.join(dir, 'change_recent_' + String(i-1).padStart(2, '0') + '.md');
  if (fs.existsSync(oldName)) {
    fs.renameSync(oldName, newName);
  }
}
const new10 = path.join(dir, 'change_recent_10.md');
const content = '# Recent Change 10: CHG-20261024-027\n\n- **Change ID:** `CHG-20261024-027`\n- **Timestamp:** `2026-10-24 04:35:00`\n- **Target File:** `src/components/AIChatWidget.jsx, src/utils/portfolioAssistantEngine.js`\n- **Summary:** Complete Implementation of 6 High-Impact AI Chat Box Features: Copy Message to Clipboard, Text-to-Speech (TTS Read-Aloud), Voice Input Dictation (Speech-to-Text), In-Chat Slash Commands Autocomplete Menu, Chat Transcript Export (.md), and Global Keyboard Shortcuts (Ctrl+K, Alt+C, Escape).\n';
fs.writeFileSync(new10, content, 'utf8');
console.log('Successfully rotated recent_10');
