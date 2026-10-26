import { spawn } from 'node:child_process';
import http from 'node:http';

async function testStaleRecovery() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const userDataDir = 'C:\\Users\\ATULVE~1\\AppData\\Local\\Temp\\edge-test-stale-' + Date.now();
  const edge = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9226',
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=' + userDataDir,
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  http.get('http://localhost:9226/json', (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', async () => {
      const pages = JSON.parse(data);
      const page = pages.find(p => p.type === 'page');
      const ws = new WebSocket(page.webSocketDebuggerUrl);

      ws.onopen = () => {
        ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));
        ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));
        // First inject stale localStorage data
        ws.send(JSON.stringify({
          id: 3,
          method: 'Page.navigate',
          params: { url: 'http://localhost:5173/' }
        }));
      };

      ws.onmessage = async (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.id === 3) {
          // Once page loads, deliberately poison localStorage with stale #playground and reload
          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 4,
              method: 'Runtime.evaluate',
              params: {
                expression: `
                  localStorage.setItem('portfolio_last_url', JSON.stringify({ url: '#playground', timestamp: Date.now() }));
                  window.location.hash = '#playground';
                  window.location.reload();
                `
              }
            }));
          }, 1500);
        }
        if (msg.id === 4) {
          // Wait for reload and verify that shield and hooks invalidated #playground and kept page at top
          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 10,
              method: 'Runtime.evaluate',
              params: {
                expression: `JSON.stringify({
                  scrollY: window.scrollY,
                  hash: window.location.hash,
                  lastUrl: localStorage.getItem('portfolio_last_url')
                })`,
                returnByValue: true
              }
            }));
          }, 3500);
        }
        if (msg.id === 10) {
          console.log('STALE RECOVERY STATE AFTER RELOAD:', msg.result.result.value);
          edge.kill();
          process.exit(0);
        }
      };
    });
  });
}
testStaleRecovery();
