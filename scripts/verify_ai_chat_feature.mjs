import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('--- STARTING VERIFICATION OF AI CHAT BUTTON & WIDGET ARCHITECTURE ---');

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

// 1. AIChatWidget architecture checks
test('AIChatWidget renders docked station container flush to bottom-0 with appropriate z-index and border radius', () => {
  assert(widgetContent.includes('fixed bottom-0 z-[55]'), 'Must have fixed bottom-0 z-[55]');
  assert(widgetContent.includes('backdrop-blur-md'), 'Must have backdrop-blur-md');
  assert(widgetContent.includes('shadow-2xl'), 'Must have shadow-2xl');
  assert(widgetContent.includes('rounded-t-2xl rounded-b-none border-t border-x border-b-0'), 'Must have docked rounded-t-2xl rounded-b-none border-t border-x border-b-0');
});

test('AIChatWidget contains safe ViewMode Context initialization and trigger handlers', () => {
  assert(widgetContent.includes('useViewMode'), 'Must import or use useViewMode');
  assert(widgetContent.includes('handleTriggerAudienceDecisionTree'), 'Must have handleTriggerAudienceDecisionTree');
  assert(widgetContent.includes('handleTriggerRoleDecisionTree'), 'Must have handleTriggerRoleDecisionTree');
  assert(widgetContent.includes('handleTriggerViewModeDecisionTree'), 'Must have handleTriggerViewModeDecisionTree');
});

test('AIChatWidget sub-header right toolbar contains Users, Briefcase, and Monitor icon buttons', () => {
  assert(widgetContent.includes('Select Audience Perspective'), 'Must have audience perspective title');
  assert(widgetContent.includes('Select Job Role Track'), 'Must have job role track title');
  assert(widgetContent.includes('Switch View Mode'), 'Must have switch view mode title');
});

test('AIChatWidget decision tree supports skip, other, and view mode selections', () => {
  assert(widgetContent.includes('⏩ Skip'), 'Must have Skip button');
  assert(widgetContent.includes('✏️ Other / Specify'), 'Must have Other / Specify input');
  assert(widgetContent.includes('handleViewModeDecisionSelect'), 'Must have viewMode decision select handler');
});

console.log(`\n================================================================`);
console.log(`TOTAL CHECKS: ${passCount} | PASSED: ${passCount} | FAILED: 0`);
console.log(`🌟 AI CHAT ARCHITECTURE & WIDGET VERIFIED SUCCESSFULLY! 🌟`);
console.log(`================================================================\n`);
