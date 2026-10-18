import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

console.log('🧪 Starting ContactSection & Map Controls Verification Test Suite...');

const contactPath = path.resolve('src/components/ContactSection.jsx');
const searchCatalogPath = path.resolve('src/utils/searchCatalog.js');
const commandPalettePath = path.resolve('src/components/CommandPalette.jsx');

const contactSource = fs.readFileSync(contactPath, 'utf8');
const searchCatalogSource = fs.readFileSync(searchCatalogPath, 'utf8');
const commandPaletteSource = fs.readFileSync(commandPalettePath, 'utf8');

// 1. Tab structure & WAI-ARIA
assert.ok(contactSource.includes('role="tablist"'), 'Must have role="tablist"');
assert.ok(contactSource.includes('role="tab"'), 'Must have role="tab"');
assert.ok(contactSource.includes('role="tabpanel"'), 'Must have role="tabpanel"');
assert.ok(contactSource.includes('aria-orientation="horizontal"'), 'Must specify horizontal orientation');
assert.ok(contactSource.includes('aria-selected={isActive}'), 'Must track aria-selected');
assert.ok(contactSource.includes('aria-controls={`contact-panel-${tab.id}`}'), 'Must have aria-controls matching panel id');
assert.ok(contactSource.includes('id={`contact-tab-${tab.id}`}'), 'Must set tab id');
assert.ok(contactSource.includes('id="contact-panel-touch"'), 'Must have touch tabpanel id');
assert.ok(contactSource.includes('id="contact-panel-direct"'), 'Must have direct tabpanel id');
assert.ok(contactSource.includes('id="contact-panel-location"'), 'Must have location tabpanel id');

// 2. Tab IDs & Badges
assert.ok(contactSource.includes("label: 'Get in Touch'"), 'Must have Get in Touch tab');
assert.ok(contactSource.includes("badge: 'Inquiry Form'"), 'Must have Inquiry Form badge');
assert.ok(contactSource.includes("label: 'Direct Channel'"), 'Must have Direct Channel tab');
assert.ok(contactSource.includes("label: 'Location & Office Map'"), 'Must have Location & Office Map tab');
assert.ok(contactSource.includes("badge: 'Medininagar HQ'"), 'Must have Medininagar HQ badge');

// 3. Audio micro-interactions
assert.ok(contactSource.includes('soundFX.playFocusBeep()'), 'Must call playFocusBeep on tab change');
assert.ok(contactSource.includes('soundFX.playChipHover()'), 'Must call playChipHover on tab hover');
assert.ok(contactSource.includes('soundFX.playPop()'), 'Must call playPop on copy address');
assert.ok(contactSource.includes('soundFX.playSparkle()'), 'Must call playSparkle on copy email / social');

// 4. Keyboard Navigation
assert.ok(contactSource.includes("e.key === 'ArrowRight'"), 'Must handle ArrowRight keyboard nav');
assert.ok(contactSource.includes("e.key === 'ArrowLeft'"), 'Must handle ArrowLeft keyboard nav');
assert.ok(contactSource.includes("e.key === 'Home'"), 'Must handle Home key nav');
assert.ok(contactSource.includes("e.key === 'End'"), 'Must handle End key nav');
assert.ok(contactSource.includes("e.key === 'ArrowDown'"), 'Must handle ArrowDown panel focus');
assert.ok(contactSource.includes("e.key === 'ArrowUp'"), 'Must handle ArrowUp panel to tablist nav');

// 5. Interactive Map Controls
assert.ok(contactSource.includes('zoom >= 18'), 'Must enforce max zoom of 18');
assert.ok(contactSource.includes('zoom <= 11'), 'Must enforce min zoom of 11');
assert.ok(contactSource.includes('setZoom(13)'), 'Must reset zoom to default 13');
assert.ok(contactSource.includes('ZoomIn'), 'Must render ZoomIn icon');
assert.ok(contactSource.includes('ZoomOut'), 'Must render ZoomOut icon');
assert.ok(contactSource.includes('RotateCcw'), 'Must render RotateCcw icon');
assert.ok(contactSource.includes('{zoom}x'), 'Must display zoom indicator badge');

// 6. Map Embed URL & Dimensions
assert.ok(contactSource.includes('https://maps.google.com/maps?q=Daltonganj%2C%20Medininagar%2C%20Palamau%2C%20Jharkhand%20822101&t=&z='), 'Must construct dynamic zoom Google Maps embed URL');
assert.ok(contactSource.includes('min-h-[460px]'), 'Must have responsive map height styling');

// 7. 1-Click Copy Address & Google Maps link
assert.ok(contactSource.includes('copyAddress'), 'Must have copyAddress function');
assert.ok(contactSource.includes('addressCopied'), 'Must have addressCopied state');
assert.ok(contactSource.includes('Copied!'), 'Must show Copied! confirmation text');
assert.ok(contactSource.includes('https://maps.google.com/?q=Daltonganj%2C+Medininagar%2C+Palamau%2C+Jharkhand+822101'), 'Must have external Google Maps view link');

// 8. Event synchronization & CommandPalette deep linking
assert.ok(contactSource.includes('switch-contact-tab'), 'Must listen to switch-contact-tab custom event');
assert.ok(commandPaletteSource.includes('switch-contact-tab'), 'CommandPalette must dispatch switch-contact-tab');
assert.ok(searchCatalogSource.includes('sec-location'), 'searchCatalog must have sec-location catalog item');

console.log('✅ ALL 25 ASSERTIONS PASSED WITH 100% SUCCESS!');
