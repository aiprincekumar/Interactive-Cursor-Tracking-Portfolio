/**
 * Automated Verification Script: RoleTabsBar Scroll/Truncation & Hero Controls Center Alignment
 *
 * Verifies:
 * 1. RoleTabsBar 'drawer' variant has no text truncate class, buttons have shrink-0 whitespace-nowrap, container has scroll-smooth.
 * 2. RoleTabsBar 'floating-bar' variant has justify-start sm:justify-center, scroll-smooth, shrink-0 whitespace-nowrap, and a clearance spacer before the close button.
 * 3. HeroSection Row 2 controls container has justify-center self-center md:justify-end md:self-auto w-full md:w-auto.
 */

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';

const ROOT = process.cwd();
const roleTabsBarPath = path.join(ROOT, 'src', 'components', 'RoleTabsBar.jsx');
const heroSectionPath = path.join(ROOT, 'src', 'components', 'HeroSection.jsx');

console.log('--- Verifying RoleTabsBar & HeroSection Improvements ---');

const roleTabsBarContent = fs.readFileSync(roleTabsBarPath, 'utf8');
const heroSectionContent = fs.readFileSync(heroSectionPath, 'utf8');

// 1. RoleTabsBar - Drawer Variant
assert(
  roleTabsBarContent.includes('variant === \'drawer\''),
  'RoleTabsBar must support drawer variant'
);
assert(
  !roleTabsBarContent.includes('<span className="truncate">{track.label}</span>'),
  'Drawer variant must NOT truncate track label'
);
assert(
  roleTabsBarContent.includes('<span className="whitespace-nowrap">{track.label}</span>'),
  'Drawer variant must display full track label with whitespace-nowrap'
);
assert(
  roleTabsBarContent.includes('className="flex items-center gap-1.5 select-none overflow-x-auto no-scrollbar scroll-smooth px-0.5"'),
  'Drawer container must have scroll-smooth and horizontal overflow-x-auto'
);
console.log('✓ Check 1: RoleTabsBar drawer variant shows full non-truncated text with smooth scroll.');

// 2. RoleTabsBar - Floating Bar Variant
assert(
  roleTabsBarContent.includes('justify-start sm:justify-center overflow-x-auto no-scrollbar scroll-smooth px-1 sm:px-2'),
  'Floating bar container must align justify-start on mobile and justify-center on sm+, with smooth scrolling and horizontal padding'
);
assert(
  roleTabsBarContent.includes('shrink-0 whitespace-nowrap text-xs font-bold font-mono'),
  'Floating bar buttons must be shrink-0 whitespace-nowrap to avoid text wrapping or clipping'
);
assert(
  roleTabsBarContent.includes('w-2 shrink-0 sm:hidden'),
  'Floating bar must have clearance spacer before close button on mobile'
);
console.log('✓ Check 2: RoleTabsBar floating-bar variant enables full scroll to edges and prevents text clipping.');

// 3. HeroSection Row 2 Controls
assert(
  heroSectionContent.includes('justify-center self-center md:justify-end md:self-auto flex-wrap sm:flex-nowrap gap-2 sm:gap-3 pointer-events-auto w-full md:w-auto'),
  'HeroSection row 2 controls must be centered on mobile (justify-center self-center) and right-aligned on desktop (md:justify-end md:self-auto)'
);
console.log('✓ Check 3: HeroSection row 2 controls centered on mobile and right-aligned on desktop.');

console.log('\n--- ALL VERIFICATIONS PASSED SUCCESSFULLY (3/3) ---');
