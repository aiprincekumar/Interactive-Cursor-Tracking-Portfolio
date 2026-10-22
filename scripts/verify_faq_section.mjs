import fs from 'fs';
import path from 'path';
import assert from 'assert';
import {
  FAQ_CONFIG,
  FAQ_AUDIENCE_TABS,
  FAQ_ROLE_TABS,
  FAQ_ITEMS,
  filterFAQItems
} from '../src/data/faqConfig.js';

console.log('--- STARTING VERIFICATION OF FAQ SECTION ---');

const faqConfigPath = path.resolve('src/data/faqConfig.js');
const faqSectionPath = path.resolve('src/components/FAQSection.jsx');
const appPath = path.resolve('src/App.jsx');
const navbarPath = path.resolve('src/components/Navbar.jsx');
const translationsPath = path.resolve('src/data/translations.js');

assert(fs.existsSync(faqConfigPath), 'faqConfig.js must exist');
assert(fs.existsSync(faqSectionPath), 'FAQSection.jsx must exist');
assert(fs.existsSync(appPath), 'App.jsx must exist');
assert(fs.existsSync(navbarPath), 'Navbar.jsx must exist');
assert(fs.existsSync(translationsPath), 'translations.js must exist');

const faqSectionContent = fs.readFileSync(faqSectionPath, 'utf-8');
const appContent = fs.readFileSync(appPath, 'utf-8');
const navbarContent = fs.readFileSync(navbarPath, 'utf-8');
const translationsContent = fs.readFileSync(translationsPath, 'utf-8');

let passCount = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passCount++;
  } catch (err) {
    console.error(`❌ FAIL: ${name}`);
    console.error(err.message);
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// 1. faqConfig.js Data Integrity
// ---------------------------------------------------------------------------
test('faqConfig.js exports complete FAQ_CONFIG header metadata', () => {
  assert(FAQ_CONFIG.sectionId === 'faq', 'sectionId must be "faq"');
  assert(FAQ_CONFIG.eyebrowNumber === '09', 'eyebrowNumber must be "09"');
  assert(FAQ_CONFIG.eyebrowText && FAQ_CONFIG.eyebrowText_hi, 'Must have bilingual eyebrow');
  assert(FAQ_CONFIG.titlePrefix && FAQ_CONFIG.titlePrefix_hi, 'Must have bilingual titlePrefix');
  assert(FAQ_CONFIG.titleHighlight && FAQ_CONFIG.titleHighlight_hi, 'Must have bilingual titleHighlight');
  assert(FAQ_CONFIG.subtitle && FAQ_CONFIG.subtitle_hi, 'Must have bilingual subtitle');
});

test('faqConfig.js defines 4 Audience tabs and 4 Role sub-tabs with bilingual metadata', () => {
  assert(Array.isArray(FAQ_AUDIENCE_TABS), 'FAQ_AUDIENCE_TABS must be an array');
  assert(FAQ_AUDIENCE_TABS.length >= 5, 'Must contain all + 4 audience tabs (all, recruiter, client, general, marriage)');
  const audIds = FAQ_AUDIENCE_TABS.map((t) => t.id);
  assert(audIds.includes('all') && audIds.includes('recruiter') && audIds.includes('client') && audIds.includes('general') && audIds.includes('marriage'), 'Missing expected audience tab ID');

  assert(Array.isArray(FAQ_ROLE_TABS), 'FAQ_ROLE_TABS must be an array');
  assert(FAQ_ROLE_TABS.length >= 4, 'Must contain all + 3 primary role tabs (all, accountant, mis, vibe_coding)');
  const roleIds = FAQ_ROLE_TABS.map((r) => r.id);
  assert(roleIds.includes('all') && roleIds.includes('accountant') && roleIds.includes('mis') && roleIds.includes('vibe_coding'), 'Missing expected role tab ID');
});

test('faqConfig.js items have complete bilingual integrity and valid schema', () => {
  assert(Array.isArray(FAQ_ITEMS) && FAQ_ITEMS.length >= 35, `Must have at least 35 authentic FAQ items, got ${FAQ_ITEMS.length}`);

  FAQ_ITEMS.forEach((item, idx) => {
    assert(item.id, `Item ${idx} missing id`);
    assert(typeof item.question === 'string' && item.question.trim().length > 5, `Item ${item.id} missing English question`);
    assert(typeof item.question_hi === 'string' && item.question_hi.trim().length > 5, `Item ${item.id} missing Hindi question`);
    assert(typeof item.answer === 'string' && item.answer.trim().length > 20, `Item ${item.id} missing English answer`);
    assert(typeof item.answer_hi === 'string' && item.answer_hi.trim().length > 20, `Item ${item.id} missing Hindi answer`);
    assert(Array.isArray(item.audience) && item.audience.length > 0, `Item ${item.id} must specify audience array`);
    assert(!item.audience.includes('all'), `Item ${item.id} must NOT include 'all' as default audience tag`);
    assert(Array.isArray(item.role) && item.role.length > 0, `Item ${item.id} must specify role array`);
    assert(item.categoryTag && item.categoryTag_hi, `Item ${item.id} must have bilingual category tags`);

    if (item.actionCTA) {
      const validTypes = ['case_study', 'credentials', 'quote', 'contact', 'ai_chat'];
      assert(validTypes.includes(item.actionCTA.type), `Item ${item.id} has invalid CTA type: ${item.actionCTA.type}`);
      assert(item.actionCTA.label && item.actionCTA.label_hi, `Item ${item.id} CTA missing bilingual label`);
    }
  });
});

test('faqConfig.js covers all 4 audience categories with realistic specialized content', () => {
  const recruiterItems = FAQ_ITEMS.filter((i) => i.audience.includes('recruiter'));
  const clientItems = FAQ_ITEMS.filter((i) => i.audience.includes('client'));
  const generalItems = FAQ_ITEMS.filter((i) => i.audience.includes('general'));
  const marriageItems = FAQ_ITEMS.filter((i) => i.audience.includes('marriage'));

  assert(recruiterItems.length >= 10, `Expected >= 10 recruiter items, got ${recruiterItems.length}`);
  assert(clientItems.length >= 10, `Expected >= 10 client items, got ${clientItems.length}`);
  assert(generalItems.length >= 5, `Expected >= 5 general/polymath items, got ${generalItems.length}`);
  assert(marriageItems.length >= 5, `Expected >= 5 matrimonial items, got ${marriageItems.length}`);
});

test('filterFAQItems correctly handles audience, role, category and search filtering', () => {
  // 1. Level 1 Filter: Audience Filter actively partitions the knowledge base
  const allItems = filterFAQItems({ audience: 'all', role: 'all' });
  assert.strictEqual(allItems.length, FAQ_ITEMS.length, 'All filter must return full catalog');

  const recruiterOnly = filterFAQItems({ audience: 'recruiter', role: 'all' });
  assert(recruiterOnly.length > 0, 'Recruiter filter must return items');
  assert(recruiterOnly.length < FAQ_ITEMS.length, 'Recruiter filter must actively narrow items');
  recruiterOnly.forEach((item) => {
    assert(item.audience.includes('recruiter') || item.audience.includes('all'), `Item ${item.id} must match recruiter`);
  });

  const clientOnly = filterFAQItems({ audience: 'client', role: 'all' });
  assert(clientOnly.length > 0 && clientOnly.length < FAQ_ITEMS.length, 'Client filter must actively narrow items');
  clientOnly.forEach((item) => {
    assert(item.audience.includes('client') || item.audience.includes('all'), `Item ${item.id} must match client`);
  });

  const marriageOnly = filterFAQItems({ audience: 'marriage', role: 'all' });
  assert(marriageOnly.length > 0 && marriageOnly.length < FAQ_ITEMS.length, 'Marriage filter must actively narrow items');
  marriageOnly.forEach((item) => {
    assert(item.audience.includes('marriage') || item.audience.includes('all'), `Item ${item.id} must match marriage`);
  });

  // 2. Level 2 Filter: Role Filter actively partitions the knowledge base
  const accountantOnly = filterFAQItems({ audience: 'all', role: 'accountant' });
  assert(accountantOnly.length > 0, 'Accountant filter must return items');
  assert(accountantOnly.length < FAQ_ITEMS.length, 'Accountant filter must actively narrow items');
  accountantOnly.forEach((item) => {
    assert(item.role.includes('accountant') || item.role.includes('all'), `Item ${item.id} must be an accountant role item`);
  });

  const vibeOnly = filterFAQItems({ audience: 'all', role: 'vibe_coding' });
  assert(vibeOnly.length > 0, 'Vibe coding filter must return items');
  assert(vibeOnly.length < FAQ_ITEMS.length, 'Vibe coding filter must actively narrow items');
  vibeOnly.forEach((item) => {
    assert(item.role.includes('vibe_coding') || item.role.includes('all'), `Item ${item.id} must be a vibe coding role item`);
  });

  const misOnly = filterFAQItems({ audience: 'all', role: 'mis' });
  assert(misOnly.length > 0, 'MIS filter must return items');
  assert(misOnly.length < FAQ_ITEMS.length, 'MIS filter must actively narrow items');
  misOnly.forEach((item) => {
    assert(item.role.includes('mis') || item.role.includes('all'), `Item ${item.id} must be an MIS role item`);
  });

  // 3. Strict Intersection (AND filter)
  const recruiterVibe = filterFAQItems({ audience: 'recruiter', role: 'vibe_coding' });
  assert(recruiterVibe.length > 0, 'Recruiter + Vibe coding must return items');
  assert(recruiterVibe.length < recruiterOnly.length, 'Strict intersection must be smaller than audience alone');
  assert(recruiterVibe.length < vibeOnly.length, 'Strict intersection must be smaller than role alone');
  recruiterVibe.forEach((item) => {
    assert(item.audience.includes('recruiter'), `Item ${item.id} must match recruiter in intersection`);
    assert(item.role.includes('vibe_coding'), `Item ${item.id} must match vibe_coding in intersection`);
  });

  const recruiterAcc = filterFAQItems({ audience: 'recruiter', role: 'accountant' });
  assert(recruiterAcc.length > 0, 'Recruiter + Accountant must return items');
  recruiterAcc.forEach((item) => {
    assert(item.audience.includes('recruiter') && item.role.includes('accountant'), `Item ${item.id} must be recruiter accountant`);
  });

  // Client + MIS now has specialized content (3 items)
  const clientMis = filterFAQItems({ audience: 'client', role: 'mis' });
  assert(clientMis.length >= 3, `Expected Client + MIS to have >= 3 items, got ${clientMis.length}`);
  clientMis.forEach((item) => {
    assert(item.audience.includes('client') && item.role.includes('mis'), `Item ${item.id} must be client MIS`);
  });

  // Empty state verification: unmatched search query produces clean 0 items
  const emptyState = filterFAQItems({ searchQuery: 'nonexistent_impossible_query_xyz_9876' });
  assert.strictEqual(emptyState.length, 0, 'Unmatched search query must produce clean 0 items');

  // 4. Live search query
  const searchGst = filterFAQItems({ searchQuery: 'GST' });
  assert(searchGst.length >= 3, `Expected search "GST" to match multiple items, got ${searchGst.length}`);
});

// ---------------------------------------------------------------------------
// 2. FAQSection.jsx Implementation
// ---------------------------------------------------------------------------
test('FAQSection renders 2-layer tab system (Audience tabs & Role sub-tabs)', () => {
  assert(faqSectionContent.includes('FAQ_AUDIENCE_TABS'), 'Must render FAQ_AUDIENCE_TABS');
  assert(faqSectionContent.includes('FAQ_ROLE_TABS'), 'Must render FAQ_ROLE_TABS');
  assert(faqSectionContent.includes('handleSelectAudience'), 'Must have handleSelectAudience handler');
  assert(faqSectionContent.includes('handleSelectRole'), 'Must have handleSelectRole handler');
  assert(faqSectionContent.includes('role="tablist"'), 'Must have accessible tablist role');
  assert(faqSectionContent.includes('role="tab"'), 'Must have accessible tab role');
});

test('FAQSection implements smart auto-sync with useAudience and useRoleTab', () => {
  assert(faqSectionContent.includes('useAudience'), 'Must import useAudience');
  assert(faqSectionContent.includes('useRoleTab'), 'Must import useRoleTab');
  assert(faqSectionContent.includes('globalAudience'), 'Must track globalAudience');
  assert(faqSectionContent.includes('globalRole'), 'Must track globalRole');
});

test('FAQSection renders live search input and category chips', () => {
  assert(faqSectionContent.includes('searchQuery'), 'Must have searchQuery state');
  assert(faqSectionContent.includes('setSearchQuery'), 'Must have setSearchQuery updater');
  assert(faqSectionContent.includes('availableCategories'), 'Must compute availableCategories');
  assert(faqSectionContent.includes('handleResetFilters'), 'Must have reset filters handler');
});

test('FAQSection implements accessible single-expand accordion with actionable CTAs and audio', () => {
  assert(faqSectionContent.includes('aria-expanded='), 'Must have aria-expanded');
  assert(faqSectionContent.includes('aria-controls='), 'Must have aria-controls');
  assert(faqSectionContent.includes('soundFX'), 'Must integrate soundFX');
  assert(faqSectionContent.includes('portfolio:open-case-study'), 'Must dispatch open-case-study event');
  assert(faqSectionContent.includes('portfolio:open-credential'), 'Must dispatch open-credential event');
  assert(faqSectionContent.includes('portfolio:switch-contact-tab'), 'Must dispatch switch-contact-tab event');
  assert(faqSectionContent.includes('portfolio:open-ai-chat'), 'Must dispatch open-ai-chat event');
});

test('FAQSection renders dynamic telemetry counter reflecting filter counts and search state', () => {
  assert(faqSectionContent.includes('FAQs Available'), 'Must show FAQs Available in counter');
  assert(faqSectionContent.includes('Matches Found'), 'Must show Matches Found when search is active');
  assert(faqSectionContent.includes('FAQ_ITEMS.length'), 'Must reference total FAQ_ITEMS.length');
  assert(faqSectionContent.includes('filteredItems.length'), 'Must reference filteredItems.length');
});

test('FAQSection implements clean empty state with Reset Filters button', () => {
  assert(faqSectionContent.includes('No FAQs match this filter combination.'), 'Must show clean English empty state message');
  assert(faqSectionContent.includes('इस फ़िल्टर संयोजन से कोई प्रश्न मेल नहीं खाता।'), 'Must show clean Hindi empty state message');
  assert(faqSectionContent.includes('data-testid="faq-empty-state"'), 'Must have test id for empty state');
  assert(faqSectionContent.includes('data-testid="faq-reset-filters-btn"'), 'Must have test id for reset button');
  assert(faqSectionContent.includes('Reset Filters'), 'Must have Reset Filters button');
  assert(faqSectionContent.includes('फ़िल्टर रीसेट करें'), 'Must have Hindi Reset Filters button');
});

test('FAQSection injects Schema.org FAQPage JSON-LD structured data', () => {
  assert(faqSectionContent.includes('application/ld+json'), 'Must have ld+json script tag');
  assert(faqSectionContent.includes("'@type': 'FAQPage'"), 'Must declare Schema.org FAQPage');
  assert(faqSectionContent.includes('mainEntity:'), 'Must map questions and answers to mainEntity');
});

// ---------------------------------------------------------------------------
// 3. App.jsx Mount & Navbar Integration
// ---------------------------------------------------------------------------
test('App.jsx mounts FAQSection inside main before ContactSection', () => {
  assert(appContent.includes("import FAQSection from './components/FAQSection'"), 'App.jsx must import FAQSection');
  assert(appContent.includes('<FAQSection />'), 'App.jsx must render <FAQSection />');

  const faqIndex = appContent.indexOf('<FAQSection />');
  const contactIndex = appContent.indexOf('<ContactSection />');
  assert(faqIndex !== -1, '<FAQSection /> must be present');
  assert(contactIndex !== -1, '<ContactSection /> must be present');
  assert(faqIndex < contactIndex, '<FAQSection /> must appear before <ContactSection />');
});

test('Navbar.jsx and translations.js register FAQ in navigation', () => {
  assert(navbarContent.includes("href: '#faq'"), 'Navbar must have #faq nav link');
  assert(navbarContent.includes("'faq'"), 'Navbar scrollspy must include faq section ID');
  assert(translationsContent.includes("'nav.faq': 'FAQ'"), 'translations.js must have English nav.faq');
  assert(translationsContent.includes("'nav.faq': 'FAQ'"), 'translations.js must have Hindi nav.faq');
});

console.log(`\n🎉 ALL ${passCount} FAQ SECTION VERIFICATION CHECKS PASSED SUCCESSFULLY!\n`);
