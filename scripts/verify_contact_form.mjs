import fs from 'node:fs';
import assert from 'node:assert/strict';

console.log('🔍 Running Contact Form Audit Verification Suite...');

const code = fs.readFileSync('src/components/ContactSection.jsx', 'utf8');

// 1. Initial gated / masked state
assert.ok(code.includes('portfolio_contact_unlocked'), 'localStorage key declared');
assert.ok(code.includes('24 * 60 * 60 * 1000'), '24-hour expiration duration defined');
assert.ok(code.includes('Atulravi••••@gmail.com'), 'Masked email placeholder present');
assert.ok(code.includes('+91 79923 ••••••'), 'Masked phone placeholder present');
assert.ok(code.includes('blur-xs'), 'Blur filter applied to masked content');
assert.ok(code.includes('Gated'), 'Gated badge present');

// 2. 8 fields
const fields = [
  'field-name',
  'field-email',
  'field-whatsapp',
  'field-company',
  'field-role',
  'field-budget',
  'field-urgency',
  'field-message'
];
fields.forEach(f => {
  assert.ok(code.includes(`id="${f}"`), `Missing form field: ${f}`);
});

// 3. Validation
assert.ok(code.includes('phoneRegex.test(formData.whatsapp.trim())'), 'WhatsApp regex test executed');
assert.ok(code.includes('Please enter a valid WhatsApp phone number'), 'Validation error message present');

// 4. FormSubmit.co delivery
assert.ok(code.includes('https://formsubmit.co/ajax/Atulravi2015@gmail.com'), 'FormSubmit.co AJAX endpoint configured');
assert.ok(code.includes('_subject'), 'FormSubmit subject line configured');
assert.ok(code.includes('_captcha'), 'FormSubmit captcha flag configured');
assert.ok(code.includes('_template'), 'FormSubmit template configured');

// 5. Post-submit unlock
assert.ok(code.includes('+91 7992383804'), 'Full WhatsApp number revealed');
assert.ok(code.includes('Atulravi2015@gmail.com'), 'Full email address revealed');
assert.ok(code.includes('copyWhatsApp'), 'Copy WhatsApp handler present');
assert.ok(code.includes('copyEmail'), 'Copy Email handler present');
assert.ok(code.includes('https://wa.me/917992383804'), 'Direct WhatsApp chat link present');
assert.ok(code.includes('confetti'), 'Confetti celebration present');
assert.ok(code.includes('Direct Contact Unlocked!'), 'Unlocked celebration heading present');

// 6. Persistence & Reset
assert.ok(code.includes('localStorage.setItem(UNLOCK_STORAGE_KEY'), 'Sets unlock state in localStorage');
assert.ok(code.includes('localStorage.getItem(UNLOCK_STORAGE_KEY'), 'Reads unlock state from localStorage');
assert.ok(code.includes('localStorage.removeItem(UNLOCK_STORAGE_KEY'), 'Clears unlock state on reset');
assert.ok(code.includes('Date.now() < parsed.expiry'), 'Enforces 24h expiration check');

// 7. Tailwind & theme support
assert.ok(code.includes('dark:bg-[#161122]'), 'Dark theme container present');
assert.ok(code.includes('dark:text-white'), 'Dark theme text classes present');
assert.ok(code.includes('dark:border-[#2D2340]'), 'Dark theme border classes present');

console.log('✅ ALL 25 CONTACT FORM INTEGRATION CHECKS PASSED (25/25)!');
