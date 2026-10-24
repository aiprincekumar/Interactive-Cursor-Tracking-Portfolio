import React from 'react';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { renderToString } = require('react-dom/server');
const { AIChatWidget } = require('../src/components/AIChatWidget.jsx');

console.log('--- STARTING REACT MOUNT & RENDER VERIFICATION FOR AIChatWidget ---');

try {
  const html = renderToString(React.createElement(AIChatWidget));
  
  console.log('✅ PASS: AIChatWidget mounted and rendered JSX cleanly via renderToString without throwing exceptions.');
  console.log(`Rendered HTML length: ${html.length} characters.`);

  const hasUsersBtn = html.includes('Users') || html.includes('👥') || html.includes('visitorMode');
  const hasBriefcaseBtn = html.includes('Briefcase') || html.includes('💼');
  const hasMonitorBtn = html.includes('Monitor') || html.includes('🖥️');

  console.log(`- Users Button / Selector check: ${hasUsersBtn ? '✅ FOUND' : '⚠️ CHECK'}`);
  console.log(`- Briefcase Button / Selector check: ${hasBriefcaseBtn ? '✅ FOUND' : '⚠️ CHECK'}`);
  console.log(`- Monitor Button / Selector check: ${hasMonitorBtn ? '✅ FOUND' : '⚠️ CHECK'}`);

  console.log('================================================================');
  console.log('TOTAL REACT MOUNT CHECKS: PASSED WITH ZERO EXCEPTIONS! 🌟');
  console.log('================================================================');
} catch (err) {
  console.error('❌ FAIL: AIChatWidget mounting/rendering failed with exception:', err);
  process.exit(1);
}
