import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('========================================================');
console.log('CODING ACHIEVEMENTS DYNAMIC SECTION VERIFICATION SUITE');
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

const achievementsPath = path.join(rootDir, 'src/components/CodingAchievementsSection.jsx');
const content = fs.readFileSync(achievementsPath, 'utf-8');

// 1. Hook and Context integration (Zero RoleEmptyState)
test('Imports and utilizes useRoleTab from RoleContext and eliminates RoleEmptyState', () => {
  assert(content.includes("import { useRoleTab } from '../context/RoleContext';"), 'useRoleTab imported from context');
  assert(!content.includes('RoleEmptyState'), 'RoleEmptyState eliminated');
  assert(content.includes("const { isAccountant, isMIS, isOther } = useRoleTab();"), 'Extracts isAccountant, isMIS, and isOther');
});

// 2. Dynamic state switching
test('Switches stats and ticker arrays dynamically based on active role', () => {
  assert(content.includes("const activeStats = isOther ? OTHER_STATS : isMIS ? MIS_STATS : ACCOUNTANT_STATS;"), 'Switches stats array dynamically');
  assert(content.includes("const activeTickerItems = isOther ? OTHER_TICKER_ITEMS : isMIS ? MIS_TICKER_ITEMS : ACCOUNTANT_TICKER_ITEMS;"), 'Switches ticker items array dynamically');
});

// 3. Accountant metrics verification
test('Accountant role defines required metrics (7+ Years, 500+, 99.8%, 0, 100%)', () => {
  // Aggregate badge
  assert(content.includes("'Statutory Tax Practice'"), 'Aggregate badge label for accountant');
  assert(content.includes("'7+ Years Verified'"), 'Aggregate badge stat for accountant');
  
  // Ticker items
  assert(content.includes("'7+ Years Tally Accounting'"), '7+ Years Tally in ticker');
  assert(content.includes("'7+ Years GST & Tax Filing'"), '7+ Years GST in ticker');
  assert(content.includes("'500+ Tax Returns Processed'"), '500+ Tax returns in ticker');
  
  // Stats cards
  const accountantStatsDef = content.slice(content.indexOf('ACCOUNTANT_STATS = ['), content.indexOf('];', content.indexOf('ACCOUNTANT_STATS = [')));
  assert(accountantStatsDef.includes("stat: '99.8%'"), 'Stat 99.8% trust present');
  assert(accountantStatsDef.includes("label: 'Long-Term Advisory Trust'"), 'Label Long-Term Advisory Trust present');
  assert(accountantStatsDef.includes("stat: '0'"), 'Stat 0 penalties present');
  assert(accountantStatsDef.includes("label: 'Penalty & Notice Incidence'"), 'Label Penalty & Notice Incidence present');
  assert(accountantStatsDef.includes("stat: '500+'"), 'Stat 500+ returns present');
  assert(accountantStatsDef.includes("label: 'Cumulative Returns Reconciled'"), 'Label Cumulative Returns Reconciled present');
  assert(accountantStatsDef.includes("stat: '100%'"), 'Stat 100% audit rate present');
  assert(accountantStatsDef.includes("label: 'Double-Entry Reconciliation Rate'"), 'Label Double-Entry Reconciliation Rate present');
});

// 4. MIS metrics verification
test('MIS role defines required metrics (5+ Years Verified, 10,000+ records, 5+ years experience, 100+ reports, 99.5% integrity)', () => {
  // Aggregate badge
  assert(content.includes("'Data & Operations Analytics'"), 'Aggregate badge label for MIS');
  assert(content.includes("'5+ Years Verified'"), 'Aggregate badge stat for MIS');

  // Stats cards
  const misStatsDef = content.slice(content.indexOf('MIS_STATS = ['), content.indexOf('];', content.indexOf('MIS_STATS = [')));
  assert(misStatsDef.includes("stat: '10,000+'"), 'Stat 10,000+ records present');
  assert(misStatsDef.includes("label: 'Records Analyzed'"), 'Label Records Analyzed present');
  assert(misStatsDef.includes("stat: '5+ Years'"), 'Stat 5+ Years experience present');
  assert(misStatsDef.includes("label: 'MIS Experience'"), 'Label MIS Experience present');
  assert(misStatsDef.includes("stat: '100+'"), 'Stat 100+ reports present');
  assert(misStatsDef.includes("label: 'Automated Reports Generated'"), 'Label Automated Reports Generated present');
  assert(misStatsDef.includes("stat: '99.5%'"), 'Stat 99.5% integrity present');
  assert(misStatsDef.includes("label: 'Data Integrity Rate'"), 'Label Data Integrity Rate present');

  // Ticker items
  assert(content.includes("'10,000+ Records Analyzed'"), '10,000+ records in MIS ticker');
  assert(content.includes("'5+ Years MIS Experience'"), '5+ Years MIS Experience in ticker');
  assert(content.includes("'100+ Automated Reports Generated'"), '100+ reports in MIS ticker');
  assert(content.includes("'99.5% Data Integrity Rate'"), '99.5% integrity in MIS ticker');
});

// 5. Other role native metrics verification
test('Other role defines native metrics (100% Governance, 15+ Engagements, 99.5% Delivery, 7+ Years Experience), ticker, and bottom banner', () => {
  // Stats cards
  const otherStatsDef = content.slice(content.indexOf('OTHER_STATS = ['), content.indexOf('];', content.indexOf('OTHER_STATS = [')));
  assert(otherStatsDef.includes("stat: '100%'"), 'Stat 100% governance present');
  assert(otherStatsDef.includes("stat: '15+'"), 'Stat 15+ engagements present');
  assert(otherStatsDef.includes("stat: '99.5%'"), 'Stat 99.5% execution present');
  assert(otherStatsDef.includes("stat: '7+ Years'"), 'Stat 7+ Years present');

  // Ticker items
  assert(content.includes("'7+ Years Multidisciplinary Leadership'"), 'Leadership ticker present');
  assert(content.includes("'Executive Operations & Governance'"), 'Governance ticker present');

  // Aggregate badge & bottom banner
  assert(content.includes("'Multidisciplinary Professional'"), 'Multidisciplinary Professional badge label');
  assert(content.includes('MULTIDISCIPLINARY LEADERSHIP'), 'Multidisciplinary Leadership banner title');
  assert(content.includes('Multidisciplinary Lead'), 'Multidisciplinary Lead pill badge');
});

console.log('\n========================================================');
console.log(`TEST SUMMARY: ${passCount} passed, ${failCount} failed.`);
console.log('========================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL ACHIEVEMENTS DYNAMIC SECTION TESTS PASSED 100% PERFECTLY!\n');
}
