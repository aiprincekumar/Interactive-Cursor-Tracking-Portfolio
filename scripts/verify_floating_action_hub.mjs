import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('--- STARTING VERIFICATION OF MASTER FLOATING ACTION HUB & BACK TO TOP BUTTON ---');

const hubFilePath = path.resolve('src/components/FloatingActionHub.jsx');
const bttFilePath = path.resolve('src/components/BackToTopButton.jsx');
const appFilePath = path.resolve('src/App.jsx');
const labDrawerFilePath = path.resolve('src/components/LabStudioDrawer.jsx');

assert(fs.existsSync(hubFilePath), 'FloatingActionHub.jsx must exist');
assert(fs.existsSync(bttFilePath), 'BackToTopButton.jsx must exist');
assert(fs.existsSync(appFilePath), 'App.jsx must exist');
assert(fs.existsSync(labDrawerFilePath), 'LabStudioDrawer.jsx must exist');

const hubContent = fs.readFileSync(hubFilePath, 'utf-8');
const bttContent = fs.readFileSync(bttFilePath, 'utf-8');
const appContent = fs.readFileSync(appFilePath, 'utf-8');
const labDrawerContent = fs.readFileSync(labDrawerFilePath, 'utf-8');

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

// 1. FloatingActionHub checks
test('FloatingActionHub initializes with isOpen = false (collapsed by default)', () => {
  assert(hubContent.includes('const [isOpen, setIsOpen] = useState(false);'), 'Should initialize with false');
});

test('Speed-dial child items are hidden when collapsed (opacity-0 and pointer-events-none)', () => {
  assert(hubContent.includes('opacity-0 translate-y-4 pointer-events-none'), 'Must have opacity-0 and pointer-events-none when collapsed');
  assert(hubContent.includes('opacity-100 translate-y-0 pointer-events-auto'), 'Must have opacity-100 and pointer-events-auto when expanded');
  assert(hubContent.includes('aria-hidden={!isOpen}'), 'Container must have aria-hidden={!isOpen}');
});

test('Master toggle button uses Layers icon when closed and X icon when open', () => {
  assert(hubContent.includes('import { Layers, X'), 'Must import Layers and X from lucide-react');
  assert(hubContent.includes('{isOpen ? ('), 'Must condition on isOpen');
  assert(hubContent.includes('<X className="w-6 h-6 transition-transform duration-300 text-white" aria-hidden="true" />'), 'Renders X when open');
  assert(hubContent.includes('<Layers'), 'Renders Layers when closed');
});

test('Master toggle button keeps unrotated base while icon element rotates smoothly', () => {
  // Parent button must not have rotate-90 to avoid tilting tooltip
  assert(!hubContent.match(/<button[\s\S]*?rotate-90[\s\S]*?<span[^>]*inline-flex/), 'Parent button must not have rotate-90');
  // Icon wrapper must have rotate-90
  assert(hubContent.includes("isOpen ? 'rotate-90' : 'rotate-0'"), 'Icon wrapper rotates 90 degrees when open');
  assert(hubContent.includes('transition-transform duration-300'), 'Icon has smooth rotation transition');
});

test('Master toggle button tooltip is horizontally oriented to the left with bilingual text', () => {
  assert(hubContent.includes('right-full mr-3 whitespace-nowrap'), 'Tooltip oriented to the left and does not wrap');
  assert(hubContent.includes("isOpen ? 'सभी बटन छुपाएं (Hide All Buttons)' : 'सभी बटन दिखाएं (Show All Buttons)'"), 'Tooltip has bilingual Hindi-English text in collapsed and expanded states');
  assert(hubContent.includes("aria-label={isOpen ? 'सभी बटन छुपाएं (Hide All Buttons)' : 'सभी बटन दिखाएं (Show All Buttons)'}"), 'Button has bilingual aria-label');
  assert(hubContent.includes("title={isOpen ? 'सभी बटन छुपाएं (Hide All Buttons)' : 'सभी बटन दिखाएं (Show All Buttons)'}"), 'Button has bilingual title');
});

test('Clicking master toggle button flips isOpen state back and forth', () => {
  assert(hubContent.includes('const handleToggle = useCallback(() => {'), 'Defines handleToggle');
  assert(hubContent.includes('setIsOpen((prev) => {'), 'Toggles boolean state');
  assert(hubContent.includes('const next = !prev;'), 'Inverts state');
});

test('Strictly explicit toggle: no outside click or window scroll listener closes the hub', () => {
  assert(!hubContent.includes("addEventListener('scroll',"), 'Must NOT add scroll event listener to close hub');
  assert(!hubContent.includes("window.addEventListener('click',"), 'Must NOT add global click listener to close hub');
  assert(!hubContent.includes("document.addEventListener('click',"), 'Must NOT add document click listener to close hub');
  assert(!hubContent.includes("document.addEventListener('mousedown',"), 'Must NOT add document mousedown listener to close hub');
});

test('Plays sound effects properly on master toggle and actions', () => {
  assert(hubContent.includes('soundFX?.playTap'), 'Calls soundFX.playTap or fallback');
  assert(hubContent.includes('soundFX?.playFocusBeep'), 'Calls soundFX.playFocusBeep for action buttons');
  assert(hubContent.includes('soundFX?.playSparkle'), 'Calls soundFX.playSparkle for WhatsApp action');
});

test('Speed-dial child items stack vertically upwards (flex-col-reverse)', () => {
  assert(hubContent.includes('flex flex-col-reverse items-center gap-3'), 'Must use flex-col-reverse for upward expansion');
});

test('Contains Lab Studio FAB item (Sliders icon) that is hidden in Simple Mode', () => {
  assert(hubContent.includes("if (!isSimpleMode) {"), 'Conditionally adds Lab Studio when !isSimpleMode');
  assert(hubContent.includes("id: 'lab-studio'"), 'Has lab-studio id');
  assert(hubContent.includes('<Sliders'), 'Uses Sliders icon');
});

test('Contains View Mode item (Eye icon) positioned immediately after audience-filter (visually just above filter in flex-col-reverse)', () => {
  assert(hubContent.includes("id: 'view-mode'"), 'Has view-mode id');
  assert(hubContent.includes('<Eye'), 'Uses Eye icon');
  const filterIdx = hubContent.indexOf("id: 'audience-filter'");
  const viewModeIdx = hubContent.indexOf("id: 'view-mode'");
  assert(filterIdx !== -1, 'Must contain audience-filter');
  assert(viewModeIdx !== -1, 'Must contain view-mode');
  assert(viewModeIdx > filterIdx, 'view-mode must be positioned immediately after audience-filter in array');
});

test('Contains WhatsApp Direct Channel item (visible when unlocked)', () => {
  assert(hubContent.includes('if (isWhatsAppUnlocked) {'), 'Conditionally adds WhatsApp when unlocked');
  assert(hubContent.includes("id: 'whatsapp-direct'"), 'Has whatsapp-direct id');
  assert(hubContent.includes('https://wa.me/917992383804'), 'Has correct WhatsApp URL');
});

test('FloatingActionHub synchronizes its open state and child count via window event', () => {
  assert(hubContent.includes("new CustomEvent('floating_hub_state'"), 'Dispatches floating_hub_state event');
  assert(hubContent.includes('isOpen,'), 'Passes isOpen');
  assert(hubContent.includes('itemCount: hubItems.length'), 'Passes hubItems.length');
});

// 2. BackToTopButton checks
test('BackToTopButton is isolated from master toggle group', () => {
  assert(!hubContent.includes('<BackToTopButton'), 'FloatingActionHub does not render BackToTopButton');
  assert(appContent.includes('<FloatingActionHub />'), 'App renders FloatingActionHub independently');
  assert(appContent.includes('<BackToTopButton />'), 'App renders BackToTopButton independently');
});

test('BackToTopButton retains scroll > 400px auto-hide/auto-show behavior', () => {
  assert(bttContent.includes('scrollTop > 400'), 'Checks scrollTop > 400 for visibility');
  assert(bttContent.includes('opacity-100 scale-100 pointer-events-auto'), 'Shows when visible');
  assert(bttContent.includes('opacity-0 scale-75 pointer-events-none'), 'Hides when not visible');
});

test('BackToTopButton dynamically shifts position above the stack (collapsed vs expanded)', () => {
  assert(bttContent.includes("window.addEventListener('floating_hub_state', handleHubState);"), 'Listens for floating_hub_state');
  assert(bttContent.includes('const verticalPositionClass = isHubOpen'), 'Calculates dynamic vertical position based on isHubOpen and hubItemCount');
  assert(bttContent.includes('bottom-22 sm:bottom-25'), 'Default position above collapsed master button');
  assert(bttContent.includes('bottom-40 sm:bottom-44'), 'Higher position for 1 child');
  assert(bttContent.includes('bottom-56 sm:bottom-60'), 'Higher position for 2 children');
  assert(bttContent.includes('bottom-72 sm:bottom-76'), 'Highest position for 3+ children');
});

test('LabStudioDrawer has openDrawer cleanly destructured and does not produce ReferenceError', () => {
  assert(labDrawerContent.includes('openDrawer,'), 'openDrawer is destructured in LabStudioDrawer');
});

// 3. Control Center & Audience Filter Mutual Exclusivity and Non-Blocking Interaction
test('FloatingActionHub has z-[50] and smooth spatial glide positioning when drawer opens', () => {
  assert(hubContent.includes('z-[50]'), 'FloatingActionHub must have z-[50] to stay above backdrop z-[47]');
  assert(hubContent.includes("isDrawerOpen ? 'sm:right-[460px] right-6' : 'right-6 sm:right-8'"), 'Must dynamically adjust right position when drawer is open');
  assert(hubContent.includes('transition-all duration-300'), 'Must have smooth spatial glide transition');
});

test('handleOpenLabStudio toggles drawer, closes audience filter pill, and keeps speed-dial hub open', () => {
  assert(hubContent.includes('toggleDrawer();'), 'Must call toggleDrawer() to toggle the drawer');
  assert(hubContent.includes('setIsAudiencePillOpen(false);'), 'Must close audience filter flyout when lab studio opens');
  assert(!hubContent.match(/handleOpenLabStudio[\s\S]*?setIsOpen\(false\)/), 'Must NOT forcibly close hub via setIsOpen(false) in handleOpenLabStudio');
});

test('handleToggleAudienceFilter is mutually exclusive with Control Center drawer (closes drawer when open)', () => {
  assert(hubContent.includes('isDrawerOpen && closeDrawer'), 'Checks isDrawerOpen and closeDrawer');
  assert(hubContent.includes('closeDrawer();'), 'Must close drawer when audience filter is toggled');
  assert(hubContent.includes('setIsAudiencePillOpen((prev) =>'), 'Toggles audience pill state');
});

test('handleToggleAudienceFilter implements sequential transition timer (~320ms) when Control Center drawer is open', () => {
  assert(hubContent.includes('filterOpenTimerRef'), 'Uses filterOpenTimerRef for managing transition timing');
  assert(hubContent.includes('filterOpenTimerRef.current = setTimeout('), 'Sets sequential timer with setTimeout');
  assert(hubContent.includes('320'), 'Waits ~320ms for 300ms drawer closing and hub sliding transition');
  assert(hubContent.includes('setIsAudiencePillOpen(true)'), 'Opens audience pill after delay');
  assert(hubContent.includes('clearTimeout(filterOpenTimerRef.current)'), 'Cleans up pending timer on unmount and cancel');
});

test('Audience Filter and View Mode render tooltips when flyout pill is not open', () => {
  assert(hubContent.includes('title: item.pill ? undefined : item.label'), 'Suppresses native title tooltip only when flyout pill is open');
  assert(hubContent.includes('!item.pill && ('), 'Renders hover tooltip when flyout pill is not open');
  assert(hubContent.includes('group-focus-visible:opacity-100'), 'Tooltip includes keyboard focus visibility (group-focus-visible:opacity-100)');
});

test('FloatingActionHub eliminates conflicting synchronous window events causing race condition', () => {
  assert(!hubContent.includes("dispatchEvent(new CustomEvent('open_lab_studio'))"), 'Must NOT dispatch open_lab_studio');
  assert(!hubContent.includes("dispatchEvent(new CustomEvent('toggle_lab_studio'))"), 'Must NOT dispatch toggle_lab_studio');
});

test('LabStudioDrawer removes redundant conflicting window event listeners and relies on LabContext', () => {
  assert(!labDrawerContent.includes("addEventListener('open_lab_studio'"), 'Must NOT listen for open_lab_studio');
  assert(!labDrawerContent.includes("addEventListener('toggle_lab_studio'"), 'Must NOT listen for toggle_lab_studio');
});

test('FloatingActionHub decouples isFilterActive from isAudiencePillOpen to prevent false active filter indicator', () => {
  // Pink gradient and white text must ONLY be applied when an actual filter is active (recruiter or client)
  assert(hubContent.includes("isFilterActive\n        ? 'bg-linear-to-tr from-[#FF4D6D] to-[#FF758F] text-white"), 'Applies vibrant pink gradient only when filter is active');
  assert(!hubContent.includes("(isAudiencePillOpen || isFilterActive)\n        ? 'bg-linear-to-tr"), 'Must not show active gradient when merely open');
  // Icon must remain #FF4D6D when opened without an active filter
  assert(hubContent.includes("isFilterActive ? 'text-white' : 'text-[#FF4D6D]'"), 'Keeps pink icon when pill is open but filter is inactive');
  // Ping badge is strictly shown only when isFilterActive is true
  assert(hubContent.includes('badge: isFilterActive ?'), 'Pulsing badge strictly appears only when a filter is applied');
});

console.log(`\n================================================================`);
console.log(`TOTAL CHECKS: ${passCount} | PASSED: ${passCount} | FAILED: 0`);
console.log(`🌟 MASTER FLOATING ACTION HUB & BACK TO TOP BUTTON VERIFIED! 🌟`);
console.log(`================================================================`);
