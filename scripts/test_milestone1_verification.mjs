import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const catalogUrl = pathToFileURL(path.join(projectRoot, 'src/utils/searchCatalog.js')).href;
const { SEARCH_ITEMS } = await import(catalogUrl);

console.log('=== TEST SUITE 1: CATALOG INTEGRITY & DOM TARGETS ===');
console.log(`Total catalog items: ${SEARCH_ITEMS.length}`);

// 1. Verify schema for all items
const requiredFields = ['id', 'title', 'category', 'targetId', 'badge', 'description', 'keywords'];
const ids = new Set();
let schemaErrors = 0;

SEARCH_ITEMS.forEach((item, index) => {
  for (const field of requiredFields) {
    if (!item[field] || typeof item[field] !== 'string') {
      console.error(`Item [${index}] missing or invalid field "${field}":`, item);
      schemaErrors++;
    }
  }
  if (ids.has(item.id)) {
    console.error(`Duplicate item id: "${item.id}"`);
    schemaErrors++;
  }
  ids.add(item.id);
});

console.log(`Schema check complete: ${schemaErrors} errors`);

// 2. Verify all targetIds exist in DOM components
const targetIds = Array.from(new Set(SEARCH_ITEMS.map(i => i.targetId)));
console.log(`Distinct targetIds across all items (${targetIds.length}):`, targetIds);

const componentsDir = path.join(projectRoot, 'src/components');
const componentFiles = fs.readdirSync(componentsDir).filter(f => f.endsWith('.jsx'));
componentFiles.push('../App.jsx');

const targetIdLocations = {};
targetIds.forEach(tid => { targetIdLocations[tid] = []; });

for (const compFile of componentFiles) {
  const filePath = path.resolve(componentsDir, compFile);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    targetIds.forEach(tid => {
      // Matches id="targetId" or id='targetId'
      const regex = new RegExp(`id=["']${tid}["']`);
      if (regex.test(line)) {
        targetIdLocations[tid].push({
          file: path.basename(filePath),
          line: idx + 1,
          content: line.trim()
        });
      }
    });
  });
}

let missingTargets = 0;
targetIds.forEach(tid => {
  const locs = targetIdLocations[tid];
  if (locs.length === 0) {
    console.error(`❌ TARGET ID NOT FOUND IN ANY COMPONENT: "${tid}"`);
    missingTargets++;
  } else {
    console.log(`✅ Target ID "${tid}": found in ${locs.map(l => `${l.file}:${l.line}`).join(', ')}`);
  }
});

// Also verify which catalog items map to which target
console.log('\nCatalog Item -> Target ID mapping:');
SEARCH_ITEMS.forEach(item => {
  console.log(` - [${item.category}] "${item.title}" -> #${item.targetId}`);
});

console.log(`\nDOM Target verification: ${missingTargets === 0 ? 'PASSED' : 'FAILED'}`);

console.log('\n=== TEST SUITE 2: SEARCH FILTERING ALGORITHM STRESS TESTS ===');

// Replicate filtering logic exactly from CommandPalette.jsx:
// const q = query.trim().toLowerCase();
// if (!q) return SEARCH_ITEMS;
// const tokens = q.split(/\s+/).filter(Boolean);
// return SEARCH_ITEMS.filter((item) => {
//   const searchTarget = `${item.title} ${item.description} ${item.category} ${item.keywords}`.toLowerCase();
//   return tokens.every((token) => searchTarget.includes(token));
// });

function filterCatalog(query) {
  const q = query.trim().toLowerCase();
  if (!q) return SEARCH_ITEMS;
  const tokens = q.split(/\s+/).filter(Boolean);
  return SEARCH_ITEMS.filter((item) => {
    const searchTarget = `${item.title} ${item.description} ${item.category} ${item.keywords}`.toLowerCase();
    return tokens.every((token) => searchTarget.includes(token));
  });
}

const testCases = [
  // Multi-token queries
  { query: 'tally accounting', minExpected: 1, desc: 'Multi-token matching title & keywords' },
  { query: 'gst filing returns', minExpected: 1, desc: 'Multi-token tax filing' },
  { query: 'react frontend 19', minExpected: 1, desc: 'Multi-token title + category + keyword' },
  { query: 'policyguard compliance', minExpected: 1, desc: 'Project name + category/keyword' },
  { query: 'state machine payment', minExpected: 1, desc: 'Multi-token out-of-order tokens' },
  
  // Case insensitivity
  { query: 'TALLY', minExpected: 1, desc: 'All uppercase single token' },
  { query: 'PoLiCyGuArD', minExpected: 1, desc: 'Mixed case' },
  { query: 'ReAcT 19', minExpected: 1, desc: 'Mixed case multi-token' },
  { query: 'GST', minExpected: 2, desc: 'Uppercase GST (skill + section/exp)' },
  
  // Whitespace trimming & padding
  { query: '   ', expectedExact: 27, desc: 'Whitespace only should return all items' },
  { query: '   tally   ', minExpected: 1, desc: 'Leading/trailing whitespace' },
  { query: 'gst     filing', minExpected: 1, desc: 'Multiple internal spaces between tokens' },
  { query: '\t\n  hero  \t', minExpected: 1, desc: 'Tabs, newlines and spaces' },
  
  // Empty query
  { query: '', expectedExact: 27, desc: 'Empty query returns full catalog' },
  
  // Non-matching query (empty state)
  { query: 'nonexistentxyz12345', expectedExact: 0, desc: 'Gibberish returns 0 results' },
  { query: 'react python java tally aws nonesuch', expectedExact: 0, desc: 'Tokens with impossible conjunction returns 0' },
  
  // Special characters & boundary checks
  { query: 'Atulravi2015@gmail.com', minExpected: 1, desc: 'Email address with special characters' },
  { query: 'c / c++', minExpected: 1, desc: 'Slash and plus signs in C/C++' },
  { query: '2.5d', minExpected: 1, desc: 'Dot in 2.5d cursor tracking' },
  { query: 'gstr-1', minExpected: 1, desc: 'Hyphen in tax form' },
  { query: '#hero', expectedExact: 0, desc: 'Hash prefix search (let check if keywords have hash)' }
];

let filterFailures = 0;
testCases.forEach((tc, idx) => {
  const results = filterCatalog(tc.query);
  let passed = true;
  if (tc.expectedExact !== undefined && results.length !== tc.expectedExact) {
    passed = false;
  }
  if (tc.minExpected !== undefined && results.length < tc.minExpected) {
    passed = false;
  }
  if (!passed) {
    console.error(`❌ Test Case ${idx + 1} FAILED [${tc.desc}]: query="${tc.query}", got ${results.length} results`);
    filterFailures++;
  } else {
    console.log(`✅ Test Case ${idx + 1} PASSED [${tc.desc}]: query="${tc.query}" -> ${results.length} results`);
  }
});

console.log(`\nSearch filtering test suite: ${filterFailures === 0 ? 'PASSED' : 'FAILED'}`);

console.log('\n=== TEST SUITE 3: KEYBOARD NAVIGATION & BOUNDARY WRAPPING LOGIC ===');

// Replicate keyboard navigation logic from CommandPalette:
// ArrowDown: setSelectedIndex((prev) => (filteredItems.length === 0 ? 0 : (prev + 1) % filteredItems.length));
// ArrowUp: setSelectedIndex((prev) => (filteredItems.length === 0 ? 0 : (prev - 1 + filteredItems.length) % filteredItems.length));
// activeIndex: filteredItems.length === 0 ? 0 : Math.min(selectedIndex, filteredItems.length - 1);

function testNavStep(len, startIndex, action) {
  if (action === 'ArrowDown') {
    return len === 0 ? 0 : (startIndex + 1) % len;
  }
  if (action === 'ArrowUp') {
    return len === 0 ? 0 : (startIndex - 1 + len) % len;
  }
  return startIndex;
}

let navFailures = 0;
// Test 1: ArrowDown wrapping at end
const endDown = testNavStep(27, 26, 'ArrowDown');
if (endDown !== 0) {
  console.error(`❌ ArrowDown at end (26 of 27) failed: got ${endDown}, expected 0`);
  navFailures++;
} else {
  console.log(`✅ ArrowDown at end wrapped to index 0`);
}

// Test 2: ArrowUp wrapping at start
const startUp = testNavStep(27, 0, 'ArrowUp');
if (startUp !== 26) {
  console.error(`❌ ArrowUp at start (0 of 27) failed: got ${startUp}, expected 26`);
  navFailures++;
} else {
  console.log(`✅ ArrowUp at start wrapped to index 26`);
}

// Test 3: ArrowDown normal step
const normalDown = testNavStep(27, 5, 'ArrowDown');
if (normalDown !== 6) {
  console.error(`❌ ArrowDown normal failed: got ${normalDown}, expected 6`);
  navFailures++;
} else {
  console.log(`✅ ArrowDown from 5 -> 6 passed`);
}

// Test 4: ArrowUp normal step
const normalUp = testNavStep(27, 5, 'ArrowUp');
if (normalUp !== 4) {
  console.error(`❌ ArrowUp normal failed: got ${normalUp}, expected 4`);
  navFailures++;
} else {
  console.log(`✅ ArrowUp from 5 -> 4 passed`);
}

// Test 5: Boundary when list has 1 item
const singleDown = testNavStep(1, 0, 'ArrowDown');
const singleUp = testNavStep(1, 0, 'ArrowUp');
if (singleDown !== 0 || singleUp !== 0) {
  console.error(`❌ Single item list navigation failed: down=${singleDown}, up=${singleUp}`);
  navFailures++;
} else {
  console.log(`✅ Single item list maintains index 0 on ArrowDown & ArrowUp`);
}

// Test 6: Boundary when list has 0 items
const zeroDown = testNavStep(0, 0, 'ArrowDown');
const zeroUp = testNavStep(0, 0, 'ArrowUp');
if (zeroDown !== 0 || zeroUp !== 0) {
  console.error(`❌ Empty list navigation failed: down=${zeroDown}, up=${zeroUp}`);
  navFailures++;
} else {
  console.log(`✅ Empty list safely maintains index 0 on ArrowDown & ArrowUp`);
}

console.log(`\nKeyboard navigation test suite: ${navFailures === 0 ? 'PASSED' : 'FAILED'}`);

const allPassed = schemaErrors === 0 && missingTargets === 0 && filterFailures === 0 && navFailures === 0;
console.log(`\n========================================`);
console.log(`OVERALL EMPIRICAL TEST RESULT: ${allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
console.log(`========================================`);

if (!allPassed) process.exit(1);
