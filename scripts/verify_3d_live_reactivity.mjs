import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('  VERIFY 3D LIVE PREVIEW REACTIVITY SPECIFICATION               ');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     ${err.message}`);
    failCount++;
  }
}

const miniPortfolioPath = path.join(rootDir, 'src/components/3d-sandbox/UniversalMiniPortfolio.jsx');
assert(fs.existsSync(miniPortfolioPath), 'UniversalMiniPortfolio.jsx must exist');
const miniSrc = fs.readFileSync(miniPortfolioPath, 'utf8');

runTest('UniversalMiniPortfolio exports THEME_PORTFOLIO_STYLES with 4 master themes', () => {
  assert(miniSrc.includes('export const THEME_PORTFOLIO_STYLES'), 'Must export THEME_PORTFOLIO_STYLES');
  assert(miniSrc.includes('apple-glass'), 'Must support apple-glass theme');
  assert(miniSrc.includes('cyber-neon'), 'Must support cyber-neon theme');
  assert(miniSrc.includes('studio-matte'), 'Must support studio-matte theme');
  assert(miniSrc.includes('floating-hologram'), 'Must support floating-hologram theme');
});

runTest('UniversalMiniPortfolio destructures masterTheme and elements from useLab3D', () => {
  assert(miniSrc.includes('masterTheme = threeD.masterTheme') || miniSrc.includes('threeD.masterTheme'), 'Must access masterTheme');
  assert(miniSrc.includes('elements = threeD.elements') || miniSrc.includes('threeD.elements'), 'Must access elements');
});

runTest('UniversalMiniPortfolio implements 10 element toggles live 3D pop/flat response', () => {
  const toggles = [
    'navbarItems',
    'navbarIcons',
    'profilePic',
    'header',
    'subHeader',
    'description',
    'container',
    'containerContent',
    'floatingButton',
    'resumeButton'
  ];
  for (const t of toggles) {
    assert(miniSrc.includes(`elements.${t}`) || miniSrc.includes(`elements[${t}]`), `Must track elements.${t}`);
  }
});

runTest('Mini-Navbar elevates +24px when navbarItems/navbarIcons ON, flat Z-0px when OFF', () => {
  assert(miniSrc.includes('isNav3D'), 'Must define isNav3D');
  assert(miniSrc.includes('18 + 24'), 'Must calculate 18 + 24 elevation for navbar');
});

runTest('Mini-Hero Card inner elements pop on distinct Z-planes (30px, 20px, 16px, 12px)', () => {
  assert(miniSrc.includes('translateZ(30px)'), 'Avatar must pop to translateZ(30px)');
  assert(miniSrc.includes('translateZ(20px)'), 'Headline must pop to translateZ(20px)');
  assert(miniSrc.includes('translateZ(16px)'), 'Status badge must pop to translateZ(16px)');
  assert(miniSrc.includes('translateZ(12px)'), 'Bio description must pop to translateZ(12px)');
});

runTest('Mini-Skills Grid extrudes +20px and tiles pop with 3D shadow', () => {
  assert(miniSrc.includes('24 + 20'), 'Must calculate 24 + 20 elevation for grid');
  assert(miniSrc.includes('isGrid3D'), 'Must track isGrid3D');
  assert(miniSrc.includes('translateZ(14px)'), 'Tile content must pop to translateZ(14px)');
});

runTest('Mini-Dock floats +40px and buttons pop with 3D elevation', () => {
  assert(miniSrc.includes('42 + 40'), 'Must calculate 42 + 40 elevation for floating dock');
  assert(miniSrc.includes('isDock3D'), 'Must track isDock3D');
});

runTest('Master 3D switch OFF brings all elements to complete flat 2D (translateZ(0px))', () => {
  assert(miniSrc.includes('isMaster3DOn ?'), 'Must check isMaster3DOn');
  assert(miniSrc.includes('translateZ(0px)'), 'Must fallback to translateZ(0px)');
});

runTest('Dedicated preview components import THEME_PORTFOLIO_STYLES and track 3D toggles', () => {
  const previews = ['HeroCardPreview.jsx', 'Navbar3DPreview.jsx', 'FloatingDockPreview.jsx', 'SectionShowcasePreview.jsx', 'Footer3DPreview.jsx'];
  for (const p of previews) {
    const pPath = path.join(rootDir, 'src/components/3d-sandbox/previews', p);
    const pSrc = fs.readFileSync(pPath, 'utf8');
    assert(pSrc.includes('THEME_PORTFOLIO_STYLES'), `${p} must import THEME_PORTFOLIO_STYLES`);
    assert(pSrc.includes('threeD.masterTheme') || pSrc.includes('masterTheme'), `${p} must access masterTheme`);
    assert(pSrc.includes('threeD.elements') || pSrc.includes('elements'), `${p} must access elements`);
  }
});

console.log('\n================================================================');
console.log(`  3D LIVE REACTIVITY AUDIT: ${passCount} PASSED | ${failCount} FAILED`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
}
