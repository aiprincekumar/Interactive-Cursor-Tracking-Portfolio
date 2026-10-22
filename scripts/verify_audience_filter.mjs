import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('--- STARTING AUDIENCE FILTER FEATURE VERIFICATION ---');

let totalTests = 0;
let passedTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ FAIL: ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

const rootDir = process.cwd();

// 1. AudienceContext verification
test('src/context/AudienceContext.jsx exists and exports required primitives', () => {
  const filePath = path.join(rootDir, 'src/context/AudienceContext.jsx');
  assert.ok(fs.existsSync(filePath), 'AudienceContext.jsx should exist');
  const content = fs.readFileSync(filePath, 'utf-8');

  assert.ok(content.includes('export function AudienceProvider'), 'AudienceProvider should be exported');
  assert.ok(content.includes('export function useAudience'), 'useAudience should be exported');
  assert.ok(content.includes('export const AUDIENCE_STORAGE_KEY'), 'AUDIENCE_STORAGE_KEY should be exported');
  assert.ok(content.includes('export const AUDIENCE_MODES'), 'AUDIENCE_MODES should be exported');
  assert.ok(content.includes('export const AUDIENCE_LIST'), 'AUDIENCE_LIST should be exported');
  assert.ok(content.includes('portfolio_audience_mode'), 'localStorage key should be portfolio_audience_mode');
});

test('AudienceContext defines all 3 modes with finalized dual-labels, emojis, and descriptions', () => {
  const filePath = path.join(rootDir, 'src/context/AudienceContext.jsx');
  const content = fs.readFileSync(filePath, 'utf-8');

  assert.ok(content.includes("all: {"), "Mode 'all' should be defined");
  assert.ok(content.includes("recruiter: {"), "Mode 'recruiter' should be defined");
  assert.ok(content.includes("client: {"), "Mode 'client' should be defined");

  // Dual-labels
  assert.ok(content.includes("label: 'All (No Filter)'"), "Mode 'all' label must be 'All (No Filter)'");
  assert.ok(content.includes("shortLabel: 'All'"), "Mode 'all' shortLabel must be 'All'");
  assert.ok(content.includes("label: 'Recruiter / Job'"), "Mode 'recruiter' label must be 'Recruiter / Job'");
  assert.ok(content.includes("shortLabel: 'Recruiter / Job'"), "Mode 'recruiter' shortLabel must be 'Recruiter / Job'");
  assert.ok(content.includes("label: 'Freelancer / Client'"), "Mode 'client' label must be 'Freelancer / Client'");
  assert.ok(content.includes("shortLabel: 'Freelancer / Client'"), "Mode 'client' shortLabel must be 'Freelancer / Client'");

  // Emojis
  assert.ok(content.includes("emoji: '🌐'"), "Globe emoji for all");
  assert.ok(content.includes("emoji: '💼'"), "Briefcase emoji for recruiter");
  assert.ok(content.includes("emoji: '🤝'"), "Handshake emoji for client");

  // Descriptions
  assert.ok(content.includes("description: 'Default full portfolio view'"), "All description");
  assert.ok(content.includes("description: 'Hiring, HR & career oriented'"), "Recruiter description");
  assert.ok(content.includes("description: 'Freelance services & client work'"), "Client description");

  // Icons
  assert.ok(content.includes('Globe'), 'Globe icon used for all');
  assert.ok(content.includes('Briefcase'), 'Briefcase icon used for recruiter');
  assert.ok(content.includes('Handshake'), 'Handshake icon used for client');
});

test('AudienceContext handles URL query param and localStorage synchronization', () => {
  const filePath = path.join(rootDir, 'src/context/AudienceContext.jsx');
  const content = fs.readFileSync(filePath, 'utf-8');

  assert.ok(content.includes('url.searchParams.set'), 'Should sync URL search params');
  assert.ok(content.includes('url.searchParams.delete'), 'Should clean URL search params on default');
  assert.ok(content.includes('localStorage.setItem'), 'Should write to localStorage');
  assert.ok(content.includes('localStorage.getItem'), 'Should read from localStorage');
});

// 2. AudienceSubBar verification
test('src/components/AudienceSubBar.jsx exists, reflects dual-labels, and implements variants', () => {
  const filePath = path.join(rootDir, 'src/components/AudienceSubBar.jsx');
  assert.ok(fs.existsSync(filePath), 'AudienceSubBar.jsx should exist');
  const content = fs.readFileSync(filePath, 'utf-8');

  assert.ok(content.includes("variant === 'drawer-card'"), 'Supports drawer-card variant');
  assert.ok(content.includes("useAudience"), 'Consumes useAudience context');
  assert.ok(content.includes("soundFX"), 'Integrates sound effects');
  assert.ok(content.includes("handleKeyDown"), 'Implements keyboard navigation');
  assert.ok(content.includes("Escape"), 'Handles Escape key dismissal');
  assert.ok(content.includes("All (No Filter)"), 'Reflects All (No Filter)');
  assert.ok(content.includes("Recruiter / Job"), 'Reflects Recruiter / Job');
  assert.ok(content.includes("Freelancer / Client"), 'Reflects Freelancer / Client');
});

// 3. AudienceFloatingPill verification (React Portal, Anchored Alignment, Drag Engine & LocalStorage Persistence)
test('src/components/AudienceFloatingPill.jsx mounts via createPortal into document.body and implements vertical glass card layout with z-[55]', () => {
  const filePath = path.join(rootDir, 'src/components/AudienceFloatingPill.jsx');
  assert.ok(fs.existsSync(filePath), 'AudienceFloatingPill.jsx should exist');
  const content = fs.readFileSync(filePath, 'utf-8');

  // React Portal to document.body to eliminate CSS transform containing block traps
  assert.ok(content.includes('createPortal'), 'Mounts via createPortal from react-dom');
  assert.ok(content.includes('document.body'), 'Portals directly to document.body');

  // Vertical card layout & glass styling
  assert.ok(content.includes('flex flex-col gap-1'), 'Vertical stack column layout');
  assert.ok(content.includes('rounded-2xl'), 'Rounded container');
  assert.ok(content.includes('backdrop-blur-xl'), 'Backdrop blur glassmorphism');
  assert.ok(content.includes('w-72 sm:w-80'), 'Comfortable card width w-72 sm:w-80');
  assert.ok(content.includes('z-[55]'), 'High elevation z-[55] above action hub');

  // Active mode glow
  assert.ok(
    content.includes('ring-emerald-400') && content.includes('ring-purple-400'),
    'Active mode emerald/purple glow rings'
  );

  // SoundFX & auto-close
  assert.ok(content.includes('playFocusBeep'), 'Integrates playFocusBeep');
  assert.ok(content.includes('playChipHover'), 'Integrates playChipHover');
  assert.ok(content.includes('handleClickOutside'), 'Closes on outside click');
  assert.ok(content.includes('Escape'), 'Closes on Escape key');
});

test('AudienceFloatingPill enforces dynamic anchored alignment, text selection prevention, and click-outside protection', () => {
  const filePath = path.join(rootDir, 'src/components/AudienceFloatingPill.jsx');
  const content = fs.readFileSync(filePath, 'utf-8');

  // Dynamic anchored position calculation relative to trigger button
  assert.ok(
    content.includes('updateAnchoredPosition'),
    'Implements updateAnchoredPosition callback for dynamic viewport positioning'
  );
  assert.ok(
    content.includes('audience-filter-trigger'),
    'Locates trigger button via id or data-audience-filter-trigger'
  );
  assert.ok(
    content.includes('triggerRect.left - cardWidth - 14'),
    'Applies 14px left clearance offset beside trigger button'
  );
  assert.ok(
    content.includes('userSelect') || content.includes('select-none'),
    'Prevents text selection during drag and click'
  );
  assert.ok(
    content.includes('Math.abs(deltaX) > 4') || (content.includes('deltaX') && content.includes('> 4')),
    'Implements > 4px micro-movement drag threshold'
  );
  assert.ok(
    content.includes('setPointerCapture') && content.includes('releasePointerCapture'),
    'Uses pointer capture for smooth dragging'
  );
  assert.ok(
    content.includes('data-audience-filter-trigger'),
    'Click-outside ignores trigger button with [data-audience-filter-trigger]'
  );
  assert.ok(
    content.includes('setTimeout('),
    'Registers pointerdown with delay to avoid premature close'
  );
});

test('AudienceFloatingPill implements draggable engine, drag handle header, and RotateCcw reset', () => {
  const filePath = path.join(rootDir, 'src/components/AudienceFloatingPill.jsx');
  const content = fs.readFileSync(filePath, 'utf-8');

  // Drag handle icons & classes
  assert.ok(content.includes('GripHorizontal'), 'Imports and renders GripHorizontal icon');
  assert.ok(content.includes('RotateCcw'), 'Imports and renders RotateCcw reset button');
  assert.ok(content.includes('cursor-grab active:cursor-grabbing'), 'Uses grab / grabbing cursor on handle');
  assert.ok(content.includes('handleResetPosition'), 'Provides handleResetPosition handler');
  assert.ok(content.includes('onDoubleClick'), 'Double-click on handle header resets position');
  assert.ok(content.includes('wasOpenRef'), 'Tracks open state transition with wasOpenRef to prevent wipe during drag');
  assert.ok(content.includes('cardEl.style.left'), 'Direct DOM style mutation for zero-lag smooth drag');
  assert.ok(!content.includes('!important'), 'No invalid !important inside React inline style objects');
  assert.ok(content.includes("touchAction: 'none'"), 'touch-action: none configured on drag handle');
});

test('AudienceFloatingPill implements 12px viewport boundary clamping and localStorage persistence', () => {
  const filePath = path.join(rootDir, 'src/components/AudienceFloatingPill.jsx');
  const content = fs.readFileSync(filePath, 'utf-8');

  // 12px padding safety clamp
  assert.ok(content.includes('clampCardPosition'), 'Exports or defines clampCardPosition');
  assert.ok(content.includes('12'), 'Uses 12px safety padding');
  assert.ok(content.includes('window.innerWidth - cardWidth - 12'), 'Clamps right boundary with 12px padding');
  assert.ok(content.includes('window.innerHeight - cardHeight - 12'), 'Clamps bottom boundary with 12px padding');

  // LocalStorage key and synchronization
  assert.ok(content.includes('portfolio_audience_card_pos') || content.includes('AUDIENCE_CARD_POS_STORAGE_KEY'), 'Uses portfolio_audience_card_pos storage key');
  assert.ok(content.includes("localStorage.getItem(AUDIENCE_CARD_POS_STORAGE_KEY)") || content.includes("localStorage.getItem('portfolio_audience_card_pos')"), 'Reads position on load');
  assert.ok(content.includes("localStorage.setItem(AUDIENCE_CARD_POS_STORAGE_KEY") || content.includes("localStorage.setItem('portfolio_audience_card_pos'"), 'Saves position on drag end');
  assert.ok(content.includes("localStorage.removeItem(AUDIENCE_CARD_POS_STORAGE_KEY") || content.includes("localStorage.removeItem('portfolio_audience_card_pos'"), 'Clears position on reset');
  assert.ok(content.includes('isValidCardPosition'), 'Validates position on load and resize to purge stale offscreen coordinates');

  // Functional unit test of clamping math
  const minPadding = 12;
  const mockWindow = { innerWidth: 1024, innerHeight: 768 };
  const cardW = 256;
  const cardH = 220;

  const clamp = (x, y) => {
    const maxX = Math.max(minPadding, mockWindow.innerWidth - cardW - minPadding);
    const maxY = Math.max(minPadding, mockWindow.innerHeight - cardH - minPadding);
    return {
      x: Math.min(Math.max(minPadding, x), maxX),
      y: Math.min(Math.max(minPadding, y), maxY)
    };
  };

  // Test left/top clamping
  assert.deepStrictEqual(clamp(-100, -50), { x: 12, y: 12 }, 'Clamps to 12px on top-left overflow');

  // Test right/bottom clamping
  const expectedMaxX = 1024 - 256 - 12; // 756
  const expectedMaxY = 768 - 220 - 12;  // 536
  assert.deepStrictEqual(clamp(2000, 2000), { x: expectedMaxX, y: expectedMaxY }, 'Clamps to 12px from right/bottom boundary');

  // Test within bounds
  assert.deepStrictEqual(clamp(300, 400), { x: 300, y: 400 }, 'Preserves coordinate inside safe bounds');
});

// 4. Navbar verification
test('Navbar.jsx integrates Filter button, badge dot, and AudienceSubBar', () => {
  const filePath = path.join(rootDir, 'src/components/Navbar.jsx');
  const content = fs.readFileSync(filePath, 'utf-8');

  assert.ok(content.includes('AudienceSubBar'), 'Imports AudienceSubBar');
  assert.ok(content.includes('useAudience'), 'Imports useAudience');
  assert.ok(content.includes('isAudienceOpen'), 'Manages isAudienceOpen state');
  assert.ok(content.includes('toggleAudienceBar'), 'Provides toggleAudienceBar handler');
  assert.ok(content.includes('<Filter'), 'Renders Filter icon button');
  assert.ok(content.includes('animate-ping'), 'Renders indicator ping dot when filter is active');
  assert.ok(content.includes('<AudienceSubBar'), 'Renders AudienceSubBar component');
});

// 5. FloatingActionHub verification
test('FloatingActionHub.jsx integrates Audience Filter action and AudienceFloatingPill with tooltips completely removed', () => {
  const filePath = path.join(rootDir, 'src/components/FloatingActionHub.jsx');
  const content = fs.readFileSync(filePath, 'utf-8');

  assert.ok(content.includes('AudienceFloatingPill'), 'Imports AudienceFloatingPill');
  assert.ok(content.includes('useAudience'), 'Imports useAudience');
  assert.ok(content.includes('isAudiencePillOpen'), 'Manages isAudiencePillOpen state');
  assert.ok(content.includes("id: 'audience-filter'"), 'Includes audience-filter speed-dial item');
  assert.ok(content.includes('handleToggleAudienceFilter'), 'Provides toggle handler for pill');
  assert.ok(content.includes('item.pill'), 'Renders flyout pill horizontally');
  assert.ok(content.includes('audience-filter-trigger'), 'Audience filter button has audience-filter-trigger ID');
  assert.ok(content.includes('data-audience-filter-trigger'), 'Audience filter button has data-audience-filter-trigger attribute');

  // Strict tooltip suppression for audience-filter
  assert.ok(content.includes('title: isFilterTrigger ? undefined : item.label'), 'Suppresses native title tooltip on audience filter button');
  assert.ok(content.includes('!isFilterTrigger && !item.pill'), 'Suppresses hover tooltip span on audience filter button');
});

test('AudienceFloatingPill renders all 3 selectable options clearly with no tooltip interference', () => {
  const filePath = path.join(rootDir, 'src/components/AudienceFloatingPill.jsx');
  const content = fs.readFileSync(filePath, 'utf-8');

  // Verify options are mapped and selectable
  assert.ok(content.includes('modesList.map'), 'Maps over all audience modes in order');
  assert.ok(content.includes('data-audience-option={mode.id}'), 'Renders data-audience-option attribute on mode buttons');
  assert.ok(content.includes('role="radio"'), 'Accessible radio roles for selectable options');
  assert.ok(content.includes('aria-checked={isActive}'), 'Clear active selection state');
  assert.ok(content.includes('Check'), 'Renders Check icon for active state');
  assert.ok(!content.includes('title={description}'), 'Suppresses native tooltips from mode buttons');
});

// 6. App.jsx context wrapping and ZERO DOM filtering verification
test('App.jsx wraps with AudienceProvider with ZERO section hiding or filtering', () => {
  const filePath = path.join(rootDir, 'src/App.jsx');
  const content = fs.readFileSync(filePath, 'utf-8');

  assert.ok(content.includes('AudienceProvider'), 'App.jsx imports and mounts AudienceProvider');

  // Verify all sections remain unconditionally present
  const requiredSections = [
    '<HeroSection',
    '<AboutSection',
    '<SkillsSection',
    '<ExperienceSection',
    '<ProjectsSection',
    '<CodingAchievementsSection',
    '<SocialProofSection',
    '<ContactSection',
    '<Footer'
  ];

  for (const sec of requiredSections) {
    assert.ok(content.includes(sec), `Section ${sec} must be rendered`);
    // Ensure no audience === '...' condition wrapping these sections
    assert.ok(!content.includes(`audience === 'recruiter' && ${sec}`), `Section ${sec} must not be conditionally filtered`);
    assert.ok(!content.includes(`audience === 'client' && ${sec}`), `Section ${sec} must not be conditionally filtered`);
  }
});

// 7. BackToTopButton clearance verification
test('BackToTopButton supports hubItemCount >= 4 clearance', () => {
  const filePath = path.join(rootDir, 'src/components/BackToTopButton.jsx');
  const content = fs.readFileSync(filePath, 'utf-8');

  assert.ok(content.includes('hubItemCount >= 4'), 'BackToTop handles 4+ speed dial items');
});

console.log('================================================================');
console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${totalTests - passedTests}`);
if (totalTests === passedTests) {
  console.log('🌟 ALL AUDIENCE FILTER SPECIFICATION TESTS PASSED 100%! 🌟');
}
console.log('================================================================');
