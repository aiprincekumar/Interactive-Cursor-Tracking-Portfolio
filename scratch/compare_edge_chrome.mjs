import { spawn } from 'child_process';
import os from 'os';
import path from 'path';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const targetUrl = 'http://localhost:5173/Interactive-Cursor-Tracking-Portfolio/';

async function testBrowser(name, exePath, port) {
  console.log(`\n======================================================`);
  console.log(` TESTING ${name.toUpperCase()} (Port ${port})`);
  console.log(`======================================================`);

  const userDataDir = path.join(os.tmpdir(), `${name}_test_${Date.now()}`);
  fs.mkdirSync(userDataDir, { recursive: true });

  const proc = spawn(exePath, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    '--window-size=1920,1080',
    '--no-sandbox',
    `--user-data-dir=${userDataDir}`,
    'about:blank'
  ], { stdio: 'ignore' });

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  let targets = null;
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json`);
      targets = await res.json();
      break;
    } catch {
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

  await new Promise(resolve => ws.onopen = resolve);

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

  // Set target to #contact
  await evaluate(`
    localStorage.setItem('portfolio_last_url', JSON.stringify({
      url: '#contact',
      timestamp: Date.now()
    }));
    sessionStorage.setItem('portfolio_last_active_section', 'contact');
    window.location.hash = '#contact';
  `);

  console.log(`[${name}] Reloading page...`);
  await evaluate(`window.location.reload();`);

  const samples = [];
  for (let t = 100; t <= 3000; t += 200) {
    await sleep(200);
    const telemetry = await evaluate(`
      (() => {
        const navLinks = Array.from(document.querySelectorAll('nav[aria-label="Main Navigation"] a')).map(a => ({
          href: a.getAttribute('href'),
          text: a.textContent.trim(),
          isActive: a.className.includes('scale-[1.02]')
        }));
        const activeItem = navLinks.find(l => l.isActive);
        return {
          t: ${t},
          scrollY: Math.round(window.scrollY),
          activeNav: activeItem ? activeItem.text + ' (' + activeItem.href + ')' : 'none',
          activeSection: window.__activeSection || 'unknown'
        };
      })()
    `);
    samples.push(telemetry);
    console.log(`[${name} t=${telemetry.t}ms] scrollY=${telemetry.scrollY}px | activeNav="${telemetry.activeNav}"`);
  }

  ws.close();
  proc.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch {}
  return samples;
}

async function main() {
  await testBrowser('chrome', chromePath, 9337);
  await testBrowser('edge', edgePath, 9338);
}

main().catch(console.error);
