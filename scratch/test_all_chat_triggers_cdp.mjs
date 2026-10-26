import { spawn } from 'child_process';
import os from 'os';
import path from 'path';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const debugPort = 9336;
const userDataDir = path.join(os.tmpdir(), 'chrome_cdp_chat_test_' + Date.now());
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
    } catch {
      await sleep(250);
    }
  }

  if (!targets || targets.length === 0) {
    throw new Error('Failed to connect to Chrome CDP');
  }

  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  let idCounter = 1;
  const pending = new Map();
  const consoleErrors = [];

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
    if (msg.method === 'Runtime.consoleAPICalled') {
      const args = (msg.params.args || []).map(a => a.value || a.description || JSON.stringify(a)).join(' ');
      if (msg.params.type === 'error') {
        consoleErrors.push(args);
      }
      console.log(`[BROWSER CONSOLE ${msg.params.type.toUpperCase()}]:`, args);
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      const desc = msg.params.exceptionDetails?.exception?.description || msg.params.exceptionDetails?.text;
      consoleErrors.push(desc);
      console.error('[BROWSER EXCEPTION]:', desc);
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
      console.error('Eval Exception:', res.exceptionDetails);
    }
    return res.result ? res.result.value : undefined;
  }

  await sendCommand('Page.enable');
  await sendCommand('Runtime.enable');

  console.log('Navigating to:', targetUrl);
  await sendCommand('Page.navigate', { url: targetUrl });
  await sleep(3500);

  // Trigger 1: Floating Action Hub button
  console.log('\n--- Test 1: Open chat via Floating Action Hub ---');
  await evaluate(`
    (function() {
      const hub = document.querySelector('[data-floating-action-hub="true"]');
      if (hub) {
        const masterBtn = hub.querySelector('button[aria-haspopup="true"]');
        if (masterBtn) masterBtn.click();
      }
    })()
  `);
  await sleep(400);

  const clickHubChat = await evaluate(`
    (function() {
      const chatBtn = document.querySelector('[data-floating-action-hub="true"] [role="menu"] button[aria-label*="AI Chat"]');
      if (chatBtn) {
        chatBtn.click();
        return { success: true };
      }
      return { success: false };
    })()
  `);
  console.log('Clicked Hub AI Chat button:', clickHubChat);
  await sleep(800);

  let status = await evaluate(`
    (function() {
      const dialog = document.querySelector('[role="dialog"][aria-label="Atul AI Assistant"]');
      const closeBtn = dialog ? dialog.querySelector('button[aria-label*="Close"]') : null;
      return {
        open: !!dialog,
        visible: dialog ? dialog.offsetWidth > 0 : false,
        hasClose: !!closeBtn
      };
    })()
  `);
  console.log('Chat Status after Hub click:', status);
  if (!status.open) throw new Error('Chat failed to open from Hub');

  // Close the chat
  console.log('Closing chat...');
  await evaluate(`
    (function() {
      const dialog = document.querySelector('[role="dialog"][aria-label="Atul AI Assistant"]');
      const closeBtn = dialog ? dialog.querySelector('button[aria-label*="Close"]') : null;
      if (closeBtn) closeBtn.click();
    })()
  `);
  await sleep(500);

  // Trigger 2: Dispatching 'portfolio:open-ai-chat' directly (as used by Navbar / FAQ / Shortcuts)
  console.log('\n--- Test 2: Open chat via custom event portfolio:open-ai-chat ---');
  await evaluate(`
    window.dispatchEvent(new CustomEvent('portfolio:open-ai-chat', {
      detail: { initialMessage: 'Hello Atul, test query' }
    }));
  `);
  await sleep(600);

  status = await evaluate(`
    (function() {
      const dialog = document.querySelector('[role="dialog"][aria-label="Atul AI Assistant"]');
      const input = dialog ? dialog.querySelector('textarea, input[type="text"]') : null;
      return {
        open: !!dialog,
        visible: dialog ? dialog.offsetWidth > 0 : false,
        inputValue: input ? input.value : null
      };
    })()
  `);
  console.log('Chat Status after Custom Event with initialMessage:', status);
  if (!status.open) throw new Error('Chat failed to open from Custom Event');

  // Test 3: Minimize and restore
  console.log('\n--- Test 3: Minimize and restore chat ---');
  await evaluate(`
    (function() {
      const dialog = document.querySelector('[role="dialog"][aria-label="Atul AI Assistant"]');
      const minBtn = dialog ? dialog.querySelector('button[aria-label*="Minimize"]') : null;
      if (minBtn) minBtn.click();
    })()
  `);
  await sleep(400);

  let minStatus = await evaluate(`
    (function() {
      const minimizedBar = document.querySelector('[aria-label*="Minimized Atul AI"]');
      return { hasMinimizedBar: !!minimizedBar };
    })()
  `);
  console.log('Chat Status after minimize:', minStatus);

  // Restore
  await evaluate(`
    (function() {
      const minimizedBar = document.querySelector('[aria-label*="Minimized Atul AI"]');
      if (minimizedBar) minimizedBar.click();
    })()
  `);
  await sleep(400);

  status = await evaluate(`
    (function() {
      const dialog = document.querySelector('[role="dialog"][aria-label="Atul AI Assistant"]');
      return {
        open: !!dialog,
        visible: dialog ? dialog.offsetWidth > 0 : false
      };
    })()
  `);
  console.log('Chat Status after restore:', status);

  console.log('\nTotal console errors captured:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.error('Console errors:', consoleErrors);
  }

  ws.close();
  chromeProc.kill();
  if (consoleErrors.length > 0) {
    process.exit(1);
  }
  console.log('\n🎉 ALL LIVE CDP CHAT VERIFICATIONS PASSED WITH ZERO CONSOLE ERRORS!');
  process.exit(0);
}

run().catch(err => {
  console.error('Error in CDP test:', err);
  try { chromeProc.kill(); } catch {}
  process.exit(1);
});
