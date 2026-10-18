import fs from 'fs';
import path from 'path';

// Minimal mock environment
const store = new Map();
global.localStorage = {
  getItem: (key) => (store.has(key) ? store.get(key) : null),
  setItem: (key, val) => store.set(key, String(val)),
  removeItem: (key) => store.delete(key),
  clear: () => store.clear()
};

global.window = {
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => true
};

global.document = {
  body: {
    classList: {
      toggle: () => {},
      add: () => {},
      remove: () => {}
    }
  }
};

// Import LabContext module
const labContextPath = path.resolve(process.cwd(), 'src/context/LabContext.jsx');
const content = fs.readFileSync(labContextPath, 'utf8');

// Ensure module can load in node by removing JSX if needed or import directly
// Since LabContext.jsx has JSX and imports, let's inspect how scripts/test_challenger_control_center_stress.mjs runs it.
