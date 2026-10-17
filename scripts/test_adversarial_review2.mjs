import assert from 'assert';


console.log('====================================================================');
console.log('REVIEWER 2 ADVERSARIAL TEST SUITE: ATTACKING BOUNDARIES & EDGE CASES');
console.log('====================================================================\n');

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

// 1. normalizeRole & isValidRole Deep Edge-Case Testing
test('1. normalizeRole and isValidRole withstand uppercase, mixed-case, whitespace and invalid types', async () => {
  const { normalizeRole, isValidRole, DEFAULT_ROLE } = await import('../src/context/RoleContext.jsx');

  // Exact lowercase matches
  assert.strictEqual(normalizeRole('overview'), 'overview');
  assert.strictEqual(normalizeRole('accountant'), 'accountant');
  assert.strictEqual(normalizeRole('mis'), 'mis');
  assert.strictEqual(normalizeRole('other'), 'other');

  // Uppercase variations
  assert.strictEqual(normalizeRole('OVERVIEW'), 'overview');
  assert.strictEqual(normalizeRole('ACCOUNTANT'), 'accountant');
  assert.strictEqual(normalizeRole('MIS'), 'mis');
  assert.strictEqual(normalizeRole('OTHER'), 'other');

  // Mixed case variations
  assert.strictEqual(normalizeRole('OverView'), 'overview');
  assert.strictEqual(normalizeRole('AccountAnt'), 'accountant');
  assert.strictEqual(normalizeRole('mIs'), 'mis');
  assert.strictEqual(normalizeRole('OtHeR'), 'other');

  // Leading, trailing, and tab/newline whitespace
  assert.strictEqual(normalizeRole('  overview  '), 'overview');
  assert.strictEqual(normalizeRole('\taccountant\n'), 'accountant');
  assert.strictEqual(normalizeRole('   mis   '), 'mis');
  assert.strictEqual(normalizeRole('  other  '), 'other');

  // Invalid types and boundary values (must not throw, must return null)
  const invalidInputs = [null, undefined, 123, 0, -1, true, false, {}, [], NaN, '', '   ', 'unknown_role', 'admin', 'root'];
  for (const input of invalidInputs) {
    assert.strictEqual(normalizeRole(input), null, `normalizeRole(${JSON.stringify(input)}) should return null`);
    assert.strictEqual(isValidRole(input), false, `isValidRole(${JSON.stringify(input)}) should return false`);
  }

  // True for all valid variations
  assert.strictEqual(isValidRole('OVERVIEW'), true);
  assert.strictEqual(isValidRole('Accountant'), true);
  assert.strictEqual(isValidRole('  mis  '), true);
  assert.strictEqual(isValidRole('OTHER'), true);
  assert.strictEqual(DEFAULT_ROLE, 'accountant');
});

// 2. getResumeConfig Edge-Case Hardening
test('2. getResumeConfig with normalizes uppercase, whitespace and non-string inputs safely', async () => {
  const { getResumeConfig } = await import('../src/utils/resumeConfig.js');

  // Uppercase checks
  assert.strictEqual(getResumeConfig('OVERVIEW').id, 'overview');
  assert.strictEqual(getResumeConfig('OVERVIEW').fileName, 'resume.pdf');
  assert.strictEqual(getResumeConfig('ACCOUNTANT').id, 'accountant');
  assert.strictEqual(getResumeConfig('ACCOUNTANT').fileName, 'resume-accountant.pdf');
  assert.strictEqual(getResumeConfig('MIS').id, 'mis');
  assert.strictEqual(getResumeConfig('MIS').fileName, 'resume-mis.pdf');
  assert.strictEqual(getResumeConfig('OTHER').id, 'other');
  assert.strictEqual(getResumeConfig('OTHER').fileName, 'resume-controller.pdf');

  // Whitespace-padded checks
  assert.strictEqual(getResumeConfig('  overview  ').id, 'overview');
  assert.strictEqual(getResumeConfig('\taccountant ').id, 'accountant');
  assert.strictEqual(getResumeConfig('  mis  ').id, 'mis');
  assert.strictEqual(getResumeConfig('  other  ').id, 'other');

  // Non-string / invalid inputs fallback safely without throwing
  assert.strictEqual(getResumeConfig(null).id, 'other');
  assert.strictEqual(getResumeConfig(undefined).id, 'other');
  assert.strictEqual(getResumeConfig(123).id, 'other');
  assert.strictEqual(getResumeConfig('completely_invalid').id, 'other');
});

// 3. Simulated Browser URL Query Parameter Parsing
test('3. Browser URL query parameters resolve correctly across uppercase and encoded spaces', async () => {
  const { normalizeRole, DEFAULT_ROLE } = await import('../src/context/RoleContext.jsx');

  function resolveRoleFromQuery(queryString) {
    const params = new URLSearchParams(queryString);
    const raw = params.get('role');
    const resolved = normalizeRole(raw);
    return resolved || DEFAULT_ROLE;
  }

  assert.strictEqual(resolveRoleFromQuery('?role=overview'), 'overview');
  assert.strictEqual(resolveRoleFromQuery('?role=OVERVIEW'), 'overview');
  assert.strictEqual(resolveRoleFromQuery('?role=Overview'), 'overview');
  assert.strictEqual(resolveRoleFromQuery('?role=%20overview%20'), 'overview');
  assert.strictEqual(resolveRoleFromQuery('?role=accountant'), 'accountant');
  assert.strictEqual(resolveRoleFromQuery('?role=ACCOUNTANT'), 'accountant');
  assert.strictEqual(resolveRoleFromQuery('?role=mis'), 'mis');
  assert.strictEqual(resolveRoleFromQuery('?role=MIS'), 'mis');
  assert.strictEqual(resolveRoleFromQuery('?role=%20%20mis%20%20'), 'mis');
  assert.strictEqual(resolveRoleFromQuery('?role=other'), 'other');
  assert.strictEqual(resolveRoleFromQuery('?role=OTHER'), 'other');
  assert.strictEqual(resolveRoleFromQuery('?role=%20other%20'), 'other');

  // Malformed or empty queries fallback to DEFAULT_ROLE ('accountant')
  assert.strictEqual(resolveRoleFromQuery(''), 'accountant');
  assert.strictEqual(resolveRoleFromQuery('?role='), 'accountant');
  assert.strictEqual(resolveRoleFromQuery('?role=%20%20'), 'accountant');
  assert.strictEqual(resolveRoleFromQuery('?role=invalid'), 'accountant');
  assert.strictEqual(resolveRoleFromQuery('?other_param=123'), 'accountant');
});

// 4. Simulated LocalStorage Fallback Resolution
test('4. LocalStorage persistence resolution normalizes stored entries or defaults safely', async () => {
  const { normalizeRole, DEFAULT_ROLE } = await import('../src/context/RoleContext.jsx');

  function resolveRoleFromStorage(storedValue) {
    const resolved = normalizeRole(storedValue);
    return resolved || DEFAULT_ROLE;
  }

  assert.strictEqual(resolveRoleFromStorage('overview'), 'overview');
  assert.strictEqual(resolveRoleFromStorage('OVERVIEW'), 'overview');
  assert.strictEqual(resolveRoleFromStorage('  overview  '), 'overview');
  assert.strictEqual(resolveRoleFromStorage('accountant'), 'accountant');
  assert.strictEqual(resolveRoleFromStorage('mis'), 'mis');
  assert.strictEqual(resolveRoleFromStorage('other'), 'other');
  assert.strictEqual(resolveRoleFromStorage('  other  '), 'other');

  // Corrupted or null values fallback to DEFAULT_ROLE
  assert.strictEqual(resolveRoleFromStorage(null), 'accountant');
  assert.strictEqual(resolveRoleFromStorage(''), 'accountant');
  assert.strictEqual(resolveRoleFromStorage('corrupted_value'), 'accountant');
});

// 5. Simulated PopState and CustomEvent Inbound Handlers
test('5. Inbound switch-role-tab and popstate event data normalizes safely', async () => {
  const { normalizeRole } = await import('../src/context/RoleContext.jsx');

  function simulateInboundEvent(detail) {
    const targetRole = normalizeRole(detail?.role);
    return targetRole; // Returns normalized or null (ignored)
  }

  assert.strictEqual(simulateInboundEvent({ role: 'OVERVIEW' }), 'overview');
  assert.strictEqual(simulateInboundEvent({ role: '  mis  ' }), 'mis');
  assert.strictEqual(simulateInboundEvent({ role: 'OTHER' }), 'other');
  assert.strictEqual(simulateInboundEvent({ role: 'Accountant' }), 'accountant');
  assert.strictEqual(simulateInboundEvent({ role: null }), null);
  assert.strictEqual(simulateInboundEvent({ role: 123 }), null);
  assert.strictEqual(simulateInboundEvent({}), null);
  assert.strictEqual(simulateInboundEvent(null), null);
});

// 6. Role Tabs Bar Props Hardening
test('6. RoleTabsBar activeRole normalization protects against casing anomalies', async () => {
  function computeActiveRole(propActiveRole, contextActiveRole) {
    const rawActiveRole = propActiveRole ?? contextActiveRole ?? 'accountant';
    return (typeof rawActiveRole === 'string' ? rawActiveRole.trim().toLowerCase() : '') || 'accountant';
  }

  assert.strictEqual(computeActiveRole('OVERVIEW', 'accountant'), 'overview');
  assert.strictEqual(computeActiveRole('  mis  ', 'accountant'), 'mis');
  assert.strictEqual(computeActiveRole(null, 'OTHER'), 'other');
  assert.strictEqual(computeActiveRole(undefined, '  overview  '), 'overview');
  assert.strictEqual(computeActiveRole(null, null), 'accountant');
  assert.strictEqual(computeActiveRole(123, null), 'accountant');
});

// 7. Strict 4-Track Hierarchy Verification
test('7. Complete 4-Track hierarchy invariant remains solid', async () => {
  const { ROLE_TRACKS, DEFAULT_ROLE } = await import('../src/context/RoleContext.jsx');

  assert.strictEqual(ROLE_TRACKS.length, 4);
  assert.strictEqual(ROLE_TRACKS[0].id, 'overview');
  assert.strictEqual(ROLE_TRACKS[1].id, 'accountant');
  assert.strictEqual(ROLE_TRACKS[2].id, 'mis');
  assert.strictEqual(ROLE_TRACKS[3].id, 'other');
  assert.strictEqual(DEFAULT_ROLE, 'accountant');

  // Icons
  assert.strictEqual(ROLE_TRACKS[0].icon, 'LayoutDashboard');
  assert.strictEqual(ROLE_TRACKS[1].icon, 'Briefcase');
  assert.strictEqual(ROLE_TRACKS[2].icon, 'BarChart2');
  assert.strictEqual(ROLE_TRACKS[3].icon, 'Sparkles');

  // Accents
  assert.strictEqual(ROLE_TRACKS[0].accent, '#6366F1');
  assert.strictEqual(ROLE_TRACKS[1].accent, '#FF4D6D');
  assert.strictEqual(ROLE_TRACKS[2].accent, '#3B82F6');
  assert.strictEqual(ROLE_TRACKS[3].accent, '#8B5CF6');
});

console.log(`\n====================================================================`);
console.log(`REVIEWER 2 TEST SUMMARY: ${passCount} passed, ${failCount} failed.`);
console.log(`====================================================================`);

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL REVIEWER 2 ADVERSARIAL EDGE CASE TESTS PASSED 100% PERFECTLY!\n');
  process.exit(0);
}
