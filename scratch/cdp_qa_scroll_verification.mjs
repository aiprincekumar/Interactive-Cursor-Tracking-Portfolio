import { spawn } from 'child_process';
import os from 'os';
import path from 'path';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const debugPort = 9334;
const userDataDir = path.join(os.tmpdir(), 'chrome_cdp_test_' + Date.now());
const targetUrl = 'http://localhost:5173/Interactive-Cursor-Tracking-Portfolio/';

fs.mkdirSync(userDataDir, { recursive: true });

const chromeProc = spawn(chromePath, [
  `--remote-debugging-port=${debugPort}`,
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
], { stdio: 'ignore' });

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log('Connecting to Chrome CDP on port', debugPort);
  let targets = null;
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${debugPort}/json`);
      targets = await res.json();
      break;
    } catch (e) {
      await sleep(250);
    }
  }

  if (!targets || targets.length === 0) {
    throw new Error('Failed to connect to Chrome CDP');
  }

  // Find page target
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  console.log('Chrome CDP target acquired:', pageTarget.title, pageTarget.webSocketDebuggerUrl);

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  let idCounter = 1;
  const pending = new Map();

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  };

  await new Promise((resolve) => ws.onopen = resolve);

  function sendCommand(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      pending.set(id, (msg) => {
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async function evaluate(expression, awaitPromise = false) {
    const res = await sendCommand('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise
    });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.text || 'Eval error');
    }
    return res.result ? res.result.value : undefined;
  }

  await sendCommand('Page.enable');
  await sendCommand('Runtime.enable');

  console.log('\nNavigating to:', targetUrl);
  await sendCommand('Page.navigate', { url: targetUrl });

  // Wait for React to mount and render
  console.log('Waiting for React app to mount...');
  let mounted = false;
  for (let i = 0; i < 30; i++) {
    const heroExists = await evaluate(`!!document.getElementById('hero')`);
    if (heroExists) {
      mounted = true;
      break;
    }
    await sleep(300);
  }

  if (!mounted) {
    const htmlSnippet = await evaluate(`document.body.innerHTML.slice(0, 500)`);
    console.error('Failed to mount React app. Body snippet:', htmlSnippet);
    throw new Error('React app did not mount');
  }
  console.log('✅ React app mounted successfully! Document elements detected.');

  console.log('\n=============================================================');
  console.log(' TEST 1: FRESH LOAD (EMPTY SESSIONSTORAGE) -> ZERO AUTO-SCROLL');
  console.log('=============================================================');

  // Clear sessionStorage and reset to top
  await evaluate(`
    sessionStorage.clear();
    window.scrollTo(0, 0);
  `);
  await sleep(300);

  // Reload page
  await evaluate(`window.location.reload();`);
  console.log('Page reloaded, waiting for settle (3000ms)...');
  await sleep(3000);

  const freshScrollY = await evaluate(`window.scrollY || window.pageYOffset || 0`);
  const freshHash = await evaluate(`window.location.hash`);
  const freshStored = await evaluate(`sessionStorage.getItem('portfolio_last_active_section')`);

  console.log(`Fresh Load Results:`);
  console.log(` - scrollY: ${freshScrollY}px (Expected: 0)`);
  console.log(` - location.hash: "${freshHash}" (Expected: "" or "#hero")`);
  console.log(` - sessionStorage: "${freshStored}" (Expected: null or "hero")`);

  const test1Passed = freshScrollY === 0;
  if (test1Passed) {
    console.log('✅ TEST 1 PASSED: Page stays strictly at 0px (Hero section) with zero auto-scroll!');
  } else {
    console.error(`❌ TEST 1 FAILED: Unexpected scroll jump to ${freshScrollY}px!`);
  }

  console.log('\n=============================================================');
  console.log(' TEST 2: STORED SECTION (PROJECTS) -> SMOOTH RESTORATION');
  console.log('=============================================================');

  await evaluate(`sessionStorage.setItem('portfolio_last_active_section', 'projects');`);
  const checkSet = await evaluate(`sessionStorage.getItem('portfolio_last_active_section')`);
  console.log(`Set sessionStorage: ${checkSet}`);

  await evaluate(`window.location.reload();`);
  console.log('Page reloaded with projects in sessionStorage, waiting 3500ms for lazy chunks & smooth scroll...');
  await sleep(3500);

  const restoredProjectsScrollY = await evaluate(`window.scrollY || window.pageYOffset || 0`);
  const restoredProjectsHash = await evaluate(`window.location.hash`);
  const restoredProjectsStored = await evaluate(`sessionStorage.getItem('portfolio_last_active_section')`);
  const projectsTop = await evaluate(`
    (() => {
      const el = document.getElementById('projects');
      return el ? Math.round(el.getBoundingClientRect().top) : null;
    })()
  `);

  console.log(`Restoration Results for 'projects':`);
  console.log(` - scrollY: ${restoredProjectsScrollY}px (> 0)`);
  console.log(` - projects rect.top: ${projectsTop}px (Near 0 or header offset)`);
  console.log(` - location.hash: "${restoredProjectsHash}" (Expected: "#projects")`);
  console.log(` - sessionStorage: "${restoredProjectsStored}" (Expected: "projects")`);

  const test2Passed = restoredProjectsScrollY > 200 && projectsTop !== null && Math.abs(projectsTop) < 300 && restoredProjectsHash === '#projects';
  if (test2Passed) {
    console.log('✅ TEST 2 PASSED: Successfully and smoothly restored to projects section!');
  } else {
    console.error(`❌ TEST 2 FAILED: Restoration check failed for projects!`);
  }

  console.log('\n=============================================================');
  console.log(' TEST 3: STORED SECTION (SKILLS) -> SMOOTH RESTORATION');
  console.log('=============================================================');

  await evaluate(`sessionStorage.setItem('portfolio_last_active_section', 'skills');`);
  await evaluate(`window.location.reload();`);
  console.log('Page reloaded with skills in sessionStorage, waiting 3500ms...');
  await sleep(3500);

  const restoredSkillsScrollY = await evaluate(`window.scrollY || window.pageYOffset || 0`);
  const restoredSkillsHash = await evaluate(`window.location.hash`);
  const restoredSkillsStored = await evaluate(`sessionStorage.getItem('portfolio_last_active_section')`);
  const skillsTop = await evaluate(`
    (() => {
      const el = document.getElementById('skills');
      return el ? Math.round(el.getBoundingClientRect().top) : null;
    })()
  `);

  console.log(`Restoration Results for 'skills':`);
  console.log(` - scrollY: ${restoredSkillsScrollY}px (> 0)`);
  console.log(` - skills rect.top: ${skillsTop}px (Near 0 or header offset)`);
  console.log(` - location.hash: "${restoredSkillsHash}" (Expected: "#skills")`);
  console.log(` - sessionStorage: "${restoredSkillsStored}" (Expected: "skills")`);

  const test3Passed = restoredSkillsScrollY > 100 && skillsTop !== null && Math.abs(skillsTop) < 300 && restoredSkillsHash === '#skills';
  if (test3Passed) {
    console.log('✅ TEST 3 PASSED: Successfully and smoothly restored to skills section!');
  } else {
    console.error(`❌ TEST 3 FAILED: Restoration check failed for skills!`);
  }

  console.log('\n=============================================================');
  console.log(' TEST 4: DYNAMIC SCROLL HASH & SESSIONSTORAGE SYNCHRONIZATION');
  console.log('=============================================================');

  // Scroll to experience section
  await evaluate(`
    (() => {
      const el = document.getElementById('experience');
      if (el) {
        el.scrollIntoView({ behavior: 'instant', block: 'start' });
        window.dispatchEvent(new Event('scroll'));
      }
    })()
  `);
  await sleep(1000);

  const expHash = await evaluate(`window.location.hash`);
  const expStored = await evaluate(`sessionStorage.getItem('portfolio_last_active_section')`);
  console.log(`Scrolled down to Experience:`);
  console.log(` - location.hash: "${expHash}"`);
  console.log(` - sessionStorage: "${expStored}"`);

  // Now scroll all the way back up to 0 (Hero)
  await evaluate(`
    (() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      window.dispatchEvent(new Event('scroll'));
    })()
  `);
  await sleep(1000);

  const heroScrollY = await evaluate(`window.scrollY || 0`);
  const heroHash = await evaluate(`window.location.hash`);
  const heroStored = await evaluate(`sessionStorage.getItem('portfolio_last_active_section')`);
  console.log(`Scrolled back to Top (Hero):`);
  console.log(` - scrollY: ${heroScrollY}px`);
  console.log(` - location.hash: "${heroHash}" (Expected: "")`);
  console.log(` - sessionStorage: "${heroStored}" (Expected: "hero")`);

  const test4Passed = heroScrollY === 0 && (heroStored === 'hero' || !heroStored) && (heroHash === '' || heroHash === '#hero');
  if (test4Passed) {
    console.log('✅ TEST 4 PASSED: Dynamic scroll hash and sessionStorage remain 100% synchronized!');
  } else {
    console.error(`❌ TEST 4 FAILED: Inconsistency in scroll synchronization!`);
  }

  ws.close();
  chromeProc.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch {}

  console.log('\n=============================================================');
  console.log(` SUMMARY REPORT:`);
  console.log(`  - Test 1 (Fresh Load / 0px Hero): ${test1Passed ? 'PASSED ✅' : 'FAILED ❌'}`);
  console.log(`  - Test 2 (Restoration - Projects): ${test2Passed ? 'PASSED ✅' : 'FAILED ❌'}`);
  console.log(`  - Test 3 (Restoration - Skills):   ${test3Passed ? 'PASSED ✅' : 'FAILED ❌'}`);
  console.log(`  - Test 4 (Hash & Storage Sync):   ${test4Passed ? 'PASSED ✅' : 'FAILED ❌'}`);
  console.log('=============================================================');

  if (!test1Passed || !test2Passed || !test3Passed || !test4Passed) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Fatal error:', err);
  chromeProc.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch {}
  process.exit(1);
});
