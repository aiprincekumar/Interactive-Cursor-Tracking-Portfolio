import { spawn } from 'node:child_process';
import http from 'node:http';

async function test() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const userDataDir = 'C:\\Users\\ATULVE~1\\AppData\\Local\\Temp\\edge-test-' + Date.now();
  const edge = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9225',
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=' + userDataDir,
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  http.get('http://localhost:9225/json', (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', async () => {
      const pages = JSON.parse(data);
      const page = pages.find(p => p.type === 'page');
      const ws = new WebSocket(page.webSocketDebuggerUrl);

      ws.onopen = () => {
        ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));
        ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));
        ws.send(JSON.stringify({
          id: 3,
          method: 'Page.navigate',
          params: { url: 'http://localhost:5173/' }
        }));
      };

      ws.onmessage = async (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.id === 3) {
          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 10,
              method: 'Runtime.evaluate',
              params: {
                expression: `JSON.stringify({
                  scrollY: window.scrollY,
                  hash: window.location.hash,
                  href: window.location.href,
                  lastUrl: localStorage.getItem('portfolio_last_url')
                })`,
                returnByValue: true
              }
            }));
          }, 3500);
        }
        if (msg.id === 10) {
          console.log('PAGE STATE AFTER 3.5 SECONDS:', msg.result.result.value);
          edge.kill();
          process.exit(0);
        }
      };
    });
  });
}
test();
