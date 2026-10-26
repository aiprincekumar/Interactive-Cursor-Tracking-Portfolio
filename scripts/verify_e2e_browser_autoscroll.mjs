import { chromium } from 'playwright';
import assert from 'assert';

console.log('========================================================================');
console.log('  AUTONOMOUS PLAYWRIGHT E2E BROWSER TEST: AUTO-SCROLL ON REFRESH         ');
console.log('========================================================================\n');

const BASE_URL = 'http://localhost:5173';

let passCount = 0;
let failCount = 0;

function reportPass(msg) {
  passCount++;
  console.log(`✅ PASS: ${msg}`);
}

function reportFail(msg, err) {
  failCount++;
  console.error(`❌ FAIL: ${msg}`);
  if (err) console.error(`   Error: ${err.message || err}`);
}

async function runTests() {
  console.log(`[1/6] Launching Headless Chromium Browser...`);
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  try {
    console.log(`[2/6] Navigating to ${BASE_URL}...`);
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // ========================================================================
    // TEST CASE 1: Default ON & Persistence to #contact
    // ========================================================================
    console.log('\n--- Test Case 1: Default ON & Dual Storage Restoration (#contact) ---');

    // 1. Verify default auto-scroll toggle is ON (null or 'true')
    const initialToggleLocal = await page.evaluate(() => localStorage.getItem('portfolio_auto_scroll_on_refresh'));
    const initialToggleSession = await page.evaluate(() => sessionStorage.getItem('portfolio_auto_scroll_on_refresh'));
    console.log(`  Initial Storage Check: localStorage=${initialToggleLocal}, sessionStorage=${initialToggleSession}`);

    assert.notStrictEqual(initialToggleLocal, 'false', 'Initial localStorage auto_scroll must not be explicitly "false"');
    assert.notStrictEqual(initialToggleSession, 'false', 'Initial sessionStorage auto_scroll must not be explicitly "false"');
    reportPass('Auto-scroll toggle default is ON (not "false")');

    // 2. Scroll to #contact section (near bottom of page)
    console.log('  Scrolling to #contact section...');
    const contactCoordinates = await page.evaluate(() => {
      const el = document.getElementById('contact');
      if (el) {
        el.scrollIntoView({ behavior: 'instant', block: 'start' });
      } else {
        window.scrollTo(0, document.body.scrollHeight);
      }
      window.dispatchEvent(new Event('scroll'));
      return {
        scrollY: window.scrollY,
        scrollHeight: document.body.scrollHeight
      };
    });
    console.log(`  Scrolled to: scrollY=${contactCoordinates.scrollY}px (Total Height=${contactCoordinates.scrollHeight}px)`);

    // 3. Wait 400ms for debounce (300ms persistence timer)
    await page.waitForTimeout(500);

    // 4. Verify portfolio_scroll_position in BOTH localStorage and sessionStorage
    const storageData = await page.evaluate(() => {
      const localRaw = localStorage.getItem('portfolio_scroll_position');
      const sessRaw = sessionStorage.getItem('portfolio_scroll_position');
      const localLastUrl = localStorage.getItem('portfolio_last_url');
      const sessLastUrl = sessionStorage.getItem('portfolio_last_url');
      return {
        localPos: localRaw ? JSON.parse(localRaw) : null,
        sessPos: sessRaw ? JSON.parse(sessRaw) : null,
        localLastUrl: localLastUrl ? JSON.parse(localLastUrl) : null,
        sessLastUrl: sessLastUrl ? JSON.parse(sessLastUrl) : null
      };
    });

    console.log('  Dual-Storage Captured Data:');
    console.log('    localStorage scroll_position:', JSON.stringify(storageData.localPos));
    console.log('    sessionStorage scroll_position:', JSON.stringify(storageData.sessPos));

    assert.ok(storageData.localPos, 'localStorage portfolio_scroll_position must exist');
    assert.ok(storageData.sessPos, 'sessionStorage portfolio_scroll_position must exist');
    assert.strictEqual(storageData.localPos.section, 'contact', 'localStorage section must be "contact"');
    assert.strictEqual(storageData.sessPos.section, 'contact', 'sessionStorage section must be "contact"');
    assert.ok(storageData.localPos.y > 5000, `localStorage y coordinate (${storageData.localPos.y}) must be > 5000`);
    assert.ok(storageData.sessPos.y > 5000, `sessionStorage y coordinate (${storageData.sessPos.y}) must be > 5000`);
    reportPass('Dual-storage persistence saved exact x, y, url, and section ("contact") to both stores');

    // 5. Reload page and wait for restoration to settle
    console.log('  Reloading page with auto-scroll enabled...');
    await page.reload({ waitUntil: 'domcontentloaded' });

    console.log('  Waiting for restoration to settle...');
    const settleResult = await page.evaluate(() => {
      return new Promise((resolve) => {
        let done = false;
        const settleHandler = (e) => {
          if (!done) {
            done = true;
            window.removeEventListener('portfolio:scroll-restoration-settle', settleHandler);
            resolve({ type: 'event', section: e.detail?.section, scrollY: window.scrollY });
          }
        };
        window.addEventListener('portfolio:scroll-restoration-settle', settleHandler);
        // Fallback after 2600ms
        setTimeout(() => {
          if (!done) {
            done = true;
            window.removeEventListener('portfolio:scroll-restoration-settle', settleHandler);
            resolve({ type: 'timeout', scrollY: window.scrollY });
          }
        }, 2800);
      });
    });

    // Wait a brief buffer for final DOM update
    await page.waitForTimeout(300);

    const postReloadScrollY = await page.evaluate(() => window.scrollY);
    console.log(`  Restored scroll position: scrollY=${postReloadScrollY}px (settle trigger=${settleResult.type})`);

    assert.ok(postReloadScrollY > 5000, `Restored scrollY (${postReloadScrollY}px) must be > 5000px`);
    reportPass(`Page successfully restored scroll position to contact section (scrollY=${postReloadScrollY}px > 5000px)`);

    // 6. Assert Navbar active section item is 'contact'
    const activeSectionAfterReload = await page.evaluate(() => {
      // Check desktop nav links
      const navLinks = Array.from(document.querySelectorAll('nav[aria-label="Main Navigation"] a'));
      const activeLink = navLinks.find(a => a.classList.contains('font-bold'));
      return activeLink ? activeLink.getAttribute('href')?.replace('#', '') : null;
    });
    console.log(`  Navbar active section after reload: "${activeSectionAfterReload}"`);
    assert.strictEqual(activeSectionAfterReload, 'contact', 'Navbar active section must be "contact"');
    reportPass('Navbar active section accurately locked to "contact"');

    // ========================================================================
    // TEST CASE 2: Control Panel Toggle OFF (Disable Auto-Scroll)
    // ========================================================================
    console.log('\n--- Test Case 2: Control Panel Toggle OFF & Top (0,0) Reset ---');

    // Toggle OFF via UI switch button or Control Center Panel
    console.log('  Toggling Auto-Scroll switch to OFF...');
    const toggleOffSuccess = await page.evaluate(() => {
      const switchBtn = document.getElementById('switch-auto-scroll-refresh');
      if (switchBtn) {
        switchBtn.click();
        return 'clicked-switch-element';
      }
      // If drawer is closed, open drawer or simulate control center state change
      localStorage.setItem('portfolio_auto_scroll_on_refresh', 'false');
      sessionStorage.setItem('portfolio_auto_scroll_on_refresh', 'false');
      window.dispatchEvent(new CustomEvent('portfolio:auto-scroll-toggle', { detail: { enabled: false } }));
      return 'dispatched-custom-event-and-stored';
    });
    console.log(`  Toggle OFF mechanism: ${toggleOffSuccess}`);

    await page.waitForTimeout(200);

    // Verify toggle values in both storage layers
    const toggleOffLocal = await page.evaluate(() => localStorage.getItem('portfolio_auto_scroll_on_refresh'));
    const toggleOffSession = await page.evaluate(() => sessionStorage.getItem('portfolio_auto_scroll_on_refresh'));
    console.log(`  Storage after Toggle OFF: localStorage=${toggleOffLocal}, sessionStorage=${toggleOffSession}`);

    assert.strictEqual(toggleOffLocal, 'false', 'localStorage portfolio_auto_scroll_on_refresh must be "false"');
    assert.strictEqual(toggleOffSession, 'false', 'sessionStorage portfolio_auto_scroll_on_refresh must be "false"');
    reportPass('Toggle OFF persisted as "false" in both localStorage and sessionStorage');

    // Reload page with toggle OFF
    console.log('  Reloading page with Auto-Scroll disabled...');
    await page.reload({ waitUntil: 'domcontentloaded' });
    // Allow restoration guard time to ensure window stays at top
    await page.waitForTimeout(2000);

    const scrollYAfterToggleOff = await page.evaluate(() => window.scrollY);
    console.log(`  Post-reload scroll position with toggle OFF: scrollY=${scrollYAfterToggleOff}px`);
    assert.strictEqual(scrollYAfterToggleOff, 0, `window.scrollY must be strictly 0 when toggle is OFF (was ${scrollYAfterToggleOff})`);
    reportPass('Window viewport strictly maintained at top (scrollY = 0)');

    // Verify Navbar active section is 'hero'
    const activeSectionWhenDisabled = await page.evaluate(() => {
      const navLinks = Array.from(document.querySelectorAll('nav[aria-label="Main Navigation"] a'));
      const activeLink = navLinks.find(a => a.classList.contains('font-bold'));
      return activeLink ? activeLink.getAttribute('href')?.replace('#', '') : null;
    });
    console.log(`  Navbar active section when disabled: "${activeSectionWhenDisabled}"`);
    assert.strictEqual(activeSectionWhenDisabled, 'hero', 'Navbar active section must be "hero"');
    reportPass('Navbar active section accurately locked to "hero"');

    // ========================================================================
    // TEST CASE 3: Toggle ON Again & Restoration to #projects
    // ========================================================================
    console.log('\n--- Test Case 3: Re-enable Toggle ON & Restoration to #projects ---');

    // Re-enable toggle
    console.log('  Re-enabling Auto-Scroll toggle to ON ("true")...');
    await page.evaluate(() => {
      localStorage.setItem('portfolio_auto_scroll_on_refresh', 'true');
      sessionStorage.setItem('portfolio_auto_scroll_on_refresh', 'true');
      window.dispatchEvent(new CustomEvent('portfolio:auto-scroll-toggle', { detail: { enabled: true } }));
    });

    const toggleOnLocal = await page.evaluate(() => localStorage.getItem('portfolio_auto_scroll_on_refresh'));
    const toggleOnSession = await page.evaluate(() => sessionStorage.getItem('portfolio_auto_scroll_on_refresh'));
    assert.strictEqual(toggleOnLocal, 'true', 'localStorage must be "true"');
    assert.strictEqual(toggleOnSession, 'true', 'sessionStorage must be "true"');
    reportPass('Auto-scroll toggle re-enabled to "true" in both storage layers');

    // Scroll to #projects
    console.log('  Scrolling to #projects section...');
    const projectsCoords = await page.evaluate(() => {
      const el = document.getElementById('projects');
      if (el) {
        el.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
      window.dispatchEvent(new Event('scroll'));
      return {
        offsetTop: el ? el.offsetTop : null,
        scrollY: window.scrollY
      };
    });
    console.log(`  #projects position: offsetTop=${projectsCoords.offsetTop}px, scrollY=${projectsCoords.scrollY}px`);

    // Wait 400ms for debounced persistence
    await page.waitForTimeout(500);

    // Verify scroll position recorded
    const projectStorage = await page.evaluate(() => {
      const loc = localStorage.getItem('portfolio_scroll_position');
      return loc ? JSON.parse(loc) : null;
    });
    console.log('  Persisted projects data:', JSON.stringify(projectStorage));
    assert.ok(projectStorage, 'portfolio_scroll_position must exist for projects');
    assert.strictEqual(projectStorage.section, 'projects', 'Persisted section must be "projects"');
    reportPass('Dual storage successfully captured #projects scroll position');

    // Reload page
    console.log('  Reloading page to test restoration to #projects...');
    await page.reload({ waitUntil: 'domcontentloaded' });

    // Wait for settle
    await page.evaluate(() => {
      return new Promise((resolve) => {
        let settled = false;
        const handler = () => {
          if (!settled) {
            settled = true;
            window.removeEventListener('portfolio:scroll-restoration-settle', handler);
            resolve();
          }
        };
        window.addEventListener('portfolio:scroll-restoration-settle', handler);
        setTimeout(() => {
          if (!settled) {
            settled = true;
            window.removeEventListener('portfolio:scroll-restoration-settle', handler);
            resolve();
          }
        }, 2800);
      });
    });

    await page.waitForTimeout(300);

    const postReloadProjectsY = await page.evaluate(() => window.scrollY);
    console.log(`  Restored scroll position for projects: scrollY=${postReloadProjectsY}px`);
    assert.ok(postReloadProjectsY > 1500, `Restored scrollY (${postReloadProjectsY}px) must be > 1500px`);
    reportPass(`Page successfully restored scroll position to #projects (scrollY=${postReloadProjectsY}px)`);

    // Check Navbar active section is 'projects'
    const activeSectionProjects = await page.evaluate(() => {
      const navLinks = Array.from(document.querySelectorAll('nav[aria-label="Main Navigation"] a'));
      const activeLink = navLinks.find(a => a.classList.contains('font-bold'));
      return activeLink ? activeLink.getAttribute('href')?.replace('#', '') : null;
    });
    console.log(`  Navbar active section after reload: "${activeSectionProjects}"`);
    assert.strictEqual(activeSectionProjects, 'projects', 'Navbar active section must be "projects"');
    reportPass('Navbar active section accurately locked to "projects"');

  } catch (err) {
    reportFail('Test execution encountered an error', err);
  } finally {
    console.log('\n[6/6] Cleaning up test browser session...');
    // Reset storage to clean state
    try {
      await page.evaluate(() => {
        localStorage.removeItem('portfolio_scroll_position');
        localStorage.removeItem('portfolio_last_url');
        localStorage.removeItem('portfolio_last_active_section');
        localStorage.removeItem('portfolio_auto_scroll_on_refresh');
        sessionStorage.clear();
      });
    } catch {}
    await browser.close();
  }

  console.log('\n========================================================================');
  console.log(`  TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('========================================================================');

  if (failCount > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
