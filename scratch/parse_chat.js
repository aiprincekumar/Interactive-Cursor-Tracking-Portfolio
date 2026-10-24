import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/components/AIChatWidget.jsx');
const code = fs.readFileSync(filePath, 'utf8');

console.log("Analyzing AIChatWidget.jsx...");

const checks = [
  'activeAudienceData',
  'activeViewModeData',
  'activeRoleData',
  'roleData',
  'selectRole',
  'soundEnabled',
  'viewMode',
  'selectViewMode',
  'useViewMode',
  'setAudience'
];

checks.forEach(v => {
  const usedRegex = new RegExp(`\\b${v}\\b`, 'g');
  const matches = code.match(usedRegex);
  const count = matches ? matches.length : 0;
  
  let declared = false;
  if (
    code.includes(`const ${v}`) || 
    code.includes(`let ${v}`) || 
    code.includes(`var ${v}`) || 
    code.includes(`use${v}`) ||
    (code.includes(v) && (code.includes(`const [${v}`) || code.includes(`, ${v} `) || code.includes(`, ${v},`) || code.includes(`\n  ${v} =`) || code.includes(`const ${v} =`)))
  ) {
    declared = true;
  }
  
  console.log(`Variable: ${v} | Total Occurrences: ${count} | Appears Defined/Imported: ${declared}`);
});
