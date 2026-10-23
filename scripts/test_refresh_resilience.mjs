import { spawn } from 'node:child_process';
import http from 'node:http';

async function testRefreshResilience() {
  console.log('--- Testing Page Refresh & Delayed Mount Resilience ---');
  const server = spawn('npx', ['vite', 'preview', '--port', '4173'], {
    shell: true,
    stdio: 'pipe'
  });

  await new Promise((r) => setTimeout(r, 1500));

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const userDataDir = `C:\\Users\\ATULVE~1\\AppData\\Local\\Temp\\edge-profile-${Math.random().toString(36).substring(7)}`;
  const edgeProcess = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-sandbox',
    `--user-data-dir=${userDataDir}`,
    'http://localhost:4173/Interactive-Cursor-Tracking-Portfolio/'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  http.get('http://localhost:9222/json', (res) => {
    let data = '';
    res.on('data', (c) => (data += c));
    res.on('end', async () => {
      try {
        const pages = JSON.parse(data);
        const page = pages.find((p) => p.url.includes('4173'));
        if (!page || !page.webSocketDebuggerUrl) {
          console.error('❌ Could not locate portfolio target page');
          cleanup(1);
          return;
        }

        const ws = new globalThis.WebSocket(page.webSocketDebuggerUrl);
        let errorCount = 0;
        const capturedErrors = [];

        ws.onopen = () => {
          ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
          ws.send(JSON.stringify({ id: 2, method: 'Page.enable' }));
        };

        ws.onmessage = (evt) => {
          const msg = JSON.parse(evt.data);
          if (msg.method === 'Runtime.exceptionThrown') {
            errorCount++;
            capturedErrors.push(msg.params.exceptionDetails);
          }
        };

        // Wait 2s for initial load
        await new Promise((r) => setTimeout(r, 2000));

        // Now trigger full browser refresh
        console.log('🔄 Triggering Page.reload (browser refresh)...');
        ws.send(JSON.stringify({ id: 20, method: 'Page.reload', params: { ignoreCache: false } }));

        // Check DOM at 600ms (the previous crash time)
        await new Promise((r) => setTimeout(r, 600));
        ws.send(JSON.stringify({
          id: 21,
          method: 'Runtime.evaluate',
          params: { expression: 'document.getElementById("root")?.children.length || 0' }
        }));

        // Check DOM at 1500ms (after lazy chunks finish loading)
        await new Promise((r) => setTimeout(r, 900));
        ws.send(JSON.stringify({
          id: 22,
          method: 'Runtime.evaluate',
          params: { expression: 'document.getElementById("root")?.innerHTML.length || 0' }
        }));

        // Check DOM at 3000ms (fully settled)
        await new Promise((r) => setTimeout(r, 1500));
        ws.send(JSON.stringify({
          id: 23,
          method: 'Runtime.evaluate',
          params: { expression: 'document.getElementById("root")?.innerHTML.length || 0' }
        }));

        ws.onmessage = (evt) => {
          const msg = JSON.parse(evt.data);
          if (msg.method === 'Runtime.exceptionThrown') {
            errorCount++;
            capturedErrors.push(msg.params.exceptionDetails);
          }
          if (msg.id === 21) {
            console.log(`DOM children count at 600ms post-refresh: ${msg.result?.result?.value}`);
          }
          if (msg.id === 22) {
            console.log(`DOM innerHTML length at 1500ms post-refresh: ${msg.result?.result?.value}`);
          }
          if (msg.id === 23) {
            const len = msg.result?.result?.value || 0;
            console.log(`DOM innerHTML length at 3000ms post-refresh: ${len}`);
            console.log(`Total uncaught exceptions: ${errorCount}`);

            if (errorCount === 0 && len > 50000) {
              console.log('✅ PASS: Page refresh resilience 100% verified with ZERO blank screen crashes!');
              cleanup(0);
            } else {
              console.error('❌ FAIL: Refresh crash detected:', capturedErrors);
              cleanup(1);
            }
          }
        };

        function cleanup(code) {
          try { ws.close(); } catch {}
          try { edgeProcess.kill(); } catch {}
          try { server.kill(); } catch {}
          process.exit(code);
        }

      } catch (err) {
        console.error('Error during test execution:', err);
        process.exit(1);
      }
    });
  }).on('error', (e) => {
    console.error('Connection failed:', e);
    process.exit(1);
  });
}

testRefreshResilience();
