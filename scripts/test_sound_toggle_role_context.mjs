import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('========================================================================');
console.log('  TEST: SOUND TOGGLE ROLECONTEXT CASCADING RE-RENDER ELIMINATION (PT 14)');
console.log('========================================================================\n');

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

const roleContextPath = path.join(rootDir, 'src/context/RoleContext.jsx');
const code = fs.readFileSync(roleContextPath, 'utf-8');

test('1. RoleContext uses soundEnabledRef to decouple soundEnabled prop', () => {
  assert(code.includes('const soundEnabledRef = useRef(soundEnabled);'), 'soundEnabledRef is initialized with useRef(soundEnabled)');
  assert(code.includes('soundEnabledRef.current = soundEnabled;'), 'soundEnabledRef is updated in useEffect on soundEnabled change');
});

test('2. selectRole reads sound status from soundEnabledRef.current ?? soundFX.isEnabled()', () => {
  assert(
    code.includes('soundEnabledRef.current ?? soundFX.isEnabled()') ||
    code.includes('soundEnabledRef.current !== undefined ? soundEnabledRef.current : soundFX.isEnabled()'),
    'selectRole reads sound status from soundEnabledRef.current with fallback to soundFX.isEnabled()'
  );
});

test('3. selectRole dependency array is strictly empty [] to maintain referential stability', () => {
  const match = code.match(/const selectRole = useCallback\([\s\S]*?\},\s*\[(.*?)\]\);/);
  assert(match, 'selectRole useCallback found');
  const deps = match[1].trim();
  assert.strictEqual(deps, '', 'selectRole dependency array is strictly empty []');
});

test('4. value useMemo only depends on [activeRole, selectRole]', () => {
  const valueMemoIndex = code.indexOf('const value = useMemo(');
  assert(valueMemoIndex !== -1, 'const value = useMemo found');
  const closingDepsIndex = code.indexOf('), [activeRole, selectRole]);', valueMemoIndex);
  assert(closingDepsIndex !== -1, 'value memo strictly closes with [activeRole, selectRole]');
});

test('5. All public exports are 100% preserved', () => {
  const expectedExports = [
    'STORAGE_KEY',
    'DEFAULT_ROLE',
    'OVERVIEW_ROLE',
    'PRIMARY_ROLES',
    'OTHER_ROLE',
    'ROLE_TRACKS',
    'ROLE_DATA',
    'ROLE_TABS',
    'normalizeRole',
    'isValidRole',
    'RoleContext',
    'RoleProvider',
    'useRoleTab',
    'useRole'
  ];

  for (const exp of expectedExports) {
    assert(code.includes(`export const ${exp}`) || code.includes(`export function ${exp}`) || code.includes(`export ${exp}`), `Export ${exp} exists`);
  }
});

test('6. Audio beep, announcements and role change events are preserved', () => {
  assert(code.includes('soundFX.playFocusBeep()'), 'soundFX.playFocusBeep() is called when audio is enabled');
  assert(code.includes("'portfolio-role-change'"), 'portfolio-role-change CustomEvent is dispatched');
  assert(code.includes("'portfolio:announce'"), 'portfolio:announce screen reader announcement is dispatched');
});

console.log('\n========================================================================');
console.log(`TOTAL AUDIT CHECKS: ${passCount + failCount} | PASSED: ${passCount} | FAILED: ${failCount}`);
console.log('========================================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🌟 POINT 14 DECOUPLING VERIFIED WITH 100% REFERENTIAL STABILITY! 🌟\n');
}
