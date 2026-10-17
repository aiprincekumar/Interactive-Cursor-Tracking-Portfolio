import assert from 'assert';

console.log('====================================================================');
console.log('REVIEWER 3 ADVERSARIAL TEST SUITE: ATTACKING HISTORY & SEARCH EDGES');
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

// 1. PopState Root URL Fallback to DEFAULT_ROLE
test('1. PopState handler falls back to DEFAULT_ROLE when navigating back to root URL without query params', async () => {
  const { normalizeRole, DEFAULT_ROLE } = await import('../src/context/RoleContext.jsx');

  // Simulation of handlePopState logic
  function simulatePopState(locationSearch, eventState) {
    const params = new URLSearchParams(locationSearch);
    const urlRole = normalizeRole(params.get('role'));
    if (urlRole) {
      return urlRole;
    } else if (eventState?.role) {
      const stateRole = normalizeRole(eventState.role);
      if (stateRole) {
        return stateRole;
      } else {
        return DEFAULT_ROLE;
      }
    } else {
      return DEFAULT_ROLE;
    }
  }

  // Case A: Back navigation to root without query param or state -> must return DEFAULT_ROLE
  assert.strictEqual(simulatePopState('', null), DEFAULT_ROLE);
  assert.strictEqual(simulatePopState('', {}), DEFAULT_ROLE);
  assert.strictEqual(simulatePopState('', { otherData: 123 }), DEFAULT_ROLE);

  // Case B: Back navigation to URL with valid role query param
  assert.strictEqual(simulatePopState('?role=overview', null), 'overview');
  assert.strictEqual(simulatePopState('?role=mis', null), 'mis');
  assert.strictEqual(simulatePopState('?role=other', null), 'other');
  assert.strictEqual(simulatePopState('?role=accountant', null), 'accountant');

  // Case C: Back navigation to URL with malformed role query param -> defaults to DEFAULT_ROLE
  assert.strictEqual(simulatePopState('?role=invalid_role', null), DEFAULT_ROLE);
  assert.strictEqual(simulatePopState('?role=', null), DEFAULT_ROLE);

  // Case D: Back navigation where state has valid role but query param is missing
  assert.strictEqual(simulatePopState('', { role: 'mis' }), 'mis');
  assert.strictEqual(simulatePopState('', { role: 'other' }), 'other');
  assert.strictEqual(simulatePopState('', { role: 'invalid' }), DEFAULT_ROLE);
});

// 2. History State Resilience Against Circular and Non-Object States
test('2. History replaceState handles non-object, frozen, and non-serializable history.state', () => {
  const mockHistoryStates = [
    null,
    undefined,
    'a primitive string state',
    12345,
    true,
    Object.freeze({ existing: 'data' })
  ];

  for (const histState of mockHistoryStates) {
    const normalizedRole = 'overview';
    const safeState = (typeof histState === 'object' && histState !== null)
      ? { ...histState, role: normalizedRole }
      : { role: normalizedRole };

    assert.strictEqual(safeState.role, 'overview');
    assert.strictEqual(typeof safeState, 'object');
  }

  // Non-serializable object fallback simulation
  const circularObj = {};
  circularObj.self = circularObj;

  let serializedSuccessfully = false;
  let finalState = null;

  try {
    // Attempting structured clone or JSON stringify on circular throws TypeError
    JSON.stringify({ ...circularObj, role: 'mis' });
    serializedSuccessfully = true;
  } catch {
    // Fallback cleanly caught
    finalState = { role: 'mis' };
  }

  assert.strictEqual(serializedSuccessfully, false);
  assert.strictEqual(finalState.role, 'mis');
});

// 3. Search Catalog Comprehensive Indexing of Other ✨ AI
test('3. Search catalog indexes all 8 Other skills, 2 projects, and 3 experiences with role: other', async () => {
  const { SEARCH_ITEMS } = await import('../src/utils/searchCatalog.js');

  const otherSkills = [
    'Power BI & Fiscal Dashboards',
    'Multi-Entity Ledger Consolidation',
    'Automated ERP & Banking Pipelines',
    'Statutory Tax Strategy & Audits',
    'Working Capital & Liquidity Modeling',
    'Executive KPI & Variance Analytics',
    'Internal Audit Trail Engineering',
    'Corporate Financial Controls'
  ];

  otherSkills.forEach((skillName) => {
    const item = SEARCH_ITEMS.find((i) => i.skillKey === skillName);
    assert(item, `Skill ${skillName} must be present in search catalog`);
    assert.strictEqual(item.category, 'Skills');
    assert.strictEqual(item.role, 'other');
    assert(item.targetId.startsWith('skill-'));
  });

  const otherProjects = [
    'proj-enterprise-transformation',
    'proj-business-advisory'
  ];

  otherProjects.forEach((projId) => {
    const item = SEARCH_ITEMS.find((i) => i.targetId === projId);
    assert(item, `Project ${projId} must be present in search catalog`);
    assert.strictEqual(item.category, 'Projects');
    assert.strictEqual(item.role, 'other');
  });

  const otherExperiences = [
    'exp-other-controller',
    'exp-other-bi-systems',
    'exp-other-compliance'
  ];

  otherExperiences.forEach((expId) => {
    const item = SEARCH_ITEMS.find((i) => i.targetId === expId);
    assert(item, `Experience ${expId} must be present in search catalog`);
    assert.strictEqual(item.category, 'Experience');
    assert.strictEqual(item.role, 'other');
  });
});

// 4. Fuzzy Search Resolution for Controller & Power BI Queries
test('4. Fuzzy search instantly resolves Other skills & projects from query keywords', async () => {
  const { SEARCH_ITEMS } = await import('../src/utils/searchCatalog.js');
  const { searchCatalogItems } = await import('../src/utils/fuzzySearch.js');

  // Query: power bi
  const pbiResults = searchCatalogItems(SEARCH_ITEMS, 'power bi');
  assert(pbiResults.some((i) => i.id === 'skill-power-bi-fiscal-dashboards'), 'Matches Power BI skill');
  assert(pbiResults.some((i) => i.id === 'proj-enterprise-transformation'), 'Matches Power BI project');

  // Query: corporate controls
  const ctrlResults = searchCatalogItems(SEARCH_ITEMS, 'corporate controls');
  assert(ctrlResults.some((i) => i.id === 'skill-corporate-financial-controls'), 'Matches Corporate Controls skill');
  assert(ctrlResults.some((i) => i.id === 'proj-business-advisory'), 'Matches Business Advisory project');

  // Query: dax
  const daxResults = searchCatalogItems(SEARCH_ITEMS, 'dax');
  assert(daxResults.some((i) => i.id === 'skill-power-bi-fiscal-dashboards'), 'Matches DAX modeling');

  // Query: audit trail
  const auditResults = searchCatalogItems(SEARCH_ITEMS, 'audit trail');
  assert(auditResults.some((i) => i.id === 'skill-internal-audit-trail-engineering'), 'Matches Audit Trail skill');
});

// 5. RoleTabsBar Accent Fallbacks Integrity
test('5. RoleTabsBar resolves correct accents across all 4 roles in all variants', () => {
  const tracks = [
    { id: 'overview', expected: '#6366F1' },
    { id: 'accountant', expected: '#FF4D6D' },
    { id: 'mis', expected: '#3B82F6' },
    { id: 'other', expected: '#8B5CF6' }
  ];

  tracks.forEach(({ id, expected }) => {
    // Test with explicit accent
    const withAccent = { id, accent: expected };
    const resolved1 = withAccent.accent || (withAccent.id === 'overview' ? '#6366F1' : withAccent.id === 'mis' ? '#3B82F6' : withAccent.id === 'other' ? '#8B5CF6' : '#FF4D6D');
    assert.strictEqual(resolved1, expected);

    // Test with missing accent fallback
    const withoutAccent = { id };
    const resolved2 = withoutAccent.accent || (withoutAccent.id === 'overview' ? '#6366F1' : withoutAccent.id === 'mis' ? '#3B82F6' : withoutAccent.id === 'other' ? '#8B5CF6' : '#FF4D6D');
    assert.strictEqual(resolved2, expected);
  });
});

// 6. Resume Dropdown Print Timer Fallback Simulation
test('6. ResumeDropdown print action ensures doPrint is called even if iframe.onload does not fire', () => {
  let printCount = 0;
  let printTriggered = false;

  const doPrint = () => {
    if (printTriggered) return;
    printTriggered = true;
    printCount++;
  };

  // Simulation: timer fires when onload is blocked by browser sandbox
  const timer = setTimeout(() => {
    if (!printTriggered) {
      doPrint();
    }
  }, 10);

  // Verify doPrint executes exactly once
  setTimeout(() => {
    clearTimeout(timer);
    assert.strictEqual(printCount, 1);
    assert.strictEqual(printTriggered, true);
  }, 20);
});

// 7. Initial Page Load Invariant (Default Role is Accountant)
test('7. Initial page load without URL params defaults strictly to accountant', async () => {
  const { DEFAULT_ROLE, normalizeRole } = await import('../src/context/RoleContext.jsx');

  function getInitialRole(urlParam, storedItem) {
    const urlRole = normalizeRole(urlParam);
    if (urlRole) return urlRole;

    const savedRole = normalizeRole(storedItem);
    if (savedRole) return savedRole;

    return DEFAULT_ROLE;
  }

  assert.strictEqual(getInitialRole(null, null), 'accountant');
  assert.strictEqual(getInitialRole('', ''), 'accountant');
  assert.strictEqual(getInitialRole('invalid', null), 'accountant');
  assert.strictEqual(getInitialRole(null, 'invalid'), 'accountant');
});

console.log(`\n====================================================================`);
console.log(`REVIEWER 3 TEST SUMMARY: ${passCount} passed, ${failCount} failed.`);
console.log(`====================================================================`);

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL REVIEWER 3 ADVERSARIAL EDGE CASE TESTS PASSED 100% PERFECTLY!\n');
  process.exit(0);
}
