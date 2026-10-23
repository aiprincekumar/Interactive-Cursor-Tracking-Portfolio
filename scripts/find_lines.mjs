import fs from 'fs';
const s = fs.readFileSync('src/utils/portfolioAssistantEngine.js', 'utf8');
const lines = s.split('\n');
lines.forEach((line, i) => {
  if (line.includes("case 'experience':")) {
    console.log(`Line ${i+1}: ${line}`);
  }
});
