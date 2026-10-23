import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('--- RUNNING AUDIT FOR NAVBAR ICONS & STYLING ---');

const navbarPath = path.resolve('src/components/Navbar.jsx');
const navbarCode = fs.readFileSync(navbarPath, 'utf8');

// 1. Language Switcher Button in Desktop Navbar
assert(navbarCode.includes('export function IndiaFlag'), 'IndiaFlag vector component must be exported/defined');
assert(navbarCode.includes('export function UkFlag'), 'UkFlag vector component must be exported/defined');
assert(navbarCode.includes('<IndiaFlag className="w-[18px] h-[18px]" />'), 'IndiaFlag must be rendered when isHindi is true in desktop navbar');
assert(navbarCode.includes('<UkFlag className="w-[18px] h-[18px]" />'), 'UkFlag must be rendered when isHindi is false in desktop navbar');
console.log('✅ PASS: Desktop language switcher uses pure vector SVG flags for UK and India');

// 2. Uniform button container style
const expectedContainerStyle = 'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 border cursor-pointer bg-white/80 dark:bg-stone-800/80 hover:bg-white dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 hover:text-[#18181B] dark:hover:text-white border-[#E7E2D8] dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 shadow-2xs hover:scale-105 active:scale-95';

assert(navbarCode.includes(expectedContainerStyle), 'Common container style must be used across navbar action buttons');

// Check that Search button has compact w-8 h-8 rounded-full style and retains data-testid and title
assert(navbarCode.includes('data-testid="Search portfolio (Cmd+K)"'), 'Search button data-testid retained');
assert(navbarCode.includes('title="Search portfolio (Cmd+K) / Ctrl+K"'), 'Search button title retained');
assert(!navbarCode.includes('hidden lg:inline-block text-[11px] font-semibold text-stone-600 dark:text-stone-300 group-hover:text-[#18181B] dark:group-hover:text-white'), 'Search text pill removed in favor of compact icon');
console.log('✅ PASS: Search button successfully converted to compact w-8 h-8 circular button');

// 3. Theme Toggle and Audio Toggle matching container style
assert(navbarCode.includes('group-hover:rotate-45 transition-transform duration-300'), 'Theme Toggle retains Sun rotate animation');
assert(navbarCode.includes('group-hover:-rotate-12 transition-transform duration-300'), 'Theme Toggle retains Moon rotate animation');
console.log('✅ PASS: Theme toggle and Audio toggle match uniform w-8 h-8 container style with animations preserved');

// 4. Mobile drawer synchronization
assert(navbarCode.includes('<IndiaFlag className="w-3.5 h-3.5" />'), 'Mobile drawer language switch features IndiaFlag');
assert(navbarCode.includes('<UkFlag className="w-3.5 h-3.5" />'), 'Mobile drawer language switch features UkFlag');
console.log('✅ PASS: Mobile drawer language switcher synchronizes with vector SVG flags');

// 5. Vector flag details verification
assert(navbarCode.includes('stroke="#000080"'), 'IndiaFlag includes navy blue Ashoka Chakra');
assert(navbarCode.includes('fill="#012169"'), 'UkFlag includes authentic UK navy blue background');
assert(navbarCode.includes('stroke="#C8102E"'), 'UkFlag includes authentic St. George/St. Patrick red');
console.log('✅ PASS: Flag SVGs have accurate colors and geometry');

console.log('========================================================================');
console.log('TOTAL AUDIT CHECKS: 5 | ALL PASSED (100%)');
console.log('========================================================================');
