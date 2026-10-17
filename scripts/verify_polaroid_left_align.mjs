import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('=== POLAROID CLEAN SURFACE & LEFT-ALIGNMENT VERIFICATION ===\n');

// 1. Verify CameraRollGallery.jsx
const galleryPath = path.resolve('src/components/CameraRollGallery.jsx');
const galleryCode = fs.readFileSync(galleryPath, 'utf-8');

console.log('Checking src/components/CameraRollGallery.jsx:');

// Ensure no floating badges inside the photo card container
const cardPhotoFrameRegex = /<div className="relative aspect-\[4\/3\] rounded-xl overflow-hidden[\s\S]*?<\/div>\s*<\/div>/;
const cardPhotoMatch = galleryCode.match(cardPhotoFrameRegex);
assert(cardPhotoMatch, 'Card photo frame container must exist');
const cardPhotoHtml = cardPhotoMatch[0];

assert(!cardPhotoHtml.includes('SHUTTER LOG'), 'Card photo frame MUST NOT contain floating SHUTTER LOG badge');
assert(!cardPhotoHtml.includes('ATUL VERMA'), 'Card photo frame MUST NOT contain floating ATUL VERMA timestamp badge');
assert(!cardPhotoHtml.includes('Amber'), 'Card photo frame MUST NOT contain Amber badge inside photo surface');
console.log('  [PASS] Card photo frame is completely clean of floating badges.');

// Ensure modal photo frame has no floating overlay badge
const modalPhotoFrameRegex = /<div className="aspect-\[16\/9\] rounded-2xl overflow-hidden mb-4[\s\S]*?<\/div>/;
const modalPhotoMatch = galleryCode.match(modalPhotoFrameRegex);
assert(modalPhotoMatch, 'Modal photo frame container must exist');
const modalPhotoHtml = modalPhotoMatch[0];
assert(!modalPhotoHtml.includes('SHUTTER LOG'), 'Modal photo frame MUST NOT contain floating badge on top of image');
console.log('  [PASS] Modal photo frame is completely clean of floating badges.');

// Check Chin information structure in card: Title, LED Timestamp, Note strictly stacked & left-aligned
assert(galleryCode.includes('flex flex-col items-start text-left'), 'Chin text container must be items-start flex-col text-left');
assert(galleryCode.includes('text-[#FF7700] font-mono text-[10px] font-bold tracking-wider select-none shadow-xs'), 'Chin must include amber LED badge');
assert(galleryCode.includes('self-start inline-flex items-center px-2 py-0.5 rounded-md bg-[#1c1917]'), 'Amber LED badge must be self-start left-aligned');
assert(galleryCode.includes('w-full text-left'), 'Title and note must be explicitly text-left');
console.log('  [PASS] Chin area correctly stacks Title, Amber LED timestamp, and Note in left-aligned layout.');

// 2. Verify polaroidExport.js
const exportPath = path.resolve('src/utils/polaroidExport.js');
const exportCode = fs.readFileSync(exportPath, 'utf-8');

console.log('\nChecking src/utils/polaroidExport.js:');

// Check formatVintageTimestamp implementation
assert(exportCode.includes('ATUL VERMA • ${day} ${month} ${year} ${formattedHours}:${minutes} ${ampm}'), 'formatVintageTimestamp must format with ATUL VERMA prefix');
console.log('  [PASS] formatVintageTimestamp outputs standard "ATUL VERMA • DD MMM YYYY hh:mm A".');

// Check that photo viewport has no drawing of timestamp badges
// Viewport section is between clip and restore
const photoViewportBlock = exportCode.slice(exportCode.indexOf('ctx.clip();'), exportCode.indexOf('ctx.restore();\n\n  // 4. Bottom Paper Margin'));
assert(!photoViewportBlock.includes('ledText') && !photoViewportBlock.includes('formatVintageTimestamp') && !photoViewportBlock.includes('photo.timestamp'), 'Inside photo viewport clipping, no timestamp or badge is drawn');
assert(!photoViewportBlock.includes('badge'), 'Inside photo viewport clipping, badge MUST NOT be drawn');
console.log('  [PASS] Inner photo canvas is pristine and clean with zero timestamp or badge overlays.');

// Check bottom margin layout
assert(exportCode.includes('const leftX = photoMarginX; // 50px from left'), 'leftX must be strictly equal to photoMarginX (50px)');
assert(exportCode.includes("ctx.textAlign = 'left';"), 'ctx.textAlign must be set to left');
assert(exportCode.includes('ctx.fillText(truncateText(ctx, rawTitle, maxContentWidth), leftX, titleY);'), 'Title must be drawn at leftX');
assert(exportCode.includes('roundRect(leftX, badgeY, badgeW, badgeH'), 'Amber LED badge box must start at leftX');
assert(exportCode.includes('ctx.fillText(ledText, leftX + badgePadX, ledCenterY);'), 'Amber LED text must be drawn at leftX + badgePadX');
assert(exportCode.includes('ctx.fillText(truncateText(ctx, rawNote, maxContentWidth), leftX, noteY);'), 'Note must be drawn at leftX');
assert(exportCode.includes("ctx.fillText('ATUL VERMA PORTFOLIO • ARCHIVAL POLAROID EDITION', leftX, brandmarkY);"), 'Archival brandmark must be drawn at leftX');
console.log('  [PASS] All chin content (Title, LED Badge, Note, Brandmark) strictly left-aligned at leftX = photoMarginX.');

// 3. Functional Unit Test for formatVintageTimestamp
import { formatVintageTimestamp } from '../src/utils/polaroidExport.js';

const testDate = new Date('2026-10-17T10:42:00');
const formatted = formatVintageTimestamp(testDate);
console.log(`\nTesting formatVintageTimestamp output: "${formatted}"`);
assert(formatted.startsWith('ATUL VERMA • 17 OCT 2026'), 'Date part matches 17 OCT 2026');
assert(formatted.includes('10:42 AM') || formatted.includes('10:42 PM'), 'Time part properly formatted with AM/PM');

const alreadyFormatted = 'ATUL VERMA • 17 OCT 2026 10:42 AM';
assert.strictEqual(formatVintageTimestamp(alreadyFormatted), alreadyFormatted, 'Preserves already formatted timestamps');

console.log('  [PASS] formatVintageTimestamp unit tests passed perfectly.');

console.log('\n ALL POLAROID VERIFICATION CHECKS PASSED SUCCESSFULLY! \n');
