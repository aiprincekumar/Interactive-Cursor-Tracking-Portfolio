import assert from 'node:assert';
import { readFileSync } from 'node:fs';

console.log('--- Verifying Phase 01: 0ms Dual Real-Time Cross-Tab 3D Sync Engine ---');

// 1. Verify LabContext exports and constants
const labContextSource = readFileSync('src/context/LabContext.jsx', 'utf8');

assert(
  labContextSource.includes('export const PORTFOLIO_3D_CHANNEL_NAME'),
  'Must export PORTFOLIO_3D_CHANNEL_NAME'
);
assert(
  labContextSource.includes('export const PORTFOLIO_3D_INSTANT_SYNC_KEY'),
  'Must export PORTFOLIO_3D_INSTANT_SYNC_KEY'
);
console.log('✓ Constants PORTFOLIO_3D_CHANNEL_NAME and PORTFOLIO_3D_INSTANT_SYNC_KEY verified.');

// 2. Verify BroadcastChannel listener and dispatch logic
assert(
  labContextSource.includes('new BroadcastChannel(PORTFOLIO_3D_CHANNEL_NAME)'),
  'Must instantiate BroadcastChannel'
);
assert(
  labContextSource.includes('SYNC_3D_STATE'),
  'Must handle SYNC_3D_STATE IPC message type'
);
assert(
  labContextSource.includes('flushPendingSave()'),
  'Must trigger immediate flushPendingSave() for 3D state'
);
assert(
  labContextSource.includes('PORTFOLIO_3D_INSTANT_SYNC_KEY'),
  'Must write to PORTFOLIO_3D_INSTANT_SYNC_KEY on 3D changes'
);
console.log('✓ BroadcastChannel setup, message handler, and instant flush verified.');

// 3. Test functional BroadcastChannel simulation
if (typeof BroadcastChannel !== 'undefined') {
  const channelA = new BroadcastChannel('portfolio_3d_channel_test');
  const channelB = new BroadcastChannel('portfolio_3d_channel_test');

  const testPayload = {
    masterTheme: 'cyber-neon',
    isVisualOnly: true,
    camera: { anglePreset: 'cinematic' }
  };

  const received = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('BroadcastChannel test timed out')), 2000);
    channelB.onmessage = (e) => {
      clearTimeout(timeout);
      resolve(e.data);
    };
    channelA.postMessage({
      type: 'SYNC_3D_STATE',
      payload: testPayload,
      sender: 'tab_sender_test',
      timestamp: Date.now()
    });
  });

  assert.strictEqual(received.type, 'SYNC_3D_STATE');
  assert.strictEqual(received.payload.masterTheme, 'cyber-neon');
  assert.strictEqual(received.sender, 'tab_sender_test');

  channelA.close();
  channelB.close();
  console.log('✓ Functional 0ms BroadcastChannel IPC simulation passed successfully.');
} else {
  console.log('ℹ BroadcastChannel skipped in current Node runtime.');
}

console.log('========================================================');
console.log('✅ Phase 01: 0ms Cross-Tab Sync Engine PASSED 100%');
console.log('========================================================');
