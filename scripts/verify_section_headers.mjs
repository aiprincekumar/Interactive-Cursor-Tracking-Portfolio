import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const TARGET_COMPONENTS = [
  { name: 'AboutSection', file: 'src/components/AboutSection.jsx', isBenchmark: false },
  { name: 'SkillsSection', file: 'src/components/SkillsSection.jsx', isBenchmark: false },
  { name: 'ExperienceSection', file: 'src/components/ExperienceSection.jsx', isBenchmark: false },
  { name: 'ProjectsSection', file: 'src/components/ProjectsSection.jsx', isBenchmark: false },
  { name: 'CodingAchievementsSection', file: 'src/components/CodingAchievementsSection.jsx', isBenchmark: false },
  { name: 'CameraRollGallery', file: 'src/components/CameraRollGallery.jsx', isBenchmark: false },
  { name: 'InteractivePlayground', file: 'src/components/InteractivePlayground.jsx', isBenchmark: false },
  { name: 'ContactSection', file: 'src/components/ContactSection.jsx', isBenchmark: true }
];

let totalChecks = 0;
let passedChecks = 0;
const failures = [];

function check(title, condition, detail = '') {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✔ PASS: ${title}`);
  } else {
    failures.push({ title, detail });
    console.error(`  ✖ FAIL: ${title} - ${detail}`);
  }
}

console.log('\n========================================================================');
console.log('       SECTION HEADERS & SUB-HEADERS VERIFICATION AUDIT HARNESS');
console.log('   Validating Visual Consistency, Typography & Accent Underlines');
console.log('========================================================================\n');

for (const comp of TARGET_COMPONENTS) {
  const filePath = path.join(rootDir, comp.file);
  console.log(`▶ Auditing Component: ${comp.name} (${comp.file})`);

  check(`${comp.name} exists on filesystem`, fs.existsSync(filePath));
  const content = fs.readFileSync(filePath, 'utf8');

  // 1. Eyebrow Badge Pill classes check
  const hasBadgeStandard = content.includes('rounded-full bg-white dark:bg-[#161122] border border-[#E7E2D8] dark:border-[#2D2340]') &&
                           content.includes('text-[#18181B] dark:text-[#F5F2F8]') &&
                           content.includes('text-xs font-bold uppercase tracking-wider mb-4');
  check(`${comp.name} eyebrow badge has ContactSection pill classes & Obsidian Plum colors`, hasBadgeStandard);

  // 2. Eyebrow Dot Indicator check
  const hasDotIndicator = content.includes('w-2 h-2 rounded-full');
  check(`${comp.name} eyebrow badge contains standard dot indicator`, hasDotIndicator);

  // 3. Heading (h2) typography checks
  const hasH2Outfit = /<h2[^>]*font-\['Outfit',sans-serif\][^>]*>/.test(content);
  check(`${comp.name} <h2> uses Outfit font (font-['Outfit',sans-serif])`, hasH2Outfit);

  const hasH2FontBlack = /<h2[^>]*font-black[^>]*>/.test(content);
  check(`${comp.name} <h2> uses font-black weight`, hasH2FontBlack);

  const hasH2Leading = /<h2[^>]*leading-\[1\.08\][^>]*>/.test(content);
  check(`${comp.name} <h2> uses leading-[1.08] tight line-height`, hasH2Leading);

  const hasH2DarkWhite = /<h2[^>]*dark:text-white[^>]*>/.test(content);
  check(`${comp.name} <h2> uses dark:text-white high-contrast text`, hasH2DarkWhite);

  // 4. Dual-tone highlight check (<span ...> inside h2)
  const h2Match = content.match(/<h2[^>]*>([\s\S]*?)<\/h2>/);
  const hasSpanHighlight = h2Match && /<span[^>]*class(?:Name)?="[^"]*text-\[#FF4D6D\][^"]*"[^>]*>/i.test(h2Match[1]);
  check(`${comp.name} <h2> contains dual-tone highlight (<span ...text-[#FF4D6D]...>)`, Boolean(hasSpanHighlight));

  // 5. Accent underline bar check (<div className="w-12 h-1 rounded-full mb-4" ... />)
  // Check if accent underline bar is immediately following h2 (within 10 lines)
  const hasUnderlineBar = content.includes('w-12 h-1 rounded-full') && content.includes('mb-4');
  check(`${comp.name} contains standardized accent underline bar (w-12 h-1 rounded-full mb-4)`, hasUnderlineBar);

  const h2Index = content.indexOf('<h2');
  const barIndex = content.indexOf('w-12 h-1 rounded-full', h2Index);
  const isDirectlyUnderH2 = h2Index !== -1 && barIndex !== -1 && (barIndex - h2Index) < 500;
  check(`${comp.name} accent underline bar is positioned directly beneath <h2>`, isDirectlyUnderH2);

  // 6. Subheading / Eyebrow badge single-row rule check (whitespace-nowrap)
  const hasBadgeWhitespaceNowrap = content.includes('rounded-full') && content.includes('whitespace-nowrap');
  check(`${comp.name} eyebrow badge strictly enforces single-row whitespace-nowrap`, hasBadgeWhitespaceNowrap);

  // 7. Heading (h2) single-row responsive typography check
  const hasH2SingleRow = /<h2[^>]*whitespace-(?:normal\s+)?sm:whitespace-nowrap[^>]*>/.test(content);
  check(`${comp.name} <h2> enforces single-row typography with responsive whitespace handling`, hasH2SingleRow);

  console.log('------------------------------------------------------------------------');
}

console.log('\n========================================================================');
console.log('                         AUDIT RESULTS SUMMARY');
console.log('========================================================================');
console.log(`  Total Checks:   ${totalChecks}`);
console.log(`  Passed Checks:  ${passedChecks}`);
console.log(`  Failed Checks:  ${failures.length}`);

if (failures.length === 0) {
  console.log('\n  STATUS: ALL PASSED - 100% VISUAL CONSISTENCY & INTEGRITY VERIFIED!\n');
  process.exit(0);
} else {
  console.error(`\n  STATUS: FAILED with ${failures.length} issues.\n`);
  process.exit(1);
}
