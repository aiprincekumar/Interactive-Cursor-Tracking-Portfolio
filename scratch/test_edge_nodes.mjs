import { spawn } from 'child_process';
import os from 'os';
import path from 'path';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const debugPort = 9339;
const userDataDir = path.join(os.tmpdir(), 'edge_cdp_test3_' + Date.now());
const targetUrl = 'http://localhost:5173/Interactive-Cursor-Tracking-Portfolio/';

fs.mkdirSync(userDataDir, { recursive: true });

const edgeProc = spawn(edgePath, [
  `--remote-debugging-port=${debugPort}`,
  '--headless=new',
  '--window-size=1920,1080',
  '--no-sandbox',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
], { stdio: 'ignore' });

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log('Connecting to Edge CDP on port', debugPort);
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

  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
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

  async function evaluate(expression) {
    const res = await sendCommand('Runtime.evaluate', {
      expression,
      returnByValue: true
    });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.text || 'Eval error');
    }
    return res.result ? res.result.value : undefined;
  }

  await sendCommand('Page.enable');
  await sendCommand('Runtime.enable');

  await sendCommand('Page.navigate', { url: targetUrl });

  for (let i = 0; i < 30; i++) {
    const heroExists = await evaluate(`!!document.getElementById('hero')`);
    if (heroExists) break;
    await sleep(300);
  }

  // Instrument Navbar DOM before reload
  await evaluate(`
    localStorage.setItem('portfolio_last_url', JSON.stringify({
      url: '#contact',
      timestamp: Date.now()
    }));
    sessionStorage.setItem('portfolio_last_active_section', 'contact');
    window.location.hash = '#contact';
  `);

  await evaluate(`window.location.reload();`);

  // Check section elements connectivity and tags at t=500ms, 1500ms, 3000ms
  for (const delay of [500, 1500, 3000]) {
    await sleep(delay === 500 ? 500 : 1000);
    const info = await evaluate(`
      (() => {
        const ids = ['hero', 'about', 'skills', 'experience', 'projects', 'achievements', 'testimonials', 'faq', 'contact'];
        const sectionInfo = ids.map(id => {
          const el = document.getElementById(id);
          return {
            id,
            tagName: el ? el.tagName : 'NULL',
            isSkeleton: el ? (el.getAttribute('role') === 'status' || el.className.includes('skeleton')) : false,
            top: el ? Math.round(el.getBoundingClientRect().top) : null,
            isConnected: el ? el.isConnected : false
          };
        });

        const activeNav = Array.from(document.querySelectorAll('nav[aria-label="Main Navigation"] a')).find(a => a.className.includes('scale-[1.02]'));

        return {
          scrollY: Math.round(window.scrollY),
          activeNav: activeNav ? activeNav.textContent.trim() + ' (' + activeNav.getAttribute('href') + ')' : 'none',
          sections: sectionInfo
        };
      })()
    `);
    console.log(`\n--- Telemetry after ${delay}ms ---`);
    console.log(`ScrollY: ${info.scrollY}px | Active Nav: ${info.activeNav}`);
    console.table(info.sections);
  }

  ws.close();
  edgeProc.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch {}
}

run().catch(err => {
  console.error(err);
  edgeProc.kill();
  process.exit(1);
});
