import { spawn } from 'node:child_process';
import http from 'node:http';

async function run() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const userDataDir = 'C:\\Users\\ATULVE~1\\AppData\\Local\\Temp\\edge-scroll-test-' + Date.now();
  const edge = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9223',
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=' + userDataDir,
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  http.get('http://localhost:9223/json', (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', async () => {
      const pages = JSON.parse(data);
      const page = pages.find(p => p.url.includes('about:blank') || p.url.includes('9223') || p.type === 'page');
      if (!page) {
        console.log('Page not found');
        edge.kill();
        return;
      }

      const ws = new WebSocket(page.webSocketDebuggerUrl);
      ws.onopen = async () => {
        ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));
        ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));

        // Inject script BEFORE page loads
        const injection = `
          console.log('[DEBUG_INJECT] Initializing scroll interceptors');

          const origScrollIntoView = Element.prototype.scrollIntoView;
          Element.prototype.scrollIntoView = function(...args) {
            const err = new Error();
            console.log('[SCROLL_INTO_VIEW_CALLED]', this.tagName, this.id, this.className, JSON.stringify(args), err.stack);
            return origScrollIntoView.apply(this, args);
          };

          const origScrollTo = window.scrollTo;
          window.scrollTo = function(...args) {
            const err = new Error();
            console.log('[WINDOW_SCROLLTO_CALLED]', JSON.stringify(args), err.stack);
            return origScrollTo.apply(this, args);
          };

          const origScrollBy = window.scrollBy;
          window.scrollBy = function(...args) {
            const err = new Error();
            console.log('[WINDOW_SCROLLBY_CALLED]', JSON.stringify(args), err.stack);
            return origScrollBy.apply(this, args);
          };

          const origFocus = HTMLElement.prototype.focus;
          HTMLElement.prototype.focus = function(...args) {
            const err = new Error();
            console.log('[FOCUS_CALLED]', this.tagName, this.id, this.className, JSON.stringify(args), err.stack);
            return origFocus.apply(this, args);
          };
        `;

        ws.send(JSON.stringify({
          id: 3,
          method: 'Page.addScriptToEvaluateOnNewDocument',
          params: { source: injection }
        }));

        // Now navigate to http://localhost:5173/
        ws.send(JSON.stringify({
          id: 4,
          method: 'Page.navigate',
          params: { url: 'http://localhost:5173/' }
        }));
      };

      ws.onmessage = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.method === 'Runtime.consoleAPICalled') {
          const text = msg.params.args.map(a => a.value || a.description || JSON.stringify(a)).join(' ');
          console.log('[CONSOLE]', text);
        }
      };

      setTimeout(() => {
        edge.kill();
        process.exit(0);
      }, 5000);
    });
  });
}

run();
