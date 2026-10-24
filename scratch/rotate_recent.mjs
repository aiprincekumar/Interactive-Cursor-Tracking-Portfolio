import fs from 'fs';
import path from 'path';

const recentDir = path.resolve('changes_log/recent_10');

// Read existing recent files
let files = [];
for (let i = 1; i <= 10; i++) {
    const filename = `change_recent_${String(i).padStart(2, '0')}.md`;
    const filepath = path.join(recentDir, filename);
    if (fs.existsSync(filepath)) {
        files.push(fs.readFileSync(filepath, 'utf8'));
    }
}

// New entry for CHG-20261024-019
const newEntry = `# Recent Change: CHG-20261024-019

- **Change ID:** \`CHG-20261024-019\`
- **Timestamp:** \`2026-10-24 03:05:00\`
- **Author:** \`changes_log_manager\` / Agentic Engineer
- **Target Files:** \`src/components/BasicPDFViewer.jsx\`, \`src/App.jsx\`
- **Summary:** Implemented Dedicated In-Page Basic View PDF Viewer (\`BasicPDFViewer.jsx\`), App.jsx viewMode Integration, Hiding Navbar and LabStudioDrawer in Basic View, Preserving All Floating Action Buttons.
`;

files.unshift(newEntry);
if (files.length > 10) {
    files = files.slice(0, 10);
}

for (let i = 0; i < files.length; i++) {
    const filename = `change_recent_${String(i + 1).padStart(2, '0')}.md`;
    const filepath = path.join(recentDir, filename);
    fs.writeFileSync(filepath, files[i], 'utf8');
}
console.log('Successfully rotated recent_10');
