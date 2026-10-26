import { execSync } from 'child_process';

let out = '';
try {
  out = execSync('npx oxlint -D no-undef src/components/AIChatWidget.jsx src/components/chat/*.jsx', { encoding: 'utf8' });
} catch (err) {
  out = err.stdout || '';
}

const lines = out.split('\n');
const errors = [];
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('eslint(no-undef)')) {
    const match = lines[i].match(/'([^']+)' is not defined/);
    if (match) {
      errors.push({ name: match[1], line: lines[i+1] });
    }
  }
}

const standardGlobals = new Set([
  'window', 'document', 'setTimeout', 'clearTimeout', 'CustomEvent', 'navigator',
  'URL', 'Image', 'localStorage', 'requestIdleCallback', 'cancelIdleCallback',
  'speechSynthesis', 'SpeechSynthesisUtterance', 'webkitSpeechRecognition', 'SpeechRecognition',
  'console', 'Blob'
]);

const nonStandard = errors.filter(e => !standardGlobals.has(e.name));
console.log('Non-standard undefined identifiers count:', nonStandard.length);
console.log(JSON.stringify(nonStandard, null, 2));
