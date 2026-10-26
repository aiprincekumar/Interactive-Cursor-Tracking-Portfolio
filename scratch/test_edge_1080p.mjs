import { spawn } from 'child_process';
import os from 'os';
import path from 'path';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const debugPort = 9336;
const userDataDir = path.join(os.tmpdir(), 'edge_cdp_test2_' + Date.now());
const targetUrl = 'http://localhost:5173/Interactive-Cursor-Tracking-Portfolio/';

fs.mkdirSync(userDataDir, { recursive: true });

const edgeProc = spawn(edgePath, [
  `--remote-debugging-port=${debugPort}`,
  '--headless=new',
  '--window-size=1920,1080',
  '--disable-gpu',
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

  console.log('=== TEST A: Target is #contact ===');
  await evaluate(`
    localStorage.setItem('portfolio_last_url', JSON.stringify({
      url: '#contact',
      timestamp: Date.now()
    }));
    sessionStorage.setItem('portfolio_last_active_section', 'contact');
    window.location.hash = '#contact';
  `);

  await evaluate(`window.location.reload();`);

  for (let t = 200; t <= 3500; t += 300) {
    await sleep(300);
    const telemetry = await evaluate(`
      (() => {
        const navLinks = Array.from(document.querySelectorAll('nav[aria-label="Main Navigation"] a')).map(a => ({
          href: a.getAttribute('href'),
          text: a.textContent.trim(),
          isActive: a.className.includes('scale-[1.02]')
        }));
        const activeItem = navLinks.find(l => l.isActive);

        // Also check section rects
        const contactEl = document.getElementById('contact');
        const contactTop = contactEl ? Math.round(contactEl.getBoundingClientRect().top) : null;
        const projectsEl = document.getElementById('projects');
        const projectsTop = projectsEl ? Math.round(projectsEl.getBoundingClientRect().top) : null;

        return {
          t: ${t},
          scrollY: Math.round(window.scrollY),
          contactTop,
          projectsTop,
          activeNav: activeItem ? activeItem.text + ' (' + activeItem.href + ')' : 'none'
        };
      })()
    `);
    console.log(`[t=${telemetry.t}ms] scrollY=${telemetry.scrollY}px | contactTop=${telemetry.contactTop} | projectsTop=${telemetry.projectsTop} | activeNav="${telemetry.activeNav}"`);
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
