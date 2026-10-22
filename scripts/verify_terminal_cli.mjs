import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('--- VERIFYING INTERACTIVE DEVELOPER CLI (~/_ CLI) & NAVBAR/EXPLORE INTEGRATION ---');

const projectRoot = process.cwd();

// 1. Check TerminalCLI.jsx exists
const terminalCliPath = path.join(projectRoot, 'src', 'components', 'TerminalCLI.jsx');
assert(fs.existsSync(terminalCliPath), 'TerminalCLI.jsx must exist');
const terminalCode = fs.readFileSync(terminalCliPath, 'utf-8');

// 2. Check layout & features in TerminalCLI.jsx
assert(terminalCode.includes('guest@atul-os'), 'TerminalCLI must include prompt guest@atul-os');
assert(terminalCode.includes('SUGGESTION_CHIPS'), 'TerminalCLI must include suggestion chips');
assert(terminalCode.includes('AUTOCOMPLETE_LIST'), 'TerminalCLI must include command autocomplete list');
assert(terminalCode.includes('MatrixDigitalRain'), 'TerminalCLI must include Matrix Digital Rain component');
assert(terminalCode.includes('crtEnabled'), 'TerminalCLI must include CRT scanlines toggle');
assert(terminalCode.includes('isMinimized'), 'TerminalCLI must support minimized state');
assert(terminalCode.includes('isMaximized'), 'TerminalCLI must support maximized state');

// 2b. Check window drag resize handles & constraints
assert(
  terminalCode.includes('terminal-resize-handle') || terminalCode.includes('handleResizeStart'),
  'TerminalCLI must include manual drag resize handles'
);
assert(
  terminalCode.includes('cursor-nwse-resize') || terminalCode.includes('cursor-se-resize'),
  'TerminalCLI must include bottom-right corner resize grip'
);
assert(
  terminalCode.includes('360') && terminalCode.includes('260'),
  'TerminalCLI must enforce sensible resize constraints (min-width 360px, min-height 260px)'
);

// 3. Check commands
const requiredCommands = [
  'help',
  'about',
  'whoami',
  'skills',
  'projects',
  'contact',
  'resume',
  'cursor',
  'theme',
  'matrix',
  'maximize',
  'minimize',
  'restore',
  'size',
  'resize',
  'sudo',
  'clear',
  'exit',
  'os',
  'style',
  'theme-os',
  'color',
  'font-color',
  'text-color',
  'font-size',
  'font',
  'text-size',
  'zoom',
  'font-family',
  'font-face',
  'typeface',
  'reset',
  'neofetch',
  'fastfetch',
  'ls',
  'cat',
  'pwd',
  'git',
  'ping',
  'history',
  'cowsay',
  'fortune',
  'confetti',
  'weather',
  'bgcolor',
  'bg',
  'background',
  'color-bg',
  'opacity',
  'transparent',
  'transparency',
  'glass'
];
for (const cmd of requiredCommands) {
  assert(terminalCode.includes(`case '${cmd}':`), `TerminalCLI must handle command '${cmd}'`);
}
assert(terminalCode.includes("case 'max':"), 'TerminalCLI must support "max" alias for maximize');
assert(terminalCode.includes("case 'min':"), 'TerminalCLI must support "min" alias for minimize');
assert(terminalCode.includes('520') && terminalCode.includes('720') && terminalCode.includes('960'), 'TerminalCLI must support small (520x360), medium (720x480), and large (960x620) size presets');
assert(terminalCode.includes('hire'), 'TerminalCLI must support "sudo hire"');
assert(terminalCode.includes('rm -rf'), 'TerminalCLI must support "rm -rf" easter egg');

// 3b. Check Multi-OS Switcher & Prompts
assert(terminalCode.includes('guest@atul-mac:~ %'), 'TerminalCLI must format macOS prompt');
assert(terminalCode.includes('PS C:\\\\Users\\\\Atul>'), 'TerminalCLI must format Windows PowerShell prompt');
assert(terminalCode.includes('guest@atul-linux:~$'), 'TerminalCLI must format Ubuntu Linux prompt');
assert(terminalCode.includes('terminal_os_style'), 'TerminalCLI must persist osStyle in localStorage');

// 3c. Check Color & Typography Customization
assert(terminalCode.includes('COLOR_PRESETS'), 'TerminalCLI must define COLOR_PRESETS');
assert(terminalCode.includes('terminal_font_color'), 'TerminalCLI must persist fontColor in localStorage');
assert(terminalCode.includes('FONT_SIZE_PRESETS'), 'TerminalCLI must define FONT_SIZE_PRESETS');
assert(terminalCode.includes('terminal_font_size'), 'TerminalCLI must persist fontSize in localStorage');
assert(terminalCode.includes('FONT_FAMILIES'), 'TerminalCLI must define FONT_FAMILIES');
assert(terminalCode.includes('terminal_font_family'), 'TerminalCLI must persist fontFamily in localStorage');

// 3d. Check Power Pack Virtual Files
const expectedFiles = ['about.md', 'skills.json', 'projects.ts', 'resume.pdf', 'contact.sh', 'secrets.env'];
for (const file of expectedFiles) {
  assert(terminalCode.includes(file), `TerminalCLI must include virtual file "${file}"`);
}

// 3e. Check Background Color & Opacity Customization
assert(terminalCode.includes('DEFAULT_OS_BG'), 'TerminalCLI must define DEFAULT_OS_BG');
assert(terminalCode.includes('BG_COLOR_PRESETS'), 'TerminalCLI must define BG_COLOR_PRESETS');
assert(terminalCode.includes('terminal_bg_color'), 'TerminalCLI must persist customBgColor in localStorage');
assert(terminalCode.includes('OPACITY_PRESETS'), 'TerminalCLI must define OPACITY_PRESETS');
assert(terminalCode.includes('terminal_bg_opacity'), 'TerminalCLI must persist bgOpacity in localStorage');
assert(terminalCode.includes('hexToRgba'), 'TerminalCLI must implement hexToRgba helper for background rendering');

// 4. Check audio methods in audio.js
const audioPath = path.join(projectRoot, 'src', 'utils', 'audio.js');
const audioCode = fs.readFileSync(audioPath, 'utf-8');
assert(audioCode.includes('playKeyClick'), 'audio.js must include playKeyClick');
assert(audioCode.includes('playTerminalSuccess'), 'audio.js must include playTerminalSuccess');
assert(audioCode.includes('playTerminalError'), 'audio.js must include playTerminalError');

// 5. Check Navbar.jsx integration
const navbarPath = path.join(projectRoot, 'src', 'components', 'Navbar.jsx');
const navbarCode = fs.readFileSync(navbarPath, 'utf-8');
assert(!navbarCode.includes('[ ~/_ ]'), 'Navbar.jsx must NOT have standalone [ ~/_ ] button in the top navbar header');
assert(navbarCode.includes('onToggleTerminal'), 'Navbar.jsx must receive onToggleTerminal prop');
assert(navbarCode.includes('onOpenTerminal'), 'Navbar.jsx must receive onOpenTerminal prop');
assert(navbarCode.includes('onToggleTerminal={onToggleTerminal}'), 'Navbar.jsx must pass onToggleTerminal into ExploreSubBar');
assert(navbarCode.includes('onOpenTerminal={onOpenTerminal}'), 'Navbar.jsx must pass onOpenTerminal into ExploreSubBar');

// 6. Check ExploreSubBar.jsx & View Mode integration (Terminal CLI moved exclusively to View Mode)
const explorePath = path.join(projectRoot, 'src', 'components', 'ExploreSubBar.jsx');
assert(fs.existsSync(explorePath), 'ExploreSubBar.jsx must exist');
const exploreCode = fs.readFileSync(explorePath, 'utf-8');
assert(!exploreCode.includes("id: 'terminal-cli'"), 'ExploreSubBar must NOT include terminal-cli item (removed in favor of View Mode)');

const viewModeContextPath = path.join(projectRoot, 'src', 'context', 'ViewModeContext.jsx');
assert(fs.existsSync(viewModeContextPath), 'ViewModeContext.jsx must exist');
const viewModeCode = fs.readFileSync(viewModeContextPath, 'utf-8');
assert(viewModeCode.includes('terminal'), 'ViewModeContext must include terminal mode');
assert(viewModeCode.includes('portfolio:open-terminal'), 'ViewModeContext must trigger portfolio:open-terminal event');

// 7. Check App.jsx integration
const appPath = path.join(projectRoot, 'src', 'App.jsx');
const appCode = fs.readFileSync(appPath, 'utf-8');
assert(appCode.includes('TerminalCLI'), 'App.jsx must import and mount TerminalCLI');
assert(appCode.includes('isTerminalOpen'), 'App.jsx must maintain isTerminalOpen state');
assert(appCode.includes("e.key === '`' || e.key === '~'"), 'App.jsx must register global tilde key shortcut');
assert(appCode.includes('portfolio:open-terminal'), 'App.jsx must support portfolio:open-terminal custom event');
assert(appCode.includes('onOpenTerminal'), 'App.jsx must pass onOpenTerminal prop to Navbar');

// 8. Check TerminalCLI.jsx auto-restore from minimized
assert(
  terminalCode.includes('isOpen && isMinimized') || terminalCode.includes('portfolio:open-terminal'),
  'TerminalCLI must auto-restore from minimized when opened or triggered'
);

console.log('✅ ALL INTERACTIVE DEVELOPER CLI SPECIFICATIONS VERIFIED SUCCESSFULLY!');
