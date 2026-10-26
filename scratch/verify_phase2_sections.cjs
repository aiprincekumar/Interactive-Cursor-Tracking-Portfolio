const fs = require('fs');
const path = require('path');

const sections = [
  'AboutSection.jsx',
  'SkillsSection.jsx',
  'ExperienceSection.jsx',
  'ProjectsSection.jsx',
  'CodingAchievementsSection.jsx',
  'SocialProofSection.jsx',
  'TestimonialsSection.jsx',
  'CameraRollGallery.jsx',
  'FAQSection.jsx',
  'ContactSection.jsx',
  'Footer.jsx',
  'TechMarqueeBanner.jsx'
];

let allPassed = true;

for (const name of sections) {
  const filePath = path.join(__dirname, '..', 'src', 'components', name);
  const content = fs.readFileSync(filePath, 'utf8');
  
  const hasMemo = /React\.memo|memo\(/.test(content);
  const matchDisplay = content.match(/\.displayName\s*=\s*['"]([^'"]+)['"]/);
  const displayName = matchDisplay ? matchDisplay[1] : null;
  const baseName = name.replace('.jsx', '');

  const passed = hasMemo && displayName === baseName;
  if (!passed) allPassed = false;
  
  console.log(`[${passed ? 'PASS' : 'FAIL'}] ${name}: memo=${hasMemo}, displayName="${displayName}" (expected "${baseName}")`);
}

console.log(`\nOverall Section Memo Status: ${allPassed ? 'ALL 12 PASSED' : 'SOME FAILED'}`);
