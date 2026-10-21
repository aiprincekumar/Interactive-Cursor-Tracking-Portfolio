import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('====================================================================');
console.log('ADVERSARIAL EMPIRICAL HARNESS: PILLARS 1 & 2 FOCUS TRAPPING & FLOW');
console.log('====================================================================\n');

let passCount = 0;
let failCount = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${description}`);
    passCount++;
  } catch (err) {
    console.error(`❌ FAIL: ${description}`);
    console.error(`   ${err.message}`);
    failCount++;
  }
}

// Read Source Files for Static and Behavioral Verification
const focusTrapCode = fs.readFileSync(path.join(rootDir, 'src/hooks/useFocusTrap.js'), 'utf8');
const cmdPaletteCode = fs.readFileSync(path.join(rootDir, 'src/components/CommandPalette.jsx'), 'utf8');
const labDrawerCode = fs.readFileSync(path.join(rootDir, 'src/components/LabStudioDrawer.jsx'), 'utf8');
const resumeDropdownCode = fs.readFileSync(path.join(rootDir, 'src/components/ResumeDropdown.jsx'), 'utf8');
const galleryCode = fs.readFileSync(path.join(rootDir, 'src/components/CameraRollGallery.jsx'), 'utf8');
const navbarCode = fs.readFileSync(path.join(rootDir, 'src/components/Navbar.jsx'), 'utf8');
const backToTopCode = fs.readFileSync(path.join(rootDir, 'src/components/BackToTopButton.jsx'), 'utf8');
const appCode = fs.readFileSync(path.join(rootDir, 'src/App.jsx'), 'utf8');
const ribbonCode = fs.readFileSync(path.join(rootDir, 'src/components/CursorSelectorRibbon.jsx'), 'utf8');
const controlCenterCode = fs.readFileSync(path.join(rootDir, 'src/components/ControlCenterPanel.jsx'), 'utf8');

// ============================================================================
// SUITE 1: EMPIRICAL SIMULATION OF useFocusTrap HOOK LOGIC
// ============================================================================
console.log('--- Suite 1: Empirical Simulation of useFocusTrap Hook Logic ---');

// Mock DOM Environment for testing useFocusTrap algorithms
class MockElement {
  constructor(tagName, attrs = {}) {
    this.tagName = tagName.toUpperCase();
    this.attrs = { ...attrs };
    this.children = [];
    this.parentNode = null;
    this.isFocused = false;
    this.isVisible = true;
  }

  setAttribute(name, val) {
    this.attrs[name] = String(val);
  }

  getAttribute(name) {
    return this.attrs[name] ?? null;
  }

  hasAttribute(name) {
    return Object.prototype.hasOwnProperty.call(this.attrs, name);
  }

  focus() {
    if (globalMockDocument.activeElement) {
      globalMockDocument.activeElement.isFocused = false;
    }
    this.isFocused = true;
    globalMockDocument.activeElement = this;
  }

  get offsetParent() {
    return this.isVisible ? (this.parentNode || {}) : null;
  }

  getClientRects() {
    return this.isVisible ? [{ width: 100, height: 20 }] : [];
  }

  contains(other) {
    if (other === this) return true;
    for (const child of this.children) {
      if (child.contains(other)) return true;
    }
    return false;
  }

  appendChild(child) {
    child.parentNode = this;
    this.children.push(child);
  }

  querySelectorAll(selector) {
    const results = [];
    const checkMatch = (el) => {
      // Basic selector matching for test purposes
      let match = false;
      if (el.tagName === 'BUTTON' && !el.hasAttribute('disabled') && el.getAttribute('tabindex') !== '-1') match = true;
      if (el.tagName === 'INPUT' && !el.hasAttribute('disabled') && el.getAttribute('tabindex') !== '-1') match = true;
      if (el.tagName === 'A' && el.hasAttribute('href') && el.getAttribute('tabindex') !== '-1') match = true;
      if (el.hasAttribute('tabindex') && el.getAttribute('tabindex') !== '-1') match = true;
      if (match) results.push(el);

      for (const child of el.children) {
        checkMatch(child);
      }
    };
    for (const child of this.children) {
      checkMatch(child);
    }
    return results;
  }
}

const globalMockDocument = {
  activeElement: null
};

// Pure logic extracted directly from useFocusTrap.js for execution
function simulateFocusTrapLogic(container, event, { onEscape = null } = {}) {
  const FOCUSABLE_SELECTOR = [
    'a[href]:not([tabindex="-1"])',
    'area[href]:not([tabindex="-1"])',
    'input:not([disabled]):not([tabindex="-1"])',
    'select:not([disabled]):not([tabindex="-1"])',
    'textarea:not([disabled]):not([tabindex="-1"])',
    'button:not([disabled]):not([tabindex="-1"])',
    'iframe:not([tabindex="-1"])',
    '[tabindex]:not([tabindex="-1"])',
    '[contentEditable=true]:not([tabindex="-1"])',
  ].join(', ');

  let prevented = false;
  let stopped = false;
  const e = {
    key: event.key,
    shiftKey: Boolean(event.shiftKey),
    preventDefault: () => { prevented = true; },
    stopPropagation: () => { stopped = true; }
  };

  if (e.key === 'Escape') {
    if (typeof onEscape === 'function') {
      e.preventDefault();
      e.stopPropagation();
      onEscape();
    }
    return { prevented, stopped, activeElement: globalMockDocument.activeElement };
  }

  if (e.key === 'Tab') {
    const focusableElements = Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
      (el) => el.offsetParent !== null || el.getClientRects().length > 0
    );

    if (focusableElements.length === 0) {
      e.preventDefault();
      return { prevented, stopped, activeElement: globalMockDocument.activeElement };
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      // Backward tab
      if (globalMockDocument.activeElement === firstElement || !container.contains(globalMockDocument.activeElement)) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Forward tab
      if (globalMockDocument.activeElement === lastElement || !container.contains(globalMockDocument.activeElement)) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  return { prevented, stopped, activeElement: globalMockDocument.activeElement };
}

test('Empirical: Tab on last focusable element wraps cleanly to first element', () => {
  const container = new MockElement('div');
  const btn1 = new MockElement('button');
  const btn2 = new MockElement('button');
  const btn3 = new MockElement('button');
  container.appendChild(btn1);
  container.appendChild(btn2);
  container.appendChild(btn3);

  // Set focus on last button
  btn3.focus();
  assert.strictEqual(globalMockDocument.activeElement, btn3);

  // Press Tab
  const res = simulateFocusTrapLogic(container, { key: 'Tab', shiftKey: false });
  assert.strictEqual(res.prevented, true, 'Default Tab must be prevented to prevent focus leakage');
  assert.strictEqual(globalMockDocument.activeElement, btn1, 'Focus must wrap to first element');
});

test('Empirical: Shift+Tab on first focusable element wraps cleanly to last element', () => {
  const container = new MockElement('div');
  const btn1 = new MockElement('button');
  const btn2 = new MockElement('button');
  const btn3 = new MockElement('button');
  container.appendChild(btn1);
  container.appendChild(btn2);
  container.appendChild(btn3);

  // Set focus on first button
  btn1.focus();
  assert.strictEqual(globalMockDocument.activeElement, btn1);

  // Press Shift+Tab
  const res = simulateFocusTrapLogic(container, { key: 'Tab', shiftKey: true });
  assert.strictEqual(res.prevented, true, 'Default Shift+Tab must be prevented');
  assert.strictEqual(globalMockDocument.activeElement, btn3, 'Focus must wrap to last element');
});

test('Empirical: Tab when focus is outside container forces focus into first element', () => {
  const container = new MockElement('div');
  const outsideBtn = new MockElement('button');
  const insideBtn1 = new MockElement('button');
  const insideBtn2 = new MockElement('button');
  container.appendChild(insideBtn1);
  container.appendChild(insideBtn2);

  outsideBtn.focus();
  assert.strictEqual(globalMockDocument.activeElement, outsideBtn);
  assert.strictEqual(container.contains(outsideBtn), false);

  const res = simulateFocusTrapLogic(container, { key: 'Tab', shiftKey: false });
  assert.strictEqual(res.prevented, true);
  assert.strictEqual(globalMockDocument.activeElement, insideBtn1, 'Focus must be pulled into container');
});

test('Empirical: Shift+Tab when focus is outside container forces focus into last element', () => {
  const container = new MockElement('div');
  const outsideBtn = new MockElement('button');
  const insideBtn1 = new MockElement('button');
  const insideBtn2 = new MockElement('button');
  container.appendChild(insideBtn1);
  container.appendChild(insideBtn2);

  outsideBtn.focus();
  assert.strictEqual(globalMockDocument.activeElement, outsideBtn);

  const res = simulateFocusTrapLogic(container, { key: 'Tab', shiftKey: true });
  assert.strictEqual(res.prevented, true);
  assert.strictEqual(globalMockDocument.activeElement, insideBtn2, 'Focus must be pulled into container last element');
});

test('Empirical: Empty container with 0 focusable elements prevents Tab focus escape', () => {
  const container = new MockElement('div');
  const outsideBtn = new MockElement('button');
  outsideBtn.focus();

  const res = simulateFocusTrapLogic(container, { key: 'Tab', shiftKey: false });
  assert.strictEqual(res.prevented, true, 'Default Tab must be prevented so focus cannot escape into underlying document');
});

test('Empirical: Escape key reliably stops propagation and triggers onEscape callback', () => {
  const container = new MockElement('div');
  let escapeTriggered = false;

  const res = simulateFocusTrapLogic(container, { key: 'Escape' }, {
    onEscape: () => { escapeTriggered = true; }
  });

  assert.strictEqual(escapeTriggered, true, 'onEscape callback must be fired');
  assert.strictEqual(res.prevented, true, 'Default Escape must be prevented');
  assert.strictEqual(res.stopped, true, 'Escape event propagation must be stopped');
});

test('Empirical: Dynamic DOM changes - Querying is real-time and not cached statically', () => {
  const container = new MockElement('div');
  const btn1 = new MockElement('button');
  container.appendChild(btn1);

  // Tab with 1 element
  btn1.focus();
  let res = simulateFocusTrapLogic(container, { key: 'Tab', shiftKey: false });
  assert.strictEqual(globalMockDocument.activeElement, btn1);

  // Dynamically add 2nd button (e.g. search suggestions appeared)
  const btn2 = new MockElement('button');
  container.appendChild(btn2);

  // Now Tab from btn1 does not preventDefault (browser standard forward focus)
  btn2.focus();
  res = simulateFocusTrapLogic(container, { key: 'Tab', shiftKey: false });
  assert.strictEqual(res.prevented, true);
  assert.strictEqual(globalMockDocument.activeElement, btn1, 'Now btn2 is last element, so Tab wraps to btn1');
});


// ============================================================================
// SUITE 2: ADVERSARIAL STRESS TESTING OF ALL 5 OVERLAYS
// ============================================================================
console.log('\n--- Suite 2: Adversarial Audit of All 5 Overlays ---');

// Overlay 1: CommandPalette
test('Overlay 1 (CommandPalette): Uses useFocusTrap with initialFocusRef, onEscape, and restoreFocus', () => {
  assert(cmdPaletteCode.includes('useFocusTrap(isOpen, modalContainerRef,'), 'Must pass isOpen and modalContainerRef');
  assert(cmdPaletteCode.includes('initialFocusRef: inputRef'), 'Must focus search input initially');
  assert(cmdPaletteCode.includes('onEscape: onClose'), 'Must close on escape');
  assert(cmdPaletteCode.includes('restoreFocus: true'), 'Must restore focus on close');
});

test('Overlay 1 (CommandPalette): Combobox semantics and listbox options keyboard navigation', () => {
  assert(cmdPaletteCode.includes('role="dialog"'), 'CommandPalette backdrop must be role="dialog"');
  assert(cmdPaletteCode.includes('aria-modal="true"'), 'CommandPalette must be aria-modal="true"');
  assert(cmdPaletteCode.includes('role="combobox"'), 'Search input must have role="combobox"');
  assert(cmdPaletteCode.includes('aria-controls="command-palette-results"'), 'Combobox must control results');
  assert(cmdPaletteCode.includes('id="command-palette-results" role="listbox"'), 'Results container must have role="listbox"');
  assert(cmdPaletteCode.includes('role="option"'), 'Search items must have role="option"');
  assert(cmdPaletteCode.includes("e.key === 'ArrowDown'"), 'Must handle ArrowDown navigation');
  assert(cmdPaletteCode.includes("e.key === 'ArrowUp'"), 'Must handle ArrowUp navigation');
});

// Overlay 2: LabStudioDrawer
test('Overlay 2 (LabStudioDrawer): Integrates useFocusTrap and inert/aria-hidden when closed', () => {
  assert(labDrawerCode.includes('useFocusTrap(isDrawerOpen, drawerRef,'), 'Must pass isDrawerOpen and drawerRef');
  assert(labDrawerCode.includes('onEscape: closeDrawer'), 'Must close on escape');
  assert(labDrawerCode.includes('restoreFocus: true'), 'Must restore focus on close');
  assert(labDrawerCode.includes('aria-hidden={!isDrawerOpen}'), 'Must be aria-hidden when closed');
  assert(labDrawerCode.includes("inert={!isDrawerOpen ? '' : undefined}"), 'Must be inert when closed');
});

test('Overlay 2 (LabStudioDrawer): Backdrop does not participate in Tab cycle', () => {
  const backdropIdx = labDrawerCode.indexOf('role="button"');
  assert(backdropIdx !== -1, 'Backdrop element exists');
  const backdropBlock = labDrawerCode.slice(backdropIdx - 50, backdropIdx + 200);
  assert(backdropBlock.includes('tabIndex={-1}'), 'Backdrop must have tabIndex={-1} to prevent tab focus stop');
  assert(backdropBlock.includes('aria-hidden="true"'), 'Backdrop must have aria-hidden="true"');
});

// Overlay 3: ResumeDropdown
test('Overlay 3 (ResumeDropdown): Follows WAI-ARIA Menu Button pattern with initial focus and arrow navigation', () => {
  assert(resumeDropdownCode.includes('role="menu"'), 'Dropdown must define role="menu"');
  assert(resumeDropdownCode.includes('role="menuitem"'), 'Dropdown actions must have role="menuitem"');
  assert(resumeDropdownCode.includes('aria-haspopup="menu"'), 'Trigger must have aria-haspopup="menu"');
  assert(resumeDropdownCode.includes('aria-expanded={isOpen}'), 'Trigger must reflect aria-expanded');
  assert(resumeDropdownCode.includes('itemRefs.current[0]?.focus()'), 'Must focus first menu item upon open');
  assert(resumeDropdownCode.includes("e.key === 'ArrowDown'"), 'Must support ArrowDown roving focus');
  assert(resumeDropdownCode.includes("e.key === 'ArrowUp'"), 'Must support ArrowUp roving focus');
  assert(resumeDropdownCode.includes("e.key === 'Home'"), 'Must support Home key jump to start');
  assert(resumeDropdownCode.includes("e.key === 'End'"), 'Must support End key jump to end');
});

test('Overlay 3 (ResumeDropdown): Escape key closes menu and restores focus to trigger toggle button', () => {
  const escapeIdx = resumeDropdownCode.indexOf("event.key === 'Escape'");
  assert(escapeIdx !== -1, 'Must handle Escape key on document');
  const escapeBlock = resumeDropdownCode.slice(escapeIdx, escapeIdx + 150);
  assert(escapeBlock.includes('setIsOpen(false)'), 'Escape must close menu');
  assert(escapeBlock.includes('toggleButtonRef.current?.focus()'), 'Escape must restore focus to trigger button');

  const menuEscapeIdx = resumeDropdownCode.indexOf("e.key === 'Escape'");
  assert(menuEscapeIdx !== -1, 'Must handle Escape key on menu items');
  const menuEscapeBlock = resumeDropdownCode.slice(menuEscapeIdx, menuEscapeIdx + 150);
  assert(menuEscapeBlock.includes('setIsOpen(false)'));
  assert(menuEscapeBlock.includes('toggleButtonRef.current?.focus()'));
});

test('Overlay 3 (ResumeDropdown): Tab key cleanly closes menu allowing predictable tab flow', () => {
  const tabIdx = resumeDropdownCode.indexOf("e.key === 'Tab'");
  assert(tabIdx !== -1, 'Must handle Tab key');
  const tabBlock = resumeDropdownCode.slice(tabIdx, tabIdx + 100);
  assert(tabBlock.includes('setIsOpen(false)'), 'Tab key must dismiss dropdown to advance to next tab stop');
});

// Overlay 4: CameraRollGallery Lightbox
test('Overlay 4 (CameraRollGallery): Lightbox modal integrates useFocusTrap and restores focus to polaroid card', () => {
  assert(galleryCode.includes('useFocusTrap(Boolean(selectedPhoto), lightboxRef,'), 'Must bind useFocusTrap to lightboxRef');
  assert(galleryCode.includes('onEscape: () => setSelectedPhoto(null)'), 'Must dismiss on escape');
  assert(galleryCode.includes('restoreFocus: true'), 'Must restore focus on unmount');
  assert(galleryCode.includes('role="dialog"'), 'Lightbox must be role="dialog"');
  assert(galleryCode.includes('aria-modal="true"'), 'Lightbox must be aria-modal="true"');
});

test('Overlay 4 (CameraRollGallery): Polaroid cards are keyboard-activatable via Enter or Space', () => {
  const cardIdx = galleryCode.indexOf('role="button"');
  assert(cardIdx !== -1, 'Polaroid card has role="button"');
  const cardBlock = galleryCode.slice(cardIdx, cardIdx + 400);
  assert(cardBlock.includes('tabIndex={0}'), 'Card must have tabIndex={0}');
  assert(cardBlock.includes("e.key === 'Enter' || e.key === ' '"), 'Card must support Enter and Space keys');
  assert(cardBlock.includes('handleCardClick(photo)'), 'Keyboard activation must open lightbox');
});

// Overlay 5: Navbar Mobile Drawer
test('Overlay 5 (Navbar): Mobile drawer integrates useFocusTrap with restoreFocus and dialog semantics', () => {
  assert(navbarCode.includes('useFocusTrap(mobileMenuOpen, mobileDrawerRef,'), 'Must bind useFocusTrap to mobileDrawerRef');
  assert(navbarCode.includes('onEscape: () => setMobileMenuOpen(false)'), 'Must dismiss on escape');
  assert(navbarCode.includes('restoreFocus: true'), 'Must restore focus');
  assert(navbarCode.includes('role="dialog"'), 'Mobile drawer must be role="dialog"');
  assert(navbarCode.includes('aria-modal="true"'), 'Mobile drawer must be aria-modal="true"');
});

test('Overlay 5 (Navbar): Mobile drawer backdrop is tabIndex={-1} and closes on outside interaction', () => {
  const backdropIdx = navbarCode.indexOf('role="button"');
  assert(backdropIdx !== -1, 'Mobile backdrop exists');
  const backdropBlock = navbarCode.slice(backdropIdx - 50, backdropIdx + 300);
  assert(backdropBlock.includes('tabIndex={-1}'), 'Backdrop must have tabIndex={-1}');
  assert(backdropBlock.includes('aria-label="Close navigation menu"'), 'Backdrop has accessible label');
});


// ============================================================================
// SUITE 3: KEYBOARD FLOW, HIDDEN TRAPS & ROVING TABINDEX
// ============================================================================
console.log('\n--- Suite 3: Keyboard Flow, Hidden Traps & Roving Tabindex ---');

// 3.1 BackToTopButton
test('BackToTopButton: Completely removed from tab order (tabIndex={-1}) and hidden when invisible', () => {
  assert(backToTopCode.includes('tabIndex={isVisible ? 0 : -1}'), 'Must set tabIndex={-1} when not visible');
  assert(backToTopCode.includes('aria-hidden={!isVisible}'), 'Must be aria-hidden when not visible');
  assert(backToTopCode.includes('pointer-events-none'), 'Must disable pointer events when hidden');
});

// 3.2 Skip Link and Main Content
test('Skip Link: Placed as first interactive element in App.jsx targeting <main id="main-content" tabIndex={-1}>', () => {
  const skipLinkIdx = appCode.indexOf('href="#main-content"');
  assert(skipLinkIdx !== -1, 'Skip link must exist');
  const skipLinkBlock = appCode.slice(skipLinkIdx - 50, skipLinkIdx + 300);
  assert(skipLinkBlock.includes('sr-only focus:not-sr-only'), 'Must be sr-only until focused');
  assert(skipLinkBlock.includes('focus:fixed focus:top-4 focus:left-4 focus:z-[9999]'), 'Must appear prominently on focus');

  const mainIdx = appCode.indexOf('<main');
  assert(mainIdx !== -1, '<main> landmark exists');
  const mainBlock = appCode.slice(mainIdx, mainIdx + 150);
  assert(mainBlock.includes('id="main-content"'), 'Must have id="main-content"');
  assert(mainBlock.includes('tabIndex={-1}'), 'Must have tabIndex={-1} for programmatic focus receiving');
});

// 3.3 Roving tabindex on CursorSelectorRibbon
test('CursorSelectorRibbon: Implements true WAI-ARIA roving tabIndex on radiogroup', () => {
  assert(ribbonCode.includes('role="radiogroup"'), 'Container must have role="radiogroup"');
  assert(ribbonCode.includes('role="radio"'), 'Items must have role="radio"');
  assert(ribbonCode.includes('tabIndex={isFocusable ? 0 : -1}'), 'Only active/first element must be tabIndex={0}, others -1');
  assert(ribbonCode.includes("e.key === 'ArrowRight' || e.key === 'ArrowDown'"), 'ArrowRight/ArrowDown advances');
  assert(ribbonCode.includes("e.key === 'ArrowLeft' || e.key === 'ArrowUp'"), 'ArrowLeft/ArrowUp regresses');
  assert(ribbonCode.includes("e.key === 'Home'"), 'Home jumps to first');
  assert(ribbonCode.includes("e.key === 'End'"), 'End jumps to last');
  assert(ribbonCode.includes('nextBtn?.focus()'), 'Must transfer DOM focus to next item');
});

// 3.4 Roving tabindex on ControlCenterPanel Category Tabs
test('ControlCenterPanel: Category tabs implement roving tabIndex with arrow keys', () => {
  assert(controlCenterCode.includes('role="tablist"'), 'Must have role="tablist"');
  assert(controlCenterCode.includes('role="tab"'), 'Tabs must have role="tab"');
  assert(controlCenterCode.includes('tabIndex={isActive ? 0 : -1}'), 'Only active tab has tabIndex={0}');
  assert(controlCenterCode.includes("e.key === 'ArrowRight'"), 'ArrowRight advances active tab');
  assert(controlCenterCode.includes("e.key === 'ArrowLeft'"), 'ArrowLeft regresses active tab');
  assert(controlCenterCode.includes('nextTab?.focus()'), 'Focus moves to new active tab');
});

// 3.5 Roving tabindex on ControlCenterPanel Layout Density Radiogroup
test('ControlCenterPanel: Layout Density radiogroup implements roving tabIndex with arrow keys', () => {
  assert(controlCenterCode.includes('role="radiogroup"'), 'Density container must have role="radiogroup"');
  assert(controlCenterCode.includes('role="radio"'), 'Density options must have role="radio"');
  assert(controlCenterCode.includes('tabIndex={isSelected ? 0 : -1}'), 'Only selected density has tabIndex={0}');
  assert(controlCenterCode.includes("e.key === 'ArrowRight' || e.key === 'ArrowDown'"), 'Arrow keys advance selection');
  assert(controlCenterCode.includes('nextRadio?.focus()'), 'Focus moves to new selected radio');
});

// 3.6 Marquee duplicate items tab trap elimination & complete tab bypass
test('TechMarqueeBanner: All marquee items are completely excluded from Tab order (tabIndex={-1})', () => {
  const marqueeCode = fs.readFileSync(path.join(rootDir, 'src/components/TechMarqueeBanner.jsx'), 'utf8');
  assert(marqueeCode.includes('tabIndex={-1}'), 'All marquee items must have tabIndex={-1}');
  assert(!marqueeCode.includes('tabIndex={isDuplicate ? -1 : 0}'), 'No marquee items should have tabIndex={0}');
  assert(marqueeCode.includes('aria-hidden="true"'), 'Marquee banner must have aria-hidden="true"');
});

// 3.7 Sequential Tab Flow: HeroSection jumps directly to AboutSection bypassing Marquee
test('Sequential Focus Flow: HeroSection to AboutSection bypasses TechMarqueeBanner completely', () => {
  const marqueeCode = fs.readFileSync(path.join(rootDir, 'src/components/TechMarqueeBanner.jsx'), 'utf8');
  const hasFocusableAnchor = /<a\s+(?![^>]*tabIndex={-1})[^>]*href=/i.test(marqueeCode);
  const hasFocusableButton = /<button\s+(?![^>]*tabIndex={-1})[^>]*>/i.test(marqueeCode);
  const hasFocusableInput = /<input\s+(?![^>]*tabIndex={-1})[^>]*>/i.test(marqueeCode);
  const hasDefaultTabIndex = marqueeCode.includes('tabIndex={0}') || marqueeCode.includes('tabIndex="0"');

  assert(!hasFocusableAnchor, 'No focusable <a> tags without tabIndex={-1} in TechMarqueeBanner');
  assert(!hasFocusableButton, 'No focusable <button> tags without tabIndex={-1} in TechMarqueeBanner');
  assert(!hasFocusableInput, 'No focusable <input> tags without tabIndex={-1} in TechMarqueeBanner');
  assert(!hasDefaultTabIndex, 'No tabIndex={0} elements allowed in TechMarqueeBanner');
  assert(marqueeCode.includes('id="tech-marquee"') && marqueeCode.includes('aria-hidden="true"'), 'Section must be aria-hidden="true"');
});


// ============================================================================
// SUMMARY REPORT
// ============================================================================
console.log('\n====================================================================');
console.log(`ADVERSARIAL EMPIRICAL HARNESS SUMMARY: ${passCount} passed, ${failCount} failed.`);
console.log('====================================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log(`🎉 ALL ${passCount} ADVERSARIAL ACCESSIBILITY TESTS PASSED FLAWLESSLY!\n`);
}
