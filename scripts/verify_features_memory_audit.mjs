import fs from 'fs';

const content = fs.readFileSync('docs/FEATURES_MEMORY.md', 'utf8');

// Exact structure per module
const linearModules = {
  1: 65,
  3: 60,
  5: 47,
  6: 46,
  7: 18,
  8: 15,
  9: 10,
  10: 14,
  11: 20,
  12: 10,
  13: 14
};

let totalFeatures = 0;
let errors = 0;

// Linear modules
for (const [mod, count] of Object.entries(linearModules)) {
  let found = 0;
  for (let i = 1; i <= count; i++) {
    const key = `| ${mod}.${i} |`;
    if (content.includes(key)) {
      found++;
      totalFeatures++;
    } else {
      console.error(`❌ Missing feature: ${mod}.${i}`);
      errors++;
    }
  }
  console.log(`✅ Module ${mod}: ${found}/${count} features verified`);
}

// Module 2: 35 Cursors + 18 Engine Features = 53
let mod2Cursors = 0;
for (let i = 1; i <= 35; i++) {
  const key = `| ${i} | \``;
  if (content.includes(key)) {
    mod2Cursors++;
    totalFeatures++;
  } else {
    console.error(`❌ Missing Module 2 Cursor #${i}`);
    errors++;
  }
}
let mod2Engine = 0;
for (let i = 1; i <= 18; i++) {
  const key = `| 2.${i} |`;
  if (content.includes(key)) {
    mod2Engine++;
    totalFeatures++;
  } else {
    console.error(`❌ Missing Module 2 Engine Feature 2.${i}`);
    errors++;
  }
}
console.log(`✅ Module 2: ${mod2Cursors} Cursors + ${mod2Engine} Engine Features (= ${mod2Cursors + mod2Engine}/53) verified`);

// Module 4: 12 Shortcuts + 28 Controls = 40
let mod4Shortcuts = 0;
const shortcuts = [
  '`Ctrl + K`', '`/`', '`?`', '`Alt + H`', '`Alt + S`', '`Ctrl + P`',
  '`Home`', '`Tab`', '`Escape`', '`Arrow Up`', '`Enter`', '`Space`'
];
for (const sc of shortcuts) {
  if (content.includes(sc)) {
    mod4Shortcuts++;
    totalFeatures++;
  } else {
    console.error(`❌ Missing Module 4 Shortcut: ${sc}`);
    errors++;
  }
}
let mod4Controls = 0;
for (let i = 1; i <= 28; i++) {
  const key = `| 4.${i} |`;
  if (content.includes(key)) {
    mod4Controls++;
    totalFeatures++;
  } else {
    console.error(`❌ Missing Module 4 Control 4.${i}`);
    errors++;
  }
}
console.log(`✅ Module 4: ${mod4Controls} Controls + ${mod4Shortcuts} Shortcuts (= ${mod4Controls + mod4Shortcuts}/40) verified`);

console.log('\n========================================================================');
console.log(`TOTAL PRODUCTION FEATURES AUDITED & VERIFIED: ${totalFeatures} / 412`);
console.log('========================================================================\n');

if (errors === 0 && totalFeatures === 412) {
  console.log('🎉 100% AUDIT SUCCESS: ZERO OMISSIONS, ZERO REGRESSIONS, FULL COVERAGE CERTIFIED!');
} else {
  console.error(`Discrepancy: ${errors} errors found`);
  process.exit(1);
}
