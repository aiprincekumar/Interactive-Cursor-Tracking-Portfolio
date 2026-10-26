import { spawn } from 'child_process';
import os from 'os';
import path from 'path';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const debugPort = 9336;
const userDataDir = path.join(os.tmpdir(), 'chrome_cdp_mobile_test_' + Date.now());
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
    if (msg.method === 'Runtime.consoleAPICalled') {
      const args = (msg.params.args || []).map(a => a.value || a.description || JSON.stringify(a)).join(' ');
      if (msg.params.type === 'error') console.log(`[BROWSER ERROR]:`, args);
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      console.error('[BROWSER EXCEPTION]:', msg.params.exceptionDetails?.exception?.description || msg.params.exceptionDetails?.text);
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
    return res.result ? res.result.value : undefined;
  }

  await sendCommand('Page.enable');
  await sendCommand('Runtime.enable');
  await sendCommand('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 667,
    deviceScaleFactor: 2,
    mobile: true
  });

  console.log('Navigating to mobile view:', targetUrl);
  await sendCommand('Page.navigate', { url: targetUrl });
  await sleep(4000);

  // Trigger chat open event
  console.log('Dispatching open-ai-chat event in mobile view...');
  await evaluate(`window.dispatchEvent(new CustomEvent('portfolio:open-ai-chat'))`);
  await sleep(1000);

  const check = await evaluate(`
    (function() {
      const dialog = document.querySelector('[role="dialog"][aria-label="Atul AI Assistant"]');
      return {
        hasDialog: !!dialog,
        class: dialog ? dialog.className : null,
        style: dialog ? dialog.getAttribute('style') : null
      };
    })()
  `);
  console.log('Mobile Dialog check:', check);

  ws.close();
  chromeProc.kill();
  process.exit(0);
}

run().catch(err => {
  console.error('Error in mobile CDP test:', err);
  try { chromeProc.kill(); } catch {}
  process.exit(1);
});
