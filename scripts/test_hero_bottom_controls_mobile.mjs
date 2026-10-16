import fs from 'node:fs';
import path from 'node:path';

console.log('🧪 Starting Hero Section Bottom Controls Mobile Layout Verification Tests...\n');

const heroSectionPath = path.resolve('src/components/HeroSection.jsx');
const content = fs.readFileSync(heroSectionPath, 'utf8');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failCount++;
  }
}

// Test 1: Unified Responsive Container replaces disconnected absolute corners
assert(
  content.includes('absolute bottom-6 sm:bottom-8 left-4 sm:left-6 md:left-12 right-4 sm:right-6 md:right-12 z-20 pointer-events-none flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6'),
  'Outer container spans left-to-right across full viewport width with responsive flex-col (mobile) and md:flex-row (desktop)'
);

// Test 2: Pointer events separation
assert(
  content.includes('pointer-events-none flex flex-col md:flex-row') &&
  content.includes('flex flex-col gap-2.5 sm:gap-3 pointer-events-auto') &&
  content.includes('gap-2 sm:gap-3 pointer-events-auto'),
  'Outer layout wrapper has pointer-events-none and interactive children have pointer-events-auto'
);

// Test 3: Row 1 has typography & all 7 social media links
assert(
  content.includes('activeTrack?.heroTitle') &&
  content.includes('activeTrack?.heroSubtitle') &&
  content.includes('NotionIcon') &&
  content.includes('GithubIcon') &&
  content.includes('LinkedinIcon') &&
  content.includes('YoutubeIcon') &&
  content.includes('FacebookIcon') &&
  content.includes('InstagramIcon') &&
  content.includes('TwitterIcon'),
  'Row 1 / Left Column retains Title, Subtitle, and all 7 social media icons'
);

// Test 4: Row 2 has zoom controls, photo click button, and view moments link
assert(
  content.includes('handleZoomOut') &&
  content.includes('handleZoomIn') &&
  content.includes('handleReset') &&
  content.includes('triggerCapture') &&
  content.includes('href="#gallery"'),
  'Row 2 / Right Column retains zoom out/in/reset, camera photo capture, and view moments gallery link'
);

// Test 5: Responsive mobile alignment and responsive shrink controls
assert(
  content.includes('justify-end') &&
  (content.includes('self-end md:self-auto') || content.includes('self-center md:justify-end md:self-auto')) &&
  content.includes('w-full md:w-auto'),
  'Camera & zoom controls align properly on mobile and desktop'
);

// Test 6: Verify no collision - old absolute bottom-8 right-4 is removed
assert(
  !content.includes('absolute bottom-8 right-4'),
  'Old absolute positioning on camera controls container that overlapped social icons has been removed'
);

// Test 7: Verify shrink-0 and responsive sizes on narrow screens
assert(
  content.includes('w-14 sm:w-20') &&
  content.includes('w-9 h-9 sm:w-11 sm:h-11') &&
  content.includes('shrink-0'),
  'Zoom pill and action buttons include responsive sizing and shrink-0 to prevent narrow mobile overflow'
);

console.log(`\n========================================`);
console.log(`Test Results: ${passCount} Passed, ${failCount} Failed`);
console.log(`========================================\n`);

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 All Hero section mobile layout tests passed with 100% precision!');
}
