import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/components/AIChatWidget.jsx');
const code = fs.readFileSync(filePath, 'utf8');

// Let's inspect all hooks used:
// useLab, useRole, useAudience, useAnnounce, useViewMode
const hooks = ['useLab', 'useRole', 'useAudience', 'useAnnounce', 'useViewMode'];
hooks.forEach(h => {
  const called = code.includes(`${h}()`);
  const imported = code.includes(h);
  console.log(`Hook: ${h} | Imported: ${imported} | Called in component: ${called}`);
});

// Let's check variables used in header / message rendering:
const variablesToCheck = [
  'activeAudienceData',
  'activeViewModeData',
  'activeRoleData',
  'roleData',
  'selectRole',
  'soundEnabled',
  'viewMode',
  'selectViewMode',
  'audience',
  'activeRole',
  'isDrawerOpen',
  'emojiEnabled',
  'isMinimized',
  'isOpen',
  'messages',
  'isTyping',
  'inputValue',
  'canScrollLeft',
  'canScrollRight',
  'isDraggingChips',
  'focusedChipIndex',
  'currentChips',
  'liveAnnouncement',
  'inlineSpecifyMsgId',
  'inlineSpecifyText',
  'skippedDecisionTreeMsgIds'
];

variablesToCheck.forEach(v => {
  const regex = new RegExp(`\\b${v}\\b`, 'g');
  const matches = code.match(regex);
  const count = matches ? matches.length : 0;
  
  // check if defined via const/let/var/import/destructure
  const isDeclared = 
    code.includes(`const ${v}`) ||
    code.includes(`let ${v}`) ||
    code.includes(`var ${v}`) ||
    code.includes(`[${v}`) ||
    code.includes(`, ${v}`) ||
    code.includes(`(${v}`) ||
    code.includes(`${v},`) ||
    code.includes(`${v} =`) ||
    code.includes(`import`) && code.includes(v);

  console.log(`Variable/Prop: ${v} | Occurrences: ${count} | Declared/Imported: ${isDeclared}`);
});
