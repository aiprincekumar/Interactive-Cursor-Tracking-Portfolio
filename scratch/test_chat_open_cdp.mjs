import { spawn } from 'child_process';
import os from 'os';
import path from 'path';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const debugPort = 9335;
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
    } catch (e) {
      await sleep(250);
    }
  }

  if (!targets || targets.length === 0) {
    throw new Error('Failed to connect to Chrome CDP');
  }

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
    if (msg.method === 'Runtime.consoleAPICalled') {
      const args = (msg.params.args || []).map(a => a.value || a.description || JSON.stringify(a)).join(' ');
      console.log(`[BROWSER CONSOLE ${msg.params.type.toUpperCase()}]:`, args);
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
    if (res.exceptionDetails) {
      console.error('Eval Exception:', res.exceptionDetails);
    }
    return res.result ? res.result.value : undefined;
  }

  await sendCommand('Page.enable');
  await sendCommand('Runtime.enable');

  console.log('Navigating to:', targetUrl);
  await sendCommand('Page.navigate', { url: targetUrl });
  await sleep(4000);

  console.log('Checking page elements...');
  const initCheck = await evaluate(`
    (function() {
      const hub = document.querySelector('[data-floating-action-hub="true"]');
      const dialog = document.querySelector('[role="dialog"][aria-label="Atul AI Assistant"]');
      return {
        hasHub: !!hub,
        hasDialog: !!dialog,
        errorBoundaryText: document.body.innerText.includes('Something went wrong') ? 'ERROR BOUNDARY TRIGGERED' : 'CLEAN'
      };
    })()
  `);
  console.log('Initial page state:', initCheck);

  // Click Master FAB on FloatingActionHub to expand it
  console.log('Clicking Master FAB on FloatingActionHub...');
  const fabClickResult = await evaluate(`
    (function() {
      const hub = document.querySelector('[data-floating-action-hub="true"]');
      if (!hub) return { error: 'No hub found' };
      const masterBtn = hub.querySelector('button[aria-haspopup="true"]');
      if (!masterBtn) return { error: 'No master button found' };
      masterBtn.click();
      return { success: true };
    })()
  `);
  console.log('FAB Click Result:', fabClickResult);

  await sleep(500);

  // Now find the AI Chat button in FloatingActionHub
  console.log('Finding and clicking AI Chat button in hub...');
  const chatBtnClickResult = await evaluate(`
    (function() {
      const chatBtn = document.querySelector('[data-floating-action-hub="true"] [role="menu"] button[aria-label*="AI Chat"]');
      if (!chatBtn) {
        // Look for any button with AI Chat
        const anyBtn = document.querySelector('button[aria-label*="AI Chat"]');
        if (anyBtn) {
          anyBtn.click();
          return { clickedAny: true, label: anyBtn.getAttribute('aria-label') };
        }
        return { error: 'No chat button found in hub or elsewhere' };
      }
      chatBtn.click();
      return { clickedHubChatBtn: true, label: chatBtn.getAttribute('aria-label') };
    })()
  `);
  console.log('Chat Button Click Result:', chatBtnClickResult);

  await sleep(2000);

  // Check if dialog is open now!
  const dialogCheck = await evaluate(`
    (function() {
      const dialog = document.querySelector('[role="dialog"][aria-label="Atul AI Assistant"]');
      const allDialogs = Array.from(document.querySelectorAll('[role="dialog"]')).map(d => ({
        label: d.getAttribute('aria-label'),
        class: d.className,
        style: d.getAttribute('style')
      }));
      return {
        hasAssistantDialog: !!dialog,
        dialogVisible: dialog ? (dialog.offsetWidth > 0 && dialog.offsetHeight > 0) : false,
        dialogBounds: dialog ? dialog.getBoundingClientRect() : null,
        allDialogs
      };
    })()
  `);
  console.log('Dialog check after clicking chat button:', dialogCheck);

  ws.close();
  chromeProc.kill();
  process.exit(0);
}

run().catch(err => {
  console.error('Error in CDP test:', err);
  try { chromeProc.kill(); } catch {}
  process.exit(1);
});
