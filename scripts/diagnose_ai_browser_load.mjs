import { chromium } from 'playwright';

async function diagnose() {
  console.log('🚀 Launching Chromium browser to diagnose AI Model loading...');
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--enable-features=SharedArrayBuffer',
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  const logs = [];
  page.on('console', msg => {
    const text = `[BROWSER CONSOLE] [${msg.type()}] ${msg.text()}`;
    logs.push(text);
    console.log(text);
  });

  page.on('pageerror', err => {
    const text = `[PAGE ERROR] ${err.stack || err.message}`;
    logs.push(text);
    console.error(text);
  });

  page.on('requestfailed', req => {
    console.log(`[REQUEST FAILED] ${req.url()} - ${req.failure()?.errorText}`);
  });

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // Check deviceProfile and activeModel in page context
  const evalResult = await page.evaluate(async () => {
    // Check localStorage
    const storedSettings = localStorage.getItem('portfolio_ai_chat_settings');
    const storedAiState = localStorage.getItem('portfolio_ai_model_cache');
    return {
      storedSettings,
      storedAiState,
      userAgent: navigator.userAgent,
      hardwareConcurrency: navigator.hardwareConcurrency,
      hasWebGPU: !!navigator.gpu
    };
  });
  console.log('Initial Evaluated State:', JSON.stringify(evalResult, null, 2));

  // Open Chat Widget
  console.log('Looking for Chat trigger button...');
  // Check floating hub or chat toggle button
  const chatButtons = await page.$$('button[aria-label*="chat" i], button[title*="chat" i], [data-chat-toggle]');
  console.log(`Found ${chatButtons.length} potential chat buttons`);
  
  // Or evaluate opening chat directly or click #btn-open-chat / floating hub
  await page.evaluate(() => {
    const hubBtn = document.querySelector('button[aria-label*="Assistant" i]') || 
                   document.querySelector('button[title*="Chat" i]') ||
                   document.querySelector('button[aria-label*="Chat" i]');
    if (hubBtn) {
      console.log('Clicking chat button in DOM:', hubBtn.outerHTML.slice(0, 100));
      hubBtn.click();
    } else {
      console.log('Chat button not found by querySelector');
    }
  });

  await page.waitForTimeout(2000);

  // Take screenshot of chat widget
  await page.screenshot({ path: 'vibe_coding_temp/chat_debug.png' });
  console.log('Saved screenshot to vibe_coding_temp/chat_debug.png');

  // Inspect chat DOM
  const chatDom = await page.evaluate(() => {
    const widget = document.querySelector('#ai-chat-station') || document.querySelector('[role="dialog"]');
    if (!widget) return { found: false };
    
    const subheader = widget.querySelector('nav') || widget.querySelector('.overflow-x-auto');
    const buttons = Array.from(widget.querySelectorAll('button')).map(b => ({
      title: b.getAttribute('title'),
      ariaLabel: b.getAttribute('aria-label'),
      text: b.innerText.slice(0, 50)
    }));

    return {
      found: true,
      buttonCount: buttons.length,
      buttons: buttons.slice(0, 15)
    };
  });
  console.log('Chat DOM inspection:', JSON.stringify(chatDom, null, 2));

  // Click AI Model decision tree button or trigger /model
  console.log('Triggering AI Model Decision Tree...');
  await page.evaluate(() => {
    // Find the 🤖 button in the sub-header
    const botBtn = Array.from(document.querySelectorAll('button')).find(b => 
      b.getAttribute('title')?.includes('मॉडल') || 
      b.getAttribute('title')?.includes('Model')
    );
    if (botBtn) {
      console.log('Found model button, clicking:', botBtn.title);
      botBtn.click();
    } else {
      console.log('Model button not found in sub-header!');
    }
  });

  await page.waitForTimeout(2000);

  // Check what decision tree options are rendered in DOM
  const decisionTreeOptions = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('[data-decision-card], button')).filter(el => 
      el.innerText?.includes('SmolLM') || el.innerText?.includes('Qwen') || el.innerText?.includes('मॉडल')
    );
    return cards.map(c => c.innerText.replace(/\n+/g, ' '));
  });
  console.log('Decision tree cards found:', decisionTreeOptions);

  // Check what happens if we click the SmolLM button
  console.log('Attempting to click SmolLM button...');
  await page.evaluate(() => {
    const smolCard = Array.from(document.querySelectorAll('button')).find(el => 
      el.innerText?.includes('SmolLM')
    );
    if (smolCard) {
      console.log('Found SmolLM card, clicking:', smolCard.innerText.slice(0, 80));
      smolCard.click();
    } else {
      console.log('SmolLM card NOT found!');
    }
  });

  console.log('Waiting 10 seconds to observe download / worker logs...');
  await page.waitForTimeout(10000);

  await browser.close();
  console.log('Diagnosis finished.');
}

diagnose().catch(err => {
  console.error('Diagnosis script failed:', err);
  process.exit(1);
});
