import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('--- STARTING VERIFICATION OF AI CHAT BUTTON & WIDGET ---');

const widgetPath = path.resolve('src/components/AIChatWidget.jsx');
const exploreBarPath = path.resolve('src/components/ExploreSubBar.jsx');
const hubPath = path.resolve('src/components/FloatingActionHub.jsx');
const appPath = path.resolve('src/App.jsx');
const bttPath = path.resolve('src/components/BackToTopButton.jsx');

assert(fs.existsSync(widgetPath), 'AIChatWidget.jsx must exist');
assert(fs.existsSync(exploreBarPath), 'ExploreSubBar.jsx must exist');
assert(fs.existsSync(hubPath), 'FloatingActionHub.jsx must exist');
assert(fs.existsSync(appPath), 'App.jsx must exist');
assert(fs.existsSync(bttPath), 'BackToTopButton.jsx must exist');

const widgetContent = fs.readFileSync(widgetPath, 'utf-8');
const exploreBarContent = fs.readFileSync(exploreBarPath, 'utf-8');
const hubContent = fs.readFileSync(hubPath, 'utf-8');
const appContent = fs.readFileSync(appPath, 'utf-8');
const bttContent = fs.readFileSync(bttPath, 'utf-8');

let passCount = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passCount++;
  } catch (err) {
    console.error(`❌ FAIL: ${name}`);
    console.error(err.message);
    process.exit(1);
  }
}

// 1. AIChatWidget checks
test('AIChatWidget renders docked station container flush to bottom-0 with appropriate z-index and border radius', () => {
  assert(widgetContent.includes('fixed bottom-0 z-[55]'), 'Must have fixed bottom-0 z-[55]');
  assert(widgetContent.includes('backdrop-blur-md'), 'Must have backdrop-blur-md');
  assert(widgetContent.includes('shadow-2xl'), 'Must have shadow-2xl');
  assert(widgetContent.includes('rounded-t-2xl rounded-b-none border-t border-x border-b-0'), 'Must have docked rounded-t-2xl rounded-b-none border-t border-x border-b-0');
  assert(widgetContent.includes("isDrawerOpen ? 'sm:right-[540px]' : 'sm:right-28'"), 'Must have drawer offset glide at 540px with right-28 clearance');
  assert(widgetContent.includes('sm:max-w-[calc(100vw-560px)]'), 'Must have tablet safeguard max-width constraint');
  assert(widgetContent.includes('window.innerWidth < 960'), 'Must have tablet auto-minimize safeguard below 960px');
  assert(widgetContent.includes('h-[500px] max-h-[82vh]'), 'Must have height h-[500px] max-h-[82vh]');
});

test('AIChatWidget contains avatar with glowing pulsing badge & BotMessageSquare icon and docked status', () => {
  assert(widgetContent.includes('BotMessageSquare'), 'Must use BotMessageSquare icon');
  assert(widgetContent.includes('animate-ping'), 'Must have pulsing dot');
  assert(widgetContent.includes('Atul AI Assistant'), 'Header must have Atul AI Assistant title');
  assert(widgetContent.includes('Copilot Ready'), 'Header must have Copilot Ready status');
});

test('AIChatWidget header contains minimize/maximize and close buttons with docked tab styling', () => {
  assert(widgetContent.includes('handleToggleMinimize'), 'Must have toggle minimize handler');
  assert(widgetContent.includes('handleClose'), 'Must have close handler');
  assert(widgetContent.includes('h-13 rounded-t-xl rounded-b-none border-t border-x border-b-0'), 'Must have docked minimized tab styling');
});

test('AIChatWidget displays welcome message and 4 suggested prompt chips', () => {
  assert(widgetContent.includes("Hi there! 👋 I am Atul's AI Assistant preview"), 'Must include welcome message');
  assert(widgetContent.includes('🚀 Featured Projects'), 'Must include Projects chip');
  assert(widgetContent.includes('💻 Core Tech Stack'), 'Must include Tech Stack chip');
  assert(widgetContent.includes('💼 Experience Summary'), 'Must include Experience chip');
  assert(widgetContent.includes('📬 How to Contact'), 'Must include Contact chip');
});

test('AIChatWidget listens to portfolio:open-ai-chat event and dispatches state', () => {
  assert(widgetContent.includes("window.addEventListener('portfolio:open-ai-chat'"), 'Listens to portfolio:open-ai-chat');
  assert(widgetContent.includes("new CustomEvent('portfolio:ai-chat-state'"), 'Dispatches portfolio:ai-chat-state');
});

// 2. App.jsx checks
test('App.jsx mounts AIChatWidget alongside global floating components', () => {
  assert(appContent.includes("import AIChatWidget from './components/AIChatWidget';"), 'Imports AIChatWidget');
  assert(appContent.includes('<AIChatWidget />'), 'Renders <AIChatWidget />');
});

// 3. ExploreSubBar.jsx checks
test('ExploreSubBar includes 5th action item for AI Chat using BotMessageSquare icon', () => {
  assert(exploreBarContent.includes("id: 'ai-chat'"), 'Has id ai-chat');
  assert(exploreBarContent.includes("label_hi: 'एआई चैट'"), 'Has Hindi label');
  assert(exploreBarContent.includes('icon: BotMessageSquare'), 'Must use BotMessageSquare icon in ExploreSubBar');
  assert(exploreBarContent.includes("window.dispatchEvent(new CustomEvent('portfolio:open-ai-chat'));"), 'Dispatches portfolio:open-ai-chat event');
});

// 4. FloatingActionHub.jsx checks
test('FloatingActionHub contains AI Chat FAB with BotMessageSquare icon and gradient styling', () => {
  assert(hubContent.includes("id: 'ai-chat'"), 'Has id ai-chat');
  assert(hubContent.includes('BotMessageSquare'), 'Must use BotMessageSquare icon in FloatingActionHub');
  assert(hubContent.includes("label: 'AI Chat (असिस्टेंट)'"), 'Has bilingual tooltip');
  assert(hubContent.includes("window.dispatchEvent(new CustomEvent('portfolio:open-ai-chat'));"), 'Dispatches portfolio:open-ai-chat event');
});

test('FloatingActionHub array ordering matches exact bottom-to-top visual specification in flex-col-reverse', () => {
  const aiChatIdx = hubContent.indexOf("id: 'ai-chat'");
  const whatsappIdx = hubContent.indexOf("id: 'whatsapp-direct'");
  const labStudioIdx = hubContent.indexOf("id: 'lab-studio'");
  const audienceFilterIdx = hubContent.indexOf("id: 'audience-filter'");
  const viewModeIdx = hubContent.indexOf("id: 'view-mode'");

  assert(aiChatIdx !== -1, 'ai-chat item must be in hub');
  assert(whatsappIdx !== -1, 'whatsapp-direct item must be in hub');
  assert(labStudioIdx !== -1, 'lab-studio item must be in hub');
  assert(audienceFilterIdx !== -1, 'audience-filter item must be in hub');
  assert(viewModeIdx !== -1, 'view-mode item must be in hub');

  // Array order in flex-col-reverse:
  // [aiChatIdx, whatsappIdx, labStudioIdx, audienceFilterIdx, viewModeIdx]
  // Because flex-col-reverse renders index 0 at bottom, index 1 above 0, etc:
  // Visual bottom-to-top:
  // 1. Master Toggle FAB
  // 2. AI Chat FAB (index 0)
  // 3. WhatsApp FAB (index 1)
  // 4. Control Panel / Lab Studio FAB (index 2)
  // 5. Audience Filter FAB (index 3)
  // 6. View Mode FAB (index 4)
  assert(aiChatIdx < whatsappIdx, 'ai-chat must precede whatsapp-direct in array');
  assert(whatsappIdx < labStudioIdx, 'whatsapp-direct must precede lab-studio in array');
  assert(labStudioIdx < audienceFilterIdx, 'lab-studio must precede audience-filter in array');
  assert(audienceFilterIdx < viewModeIdx, 'audience-filter must precede view-mode in array');
});

console.log(`\n================================================================`);
console.log(`TOTAL CHECKS: ${passCount} | PASSED: ${passCount} | FAILED: 0`);
console.log(`🌟 AI CHAT WIDGET & FAB INTEGRATION VERIFIED! 🌟`);
console.log(`================================================================\n`);
