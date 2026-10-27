// ============================================================================
// Single GitHub Workflow & Deployment Guard Verification Suite
// Invariant: Exactly ONE workflow file (`deploy.yml`) is permitted in `.github/workflows/`.
// Any extra, duplicate, or rogue workflow files will cause this test to FAIL.
// ============================================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const WORKFLOWS_DIR = path.join(REPO_ROOT, '.github', 'workflows');

console.log('========================================================================');
console.log('  VERIFYING SINGLE GITHUB WORKFLOW ARCHITECTURE & DEPLOYMENT GUARD      ');
console.log('========================================================================\n');

let passCount = 0;
let failCount = 0;

function reportPass(msg) {
  passCount++;
  console.log(`✅ PASS: ${msg}`);
}

function reportFail(msg) {
  failCount++;
  console.error(`❌ FAIL: ${msg}`);
}

// Check 1: .github/workflows directory exists
if (!fs.existsSync(WORKFLOWS_DIR)) {
  reportFail(`.github/workflows directory does not exist at ${WORKFLOWS_DIR}`);
  process.exit(1);
}
reportPass(`.github/workflows directory exists and is accessible`);

// Check 2: Exactly ONE workflow file exists in .github/workflows/
const files = fs.readdirSync(WORKFLOWS_DIR).filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));
console.log(`Found ${files.length} workflow file(s): [${files.join(', ')}]`);

if (files.length === 1 && files[0] === 'deploy.yml') {
  reportPass(`Strict single workflow constraint verified: ONLY 'deploy.yml' exists`);
} else {
  reportFail(`Expected exactly 1 workflow file ('deploy.yml'), but found ${files.length}: ${JSON.stringify(files)}`);
}

// Check 3: Verify deploy.yml configuration integrity
const deployPath = path.join(WORKFLOWS_DIR, 'deploy.yml');
const content = fs.readFileSync(deployPath, 'utf8');

if (content.includes('name: Deploy to GitHub Pages')) {
  reportPass(`Workflow title verified: 'Deploy to GitHub Pages'`);
} else {
  reportFail(`Workflow missing expected name 'Deploy to GitHub Pages'`);
}

if (content.includes('branches:') && content.includes('- main')) {
  reportPass(`Triggers on push to branch 'main'`);
} else {
  reportFail(`Workflow missing trigger on 'main' branch`);
}

if (content.includes('workflow_dispatch:')) {
  reportPass(`Manual dispatch trigger 'workflow_dispatch' is enabled`);
} else {
  reportFail(`Workflow missing 'workflow_dispatch' trigger`);
}

if (content.includes('paths-ignore:')) {
  reportPass(`Noise filter 'paths-ignore' configured to prevent redundant runs on doc/log commits`);
} else {
  reportFail(`Workflow missing 'paths-ignore' optimization`);
}

if (content.includes('cancel-in-progress: true')) {
  reportPass(`Concurrency cancel-in-progress enabled to avoid run backlogs`);
} else {
  reportFail(`Workflow missing 'cancel-in-progress: true'`);
}

if (content.includes('npm run build') && content.includes('./dist')) {
  reportPass(`Builds project with 'npm run build' and uploads artifact './dist'`);
} else {
  reportFail(`Workflow missing proper build step or dist artifact path`);
}

if (content.includes('actions/deploy-pages@v4')) {
  reportPass(`Uses modern official 'actions/deploy-pages@v4' action`);
} else {
  reportFail(`Workflow missing 'actions/deploy-pages@v4'`);
}

console.log('\n========================================================================');
console.log(`TOTAL CHECKS: ${passCount + failCount} | PASSED: ${passCount} | FAILED: ${failCount}`);
console.log('========================================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 SINGLE GITHUB WORKFLOW GUARD VERIFIED WITH 100% SUCCESS!\n');
}
