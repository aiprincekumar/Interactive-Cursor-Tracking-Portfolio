import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('========================================================================');
console.log('  VERIFYING NAVBAR CURSOR, SCROLLSPY & FLOATING TOOLTIPS IMPLEMENTATION  ');
console.log('========================================================================\n');

// 1. Verify CSS Cursor Rules in src/index.css
console.log('--- Suite 1: Universal Pointer Cursor Enforcement in src/index.css ---');
const cssPath = path.resolve('src/index.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');

assert(
  cssContent.includes('cursor: pointer !important;'),
  'Global cursor: pointer !important must exist'
);
assert(
  cssContent.includes('button svg') && cssContent.includes('pointer-events: none;'),
  'Button SVGs must have pointer-events: none to avoid resetting pointer cursor'
);
assert(
  cssContent.includes('[data-cursor-clickable="true"]'),
  'Cursor styling must support [data-cursor-clickable="true"]'
);
assert(
  cssContent.includes('a *,') && cssContent.includes('button *,') && cssContent.includes('[role="button"] *,'),
  'Child elements inside interactive tags must inherit pointer cursor'
);
console.log('✅ PASS: Universal pointer cursor enforcement verified in CSS');

// 2. Verify ScrollSpy in src/components/Navbar.jsx
console.log('\n--- Suite 2: ScrollSpy Dynamic Element Discovery & Active Section ---');
const navbarPath = path.resolve('src/components/Navbar.jsx');
const navbarContent = fs.readFileSync(navbarPath, 'utf8');

assert(
  navbarContent.includes('cachedElements.length < sectionIds.length'),
  'getCachedElements must re-evaluate when lazy sections mount dynamically'
);
assert(
  navbarContent.includes('updateActiveSection'),
  'updateActiveSection function must exist'
);
assert(
  navbarContent.includes('timer1 = setTimeout(updateActiveSection') || navbarContent.includes('timer2 = setTimeout(updateActiveSection'),
  'Staggered initial checks must exist to capture lazily mounted sections'
);
assert(
  navbarContent.includes('setActiveSection((prev) => (prev !== current ? current : prev))'),
  'ScrollSpy updates active section state efficiently'
);
console.log('✅ PASS: ScrollSpy dynamic section discovery verified in Navbar.jsx');

// 3. Verify NavbarTooltip Component Architecture
console.log('\n--- Suite 3: NavbarTooltip Component Architecture ---');
const tooltipPath = path.resolve('src/components/NavbarTooltip.jsx');
assert(fs.existsSync(tooltipPath), 'src/components/NavbarTooltip.jsx must exist');
const tooltipContent = fs.readFileSync(tooltipPath, 'utf8');

assert(
  tooltipContent.includes('openTimerRef') && tooltipContent.includes('120'),
  'NavbarTooltip must use 120ms desktop hover debounce timer'
);
assert(
  tooltipContent.includes('touchTimerRef') && tooltipContent.includes('400'),
  'NavbarTooltip must use 400ms mobile touch-and-hold (long-press) timer'
);
assert(
  tooltipContent.includes('navigator.vibrate'),
  'NavbarTooltip must support optional mobile haptic feedback'
);
assert(
  tooltipContent.includes('role="tooltip"'),
  'NavbarTooltip must provide role="tooltip" for accessibility'
);
assert(
  tooltipContent.includes('data-cursor-clickable="true"'),
  'NavbarTooltip wrapper must have data-cursor-clickable="true"'
);
assert(
  tooltipContent.includes('data-suppressed-title') || tooltipContent.includes('removeAttribute(\'title\')'),
  'NavbarTooltip must suppress erratic browser native tooltip delays'
);
console.log('✅ PASS: NavbarTooltip component architecture verified');

// 4. Verify Navbar Integration with NavbarTooltip
console.log('\n--- Suite 4: Navbar Actions & Links Tooltip Integration ---');
assert(
  navbarContent.includes("import NavbarTooltip from './NavbarTooltip';"),
  'Navbar.jsx must import NavbarTooltip'
);

// Desktop nav links wrapped with tooltips
assert(
  navbarContent.includes('<NavbarTooltip key={link.id} title={link.label}'),
  'Desktop navigation links must be wrapped with NavbarTooltip'
);

// Search button wrapped with tooltip
assert(
  navbarContent.includes('shortcut="⌘K"') || navbarContent.includes('shortcut="Ctrl+K"') || navbarContent.includes('Search Portfolio'),
  'Search button must have NavbarTooltip with keyboard shortcut'
);

// Language, Theme, Audio buttons wrapped with tooltips
assert(
  navbarContent.includes('title={isHindi ? "Language / भाषा" : "भाषा / Language"}') || navbarContent.includes('Language / भाषा'),
  'Language switcher must be wrapped with rich NavbarTooltip'
);
assert(
  navbarContent.includes('Theme Mode') || navbarContent.includes('थीम मोड'),
  'Theme toggle button must be wrapped with rich NavbarTooltip'
);
assert(
  navbarContent.includes('Ambient Audio') || navbarContent.includes('परिवेशी संगीत'),
  'Audio toggle button must be wrapped with rich NavbarTooltip'
);
console.log('✅ PASS: Navbar actions and links correctly integrated with NavbarTooltip');

console.log('\n========================================================================');
console.log('  ALL 4 TEST SUITES PASSED FLAWLESSLY (100%)!                           ');
console.log('========================================================================');
