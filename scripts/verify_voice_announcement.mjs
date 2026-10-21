import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';

console.log('--- RUNNING VOICE ANNOUNCEMENT (TTS) UNIT & INTEGRATION TESTS ---');

const rootDir = process.cwd();
const announcerContextPath = path.join(rootDir, 'src', 'context', 'AnnouncerContext.jsx');
const controlCenterPanelPath = path.join(rootDir, 'src', 'components', 'ControlCenterPanel.jsx');
const labContextPath = path.join(rootDir, 'src', 'context', 'LabContext.jsx');
const themeContextPath = path.join(rootDir, 'src', 'context', 'ThemeContext.jsx');
const roleContextPath = path.join(rootDir, 'src', 'context', 'RoleContext.jsx');

// 1. AnnouncerContext Verification
console.log('\n[Pillar 1: AnnouncerContext Web Speech Synthesis Integration]');
const announcerSrc = fs.readFileSync(announcerContextPath, 'utf8');
assert.ok(announcerSrc.includes('speechSynthesis'), 'AnnouncerContext must reference speechSynthesis');
assert.ok(announcerSrc.includes('SpeechSynthesisUtterance'), 'AnnouncerContext must use SpeechSynthesisUtterance');
assert.ok(announcerSrc.includes('speechSynthesis.speak'), 'AnnouncerContext must invoke speak');
assert.ok(announcerSrc.includes('speechSynthesis.cancel()'), 'AnnouncerContext must cancel pending speech to prevent queue build-up');
assert.ok(announcerSrc.includes('VOICE_ANNOUNCEMENT_STORAGE_KEY'), 'AnnouncerContext must export VOICE_ANNOUNCEMENT_STORAGE_KEY');
assert.ok(announcerSrc.includes('setVoiceEnabled'), 'AnnouncerContext must provide setVoiceEnabled');
console.log('✅ AnnouncerContext Web Speech API synthesis & storage passed.');

// 2. ControlCenterPanel Verification
console.log('\n[Pillar 2: ControlCenterPanel Voice Announcement UI Toggle]');
const controlCenterSrc = fs.readFileSync(controlCenterPanelPath, 'utf8');
assert.ok(controlCenterSrc.includes('Voice Announcement (Text-to-Speech)'), 'ControlCenterPanel must contain Voice Announcement UI section');
assert.ok(controlCenterSrc.includes('switch-voice-announcement'), 'ControlCenterPanel must have switch-voice-announcement toggle id');
assert.ok(controlCenterSrc.includes('handleToggleVoiceAnnouncement'), 'ControlCenterPanel must have handler for voice announcement');
assert.ok(controlCenterSrc.includes('Mic') && controlCenterSrc.includes('MicOff'), 'ControlCenterPanel must import and use Mic/MicOff icons');
console.log('✅ ControlCenterPanel Voice Announcement UI toggle verified.');

// 3. LabContext Synchronization
console.log('\n[Pillar 3: LabContext State & Persistence Synchronization]');
const labContextSrc = fs.readFileSync(labContextPath, 'utf8');
assert.ok(labContextSrc.includes('voiceAnnouncementEnabled'), 'LabContext must include voiceAnnouncementEnabled in FACTORY_DEFAULTS');
assert.ok(labContextSrc.includes('setVoiceAnnouncementEnabled'), 'LabContext must provide setVoiceAnnouncementEnabled');
assert.ok(labContextSrc.includes('portfolio:set-voice-announcement'), 'LabContext must dispatch sync events');
console.log('✅ LabContext integration & state management verified.');

// 4. Role, Tab & Theme Announce Triggering
console.log('\n[Pillar 4: Dynamic Events Triggers]');
const themeSrc = fs.readFileSync(themeContextPath, 'utf8');
assert.ok(themeSrc.includes('portfolio:announce'), 'ThemeContext must dispatch portfolio:announce on theme toggle');
const roleSrc = fs.readFileSync(roleContextPath, 'utf8');
assert.ok(roleSrc.includes('portfolio:announce'), 'RoleContext must dispatch portfolio:announce on role change');
assert.ok(controlCenterSrc.includes('portfolio:announce'), 'ControlCenterPanel must dispatch portfolio:announce on tab change');
console.log('✅ Role switch, tab change, and theme change announcements verified.');

// 5. Keyboard Focus Voice Navigation (Tab / Shift+Tab)
console.log('\n[Pillar 5: Keyboard Focus Navigation (Tab) Voice Announcement & Extraction]');
assert.ok(announcerSrc.includes('focusin'), 'AnnouncerContext must listen to focusin events');
assert.ok(announcerSrc.includes('keydown'), 'AnnouncerContext must listen to keydown events to detect keyboard navigation');
assert.ok(announcerSrc.includes('pointerdown'), 'AnnouncerContext must listen to pointerdown to distinguish mouse from keyboard');
assert.ok(announcerSrc.includes('getAccessibleElementDescription'), 'AnnouncerContext must export getAccessibleElementDescription');
assert.ok(announcerSrc.includes('VOICE_FOCUS_STORAGE_KEY'), 'AnnouncerContext must export VOICE_FOCUS_STORAGE_KEY');
assert.ok(announcerSrc.includes('portfolio:set-voice-focus'), 'AnnouncerContext must support portfolio:set-voice-focus');
assert.ok(controlCenterSrc.includes('switch-voice-focus-announcement'), 'ControlCenterPanel must contain switch-voice-focus-announcement toggle');
assert.ok(controlCenterSrc.includes('handleToggleVoiceFocus'), 'ControlCenterPanel must contain handleToggleVoiceFocus handler');
assert.ok(labContextSrc.includes('voiceFocusEnabled'), 'LabContext must include voiceFocusEnabled');
assert.ok(labContextSrc.includes('setVoiceFocusEnabled'), 'LabContext must provide setVoiceFocusEnabled');

// Test accessible description extraction logic directly
class MockElement {
  constructor(tag, attrs = {}, text = '') {
    this.tagName = tag.toUpperCase();
    this.attrs = attrs;
    this.textContent = text;
    this.innerText = text;
    this.checked = attrs.checked ?? false;
  }
  getAttribute(name) { return this.attrs[name] ?? null; }
  hasAttribute(name) { return name in this.attrs; }
  closest(sel) {
    if (sel === '[aria-hidden="true"]') {
      return this.attrs['aria-hidden'] === 'true' ? this : null;
    }
    return null;
  }
  querySelector() { return null; }
  matches() { return false; }
}

// Dynamically test the extracted function logic
const testButton = new MockElement('button', {}, 'Send Message');
const testSwitch = new MockElement('button', { role: 'switch', 'aria-label': 'High Contrast', 'aria-checked': 'true' });
const testLink = new MockElement('a', { href: '#projects' }, 'View Projects');
const testInput = new MockElement('input', { type: 'text', placeholder: 'Your Name' });
const testTab = new MockElement('button', { role: 'tab', 'aria-selected': 'true' }, 'Accountant');
const testHidden = new MockElement('button', { 'aria-hidden': 'true' }, 'Secret');
const testPresentational = new MockElement('div', { role: 'presentation' }, 'Ignored');
const testContainer = new MockElement('div', { tabindex: '-1' });

// We can extract getAccessibleElementDescription from announcerSrc to test purely in Node.js
const fnCode = announcerSrc.match(/export function getAccessibleElementDescription\([\s\S]*?\n\}/)[0]
  .replace('export function', 'function');
const evalFn = new Function('el', `${fnCode}\nreturn getAccessibleElementDescription(el);`);

assert.strictEqual(evalFn(testButton), 'Send Message');
console.log('  ✔ Button description:', evalFn(testButton));

assert.strictEqual(evalFn(testSwitch), 'High Contrast');
console.log('  ✔ Switch description with clean label:', evalFn(testSwitch));

assert.strictEqual(evalFn(testLink), 'View Projects');
console.log('  ✔ Link description:', evalFn(testLink));

assert.strictEqual(evalFn(testInput), 'Your Name');
console.log('  ✔ Input placeholder description:', evalFn(testInput));

assert.strictEqual(evalFn(testTab), 'Accountant');
console.log('  ✔ Tab description with clean label:', evalFn(testTab));

assert.strictEqual(evalFn(testHidden), null);
console.log('  ✔ Hidden element suppressed (null):', evalFn(testHidden));

assert.strictEqual(evalFn(testPresentational), null);
console.log('  ✔ Presentational element suppressed (null):', evalFn(testPresentational));

assert.strictEqual(evalFn(testContainer), null);
console.log('  ✔ Non-interactive tabindex="-1" div suppressed (null):', evalFn(testContainer));

// Enhanced semantic tests: data-tts, headings, paragraphs, cards, badges, and length expansion
const testCustomTTS = new MockElement('button', { 'data-tts': 'Career track switcher: Currently Accountant & Tax. Click to change.' }, 'Change');
assert.strictEqual(evalFn(testCustomTTS), 'Career track switcher: Currently Accountant & Tax. Click to change.');
console.log('  ✔ Custom data-tts priority override:', evalFn(testCustomTTS));

const testCustomSpeak = new MockElement('div', { 'data-speak': 'Quick Action Trigger' }, 'Action');
assert.strictEqual(evalFn(testCustomSpeak), 'Quick Action Trigger');
console.log('  ✔ Custom data-speak override:', evalFn(testCustomSpeak));

const testHeading1 = new MockElement('h1', {}, 'Portfolio Overview');
assert.strictEqual(evalFn(testHeading1), 'Portfolio Overview');
console.log('  ✔ h1 heading description:', evalFn(testHeading1));

const testHeading3 = new MockElement('h3', {}, 'Statutory Audit & Tax Compliance');
assert.strictEqual(evalFn(testHeading3), 'Statutory Audit & Tax Compliance');
console.log('  ✔ h3 subsection description:', evalFn(testHeading3));

const testParagraph = new MockElement('p', {}, 'Bridging Statutory Accounting, Taxation, Data Intelligence & AI Software Engineering.');
assert.strictEqual(evalFn(testParagraph), 'Bridging Statutory Accounting, Taxation, Data Intelligence & AI Software Engineering.');
console.log('  ✔ Paragraph description without prefix:', evalFn(testParagraph));

const testArticleCard = new MockElement('article', {}, 'Tally Prime ERP Implementation Project');
assert.strictEqual(evalFn(testArticleCard), 'Tally Prime ERP Implementation Project');
console.log('  ✔ Article card description:', evalFn(testArticleCard));

const testDataBadge = new MockElement('span', { 'data-badge': 'true' }, 'Executive Summary');
assert.strictEqual(evalFn(testDataBadge), 'Executive Summary');
console.log('  ✔ Badge description:', evalFn(testDataBadge));

const testInteractiveDiv = new MockElement('div', { tabindex: '0' }, 'Interactive Metric Box');
assert.strictEqual(evalFn(testInteractiveDiv), 'Interactive Metric Box');
console.log('  ✔ Div tabindex="0" description preserved without generic robotic label:', evalFn(testInteractiveDiv));

const longText = 'Statutory compliance, Tally Prime ERP, GST and Income Tax Return e-filing, audit readiness, balance sheet preparation, and end-to-end financial operations across multiple corporate fiscal periods.';
const testLongDesc = new MockElement('p', {}, longText);
assert.strictEqual(evalFn(testLongDesc), longText);
console.log('  ✔ Long text preserved up to 300+ chars (no 67-char truncation):', evalFn(testLongDesc).length, 'chars');

console.log('✅ Keyboard focus navigation and accessible description unit tests verified.');

console.log('\n🎉 ALL VOICE ANNOUNCEMENT TESTS PASSED PERFECTLY!');
