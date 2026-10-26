import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('  MULTI-TAB BLINKING & SETTINGS REVERSION VERIFICATION SUITE    ');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failCount++;
  }
}

// 1. Verify LabContext.jsx Anti-Echo Guard, Deduplication & Reference Stability
const labContextPath = path.join(rootDir, 'src', 'context', 'LabContext.jsx');
const labContextCode = fs.readFileSync(labContextPath, 'utf8');

assert(
  labContextCode.includes('isIncomingSyncRef = useRef(false)'),
  'LabContext defines isIncomingSyncRef guard'
);

assert(
  labContextCode.includes('lastSavedPayloadRef = useRef'),
  'LabContext defines lastSavedPayloadRef for payload deduplication'
);

assert(
  /if\s*\(\s*isIncomingSyncRef\.current\s*\)[\s\S]*?isIncomingSyncRef\.current\s*=\s*false;[\s\S]*?return;/.test(labContextCode),
  'LabContext persist effect bails out immediately when incoming sync is active (Anti-Echo)'
);

assert(
  labContextCode.includes('if (currentPayloadString === lastSavedPayloadRef.current) {\n      return;\n    }'),
  'LabContext deduplicates identical payloads before writing to localStorage'
);

assert(
  labContextCode.includes('isIncomingSyncRef.current = true;'),
  'LabContext marks isIncomingSyncRef = true when storage event arrives'
);

assert(
  labContextCode.includes('if (current.soundEnabled !== nextVal) setSoundEnabledState(nextVal);'),
  'LabContext performs reference stability check before updating state (audio.soundEnabled)'
);

assert(
  labContextCode.includes('if (current.customCursorEnabled !== nextVal) setCustomCursorEnabledState(nextVal);'),
  'LabContext performs reference stability check before updating state (cursor.customCursorEnabled)'
);

assert(
  labContextCode.includes('if (current.accentColor !== c) setAccentColorState(c);'),
  'LabContext performs reference stability check before updating state (visuals.accentColor)'
);

// 2. Verify ControlCenterFullView.jsx syncPulse throttle / debounce
const fullViewPath = path.join(rootDir, 'src', 'components', 'ControlCenterFullView.jsx');
const fullViewCode = fs.readFileSync(fullViewPath, 'utf8');

assert(
  fullViewCode.includes('const pulseTimerRef = useRef(null);'),
  'ControlCenterFullView defines pulseTimerRef for pulse throttling'
);

assert(
  fullViewCode.includes('if (!pulseTimerRef.current) {') &&
  fullViewCode.includes('setSyncPulse(true);') &&
  fullViewCode.includes('clearTimeout(pulseTimerRef.current);') &&
  fullViewCode.includes('pulseTimerRef.current = setTimeout('),
  'ControlCenterFullView debounces/throttles syncPulse to prevent rapid blinking loops'
);

assert(
  fullViewCode.includes('if (pulseTimerRef.current) {\n        clearTimeout(pulseTimerRef.current);\n        pulseTimerRef.current = null;\n      }'),
  'ControlCenterFullView clears pulseTimerRef on unmount preventing memory leaks'
);

// 3. Verify ControlCenterPanel.jsx internal tab bar suppression in standalone / single mode
const panelPath = path.join(rootDir, 'src', 'components', 'ControlCenterPanel.jsx');
const panelCode = fs.readFileSync(panelPath, 'utf8');

assert(
  panelCode.includes('{mode !== \'single\' && !isStandalone && ('),
  'ControlCenterPanel suppresses duplicate internal tab bar when isStandalone=true or mode="single"'
);

assert(
  panelCode.includes('const effectiveActiveTab = (mode === \'single\' && singleTab) ? singleTab : activeTab;'),
  'ControlCenterPanel resolves effectiveActiveTab correctly in single mode'
);

assert(
  fullViewCode.includes('isStandalone={true}') && fullViewCode.includes('mode="single"') && fullViewCode.includes('mode="all"'),
  'ControlCenterFullView correctly passes isStandalone={true} with appropriate mode prop'
);

// 4. Multi-Tab Echo Loop Simulation Test
let tabA_storageWriteCount = 0;
let tabB_storageWriteCount = 0;

class MockStorageChannel {
  constructor() {
    this.storage = {};
    this.listeners = [];
  }
  subscribe(fn) {
    this.listeners.push(fn);
  }
  setItem(key, value, originTab) {
    this.storage[key] = value;
    for (const listener of this.listeners) {
      if (listener.tab !== originTab) {
        listener.fn({ key, newValue: value });
      }
    }
  }
}

const channel = new MockStorageChannel();

class SimulatedTab {
  constructor(name) {
    this.name = name;
    this.isIncomingSyncRef = { current: false };
    this.lastSavedPayloadRef = { current: '' };
    this.state = { soundEnabled: true, masterVolume: 0.8 };
    this.writeCount = 0;

    channel.subscribe({
      tab: this.name,
      fn: (e) => this.handleStorageEvent(e)
    });
  }

  handleStorageEvent(e) {
    if (e.key === 'portfolio_control_center') {
      const inc = JSON.parse(e.newValue);
      this.isIncomingSyncRef.current = true;
      if (inc.audio) {
        if (this.state.soundEnabled !== inc.audio.soundEnabled) {
          this.state.soundEnabled = inc.audio.soundEnabled;
        }
      }
      // Trigger Tab effect
      this.persistEffect();
    }
  }

  persistEffect() {
    if (this.isIncomingSyncRef.current) {
      this.isIncomingSyncRef.current = false;
      return; // Anti-Echo Guard triggered!
    }

    const core = { audio: { soundEnabled: this.state.soundEnabled } };
    const coreStr = JSON.stringify(core);
    if (coreStr === this.lastSavedPayloadRef.current) {
      return; // Deduplication triggered!
    }
    this.lastSavedPayloadRef.current = coreStr;

    this.writeCount++;
    const payload = { ...core, updatedAt: new Date().toISOString() };
    channel.setItem('portfolio_control_center', JSON.stringify(payload), this.name);
  }

  userChangeSetting(newVal) {
    this.state.soundEnabled = newVal;
    this.persistEffect();
  }
}

const tabA = new SimulatedTab('TabA');
const tabB = new SimulatedTab('TabB');

// Tab A user changes sound to false
tabA.userChangeSetting(false);

assert(
  tabA.writeCount === 1,
  'Tab A performed exactly 1 write on user action'
);

assert(
  tabB.state.soundEnabled === false,
  'Tab B received and applied Tab A setting change'
);

assert(
  tabB.writeCount === 0,
  'Tab B did NOT echo or write back to storage (writeCount === 0) - Circular Reflection Loop PREVENTED!'
);

// Tab B user changes setting to true
tabB.userChangeSetting(true);

assert(
  tabB.writeCount === 1,
  'Tab B performed exactly 1 write on user action'
);

assert(
  tabA.state.soundEnabled === true,
  'Tab A received and applied Tab B setting change'
);

assert(
  tabA.writeCount === 1,
  'Tab A did NOT echo or write back to storage (Tab A writeCount remains 1) - Zero Echoing!'
);

console.log('\n================================================================');
console.log(`  VERIFICATION RESULTS: ${passCount} PASSED | ${failCount} FAILED`);
console.log('================================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
