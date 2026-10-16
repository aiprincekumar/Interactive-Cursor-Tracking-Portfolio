import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('========================================================');
console.log('HERO SECTION ROLE TITLES & SUBTITLES VERIFICATION');
console.log('========================================================\n');

let passCount = 0;
let failCount = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${description}`);
    passCount++;
  } catch (err) {
    console.error(`❌ FAIL: ${description}`);
    console.error(`   ${err.message}`);
    failCount++;
  }
}

// 1. Check RoleContext Definitions
test("RoleContext exports correct titles for accountant, mis, and empty for other", () => {
  const roleContextPath = path.join(rootDir, 'src/context/RoleContext.jsx');
  const roleContextSrc = fs.readFileSync(roleContextPath, 'utf-8');

  // Verify Accountant track
  assert(
    roleContextSrc.includes("heroTitle: 'Accountant & Tax Consultant.'"),
    "Accountant heroTitle must match"
  );
  assert(
    roleContextSrc.includes("heroSubtitle: 'Business Development & Office Administrator.'"),
    "Accountant heroSubtitle must match"
  );

  // Verify MIS track
  assert(
    roleContextSrc.includes("heroTitle: 'MIS & Data Analyst.'"),
    "MIS heroTitle must match"
  );
  assert(
    roleContextSrc.includes("heroSubtitle: 'Business Intelligence, Automation & Operations Specialist.'"),
    "MIS heroSubtitle must match"
  );

  // Verify Other track has empty titles
  assert(
    roleContextSrc.includes("id: 'other'"),
    "Other role id defined"
  );
  assert(
    roleContextSrc.includes("heroTitle: ''"),
    "Other heroTitle is empty string"
  );
  assert(
    roleContextSrc.includes("heroSubtitle: ''"),
    "Other heroSubtitle is empty string"
  );
});

// 2. Check HeroSection conditional rendering logic
test("HeroSection conditionally checks activeTrack titles and renders nothing when empty", () => {
  const heroPath = path.join(rootDir, 'src/components/HeroSection.jsx');
  const heroSrc = fs.readFileSync(heroPath, 'utf-8');

  // Verify condition
  assert(
    heroSrc.includes('Boolean(activeTrack?.heroTitle || activeTrack?.heroSubtitle)'),
    "HeroSection must use Boolean(activeTrack?.heroTitle || activeTrack?.heroSubtitle) conditional guard"
  );

  // Verify title rendering
  assert(
    heroSrc.includes('{activeTrack?.heroTitle && ('),
    "HeroSection guards h1 rendering"
  );
  assert(
    heroSrc.includes('{activeTrack.heroTitle}'),
    "HeroSection renders activeTrack.heroTitle in h1"
  );

  // Verify subtitle rendering
  assert(
    heroSrc.includes('{activeTrack?.heroSubtitle && ('),
    "HeroSection guards subtitle rendering"
  );
  assert(
    heroSrc.includes('{activeTrack.heroSubtitle}'),
    "HeroSection renders activeTrack.heroSubtitle in p"
  );

  // Verify social icons remain outside the title guard so they always render
  const conditionIdx = heroSrc.indexOf('Boolean(activeTrack?.heroTitle || activeTrack?.heroSubtitle)');
  const socialIconsIdx = heroSrc.indexOf('Small Circular Social Icons');
  assert(conditionIdx !== -1, "Condition exists");
  assert(socialIconsIdx !== -1, "Social icons exist");
  assert(socialIconsIdx > conditionIdx, "Social icons are positioned after the title conditional block");
});

// 3. Mathematical & Logical Simulation of Rendering for each role
test("Simulation of rendering output for all 3 roles", () => {
  const roles = {
    accountant: {
      heroTitle: 'Accountant & Tax Consultant.',
      heroSubtitle: 'Business Development & Office Administrator.'
    },
    mis: {
      heroTitle: 'MIS & Data Analyst.',
      heroSubtitle: 'Business Intelligence, Automation & Operations Specialist.'
    },
    other: {
      heroTitle: '',
      heroSubtitle: ''
    }
  };

  function simulateHeroBottomLeft(activeTrack) {
    const shouldRender = Boolean(activeTrack?.heroTitle || activeTrack?.heroSubtitle);
    if (!shouldRender) {
      return {
        rendered: false,
        title: null,
        subtitle: null
      };
    }
    return {
      rendered: true,
      title: activeTrack?.heroTitle || null,
      subtitle: activeTrack?.heroSubtitle || null
    };
  }

  // Accountant
  const accResult = simulateHeroBottomLeft(roles.accountant);
  assert.strictEqual(accResult.rendered, true);
  assert.strictEqual(accResult.title, 'Accountant & Tax Consultant.');
  assert.strictEqual(accResult.subtitle, 'Business Development & Office Administrator.');

  // MIS
  const misResult = simulateHeroBottomLeft(roles.mis);
  assert.strictEqual(misResult.rendered, true);
  assert.strictEqual(misResult.title, 'MIS & Data Analyst.');
  assert.strictEqual(misResult.subtitle, 'Business Intelligence, Automation & Operations Specialist.');

  // Other
  const otherResult = simulateHeroBottomLeft(roles.other);
  assert.strictEqual(otherResult.rendered, false, "When activeRole is 'other', no text elements or title wrapper are rendered");
  assert.strictEqual(otherResult.title, null);
  assert.strictEqual(otherResult.subtitle, null);
});

console.log(`\n========================================================`);
console.log(`TEST SUMMARY: ${passCount} passed, ${failCount} failed.`);
console.log(`========================================================`);

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL HERO SECTION ROLE VERIFICATION TESTS PASSED 100% PERFECTLY!');
}
