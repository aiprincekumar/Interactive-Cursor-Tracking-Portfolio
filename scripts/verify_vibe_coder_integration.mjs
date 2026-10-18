import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('====================================================');
console.log('AUDIT VERIFICATION: VIBE CODING PROFILE INTEGRATION');
console.log('====================================================\n');

let passCount = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passCount++;
  } catch (err) {
    console.error(`❌ FAIL: ${name}`);
    console.error(`   ${err.message}`);
    process.exit(1);
  }
}

// 1. RoleContext.jsx checks
test('RoleContext.jsx orders vibe_coding between mis and other', () => {
  const content = fs.readFileSync(path.resolve('src/context/RoleContext.jsx'), 'utf8');
  assert(content.includes("id: 'vibe_coding'"), "Missing vibe_coding role definition");
  
  // Find indexes
  const misIndex = content.indexOf("id: 'mis'");
  const vibeIndex = content.indexOf("id: 'vibe_coding'");
  const otherIndex = content.indexOf("id: 'other'");
  
  assert(misIndex !== -1, "Missing mis role");
  assert(vibeIndex !== -1, "Missing vibe_coding role");
  assert(otherIndex !== -1, "Missing other role");
  assert(vibeIndex > misIndex, "vibe_coding must come after mis");
  assert(vibeIndex < otherIndex, "vibe_coding must come before other in file structure");

  // Verify PRIMARY_ROLES and ROLE_TRACKS order
  assert(content.includes('export const ROLE_TRACKS = [OVERVIEW_ROLE, ...PRIMARY_ROLES, OTHER_ROLE];'), 'ROLE_TRACKS must be [OVERVIEW_ROLE, ...PRIMARY_ROLES, OTHER_ROLE]');
  assert(content.includes('isVibeCoding: activeRole === \'vibe_coding\''), 'isVibeCoding flag missing');
  assert(content.includes('isVibe: activeRole === \'vibe_coding\''), 'isVibe flag missing');
  assert(content.includes('VibeCoder.jpg'), 'VibeCoder.jpg avatar missing');
});

// 2. Avatar Asset Exists
test('public/assets/Profile_Pic/VibeCoder.jpg exists and is non-empty', () => {
  const assetPath = path.resolve('public/assets/Profile_Pic/VibeCoder.jpg');
  assert(fs.existsSync(assetPath), 'VibeCoder.jpg does not exist');
  const stat = fs.statSync(assetPath);
  assert(stat.size > 10000, `VibeCoder.jpg is too small: ${stat.size} bytes`);
});

// 3. AboutSection.jsx checks
test('AboutSection.jsx supports vibe_coding and defines story & competencies', () => {
  const content = fs.readFileSync(path.resolve('src/components/AboutSection.jsx'), 'utf8');
  assert(content.includes('VIBE_CODING_COMPETENCIES'), 'Missing VIBE_CODING_COMPETENCIES');
  assert(content.includes('VIBE_CODING_STORY'), 'Missing VIBE_CODING_STORY');
  assert(content.includes('Vibe Coder & AI Software Engineer'), 'Missing Vibe Coder professional title');
  assert(content.includes('isVibeCoding'), 'Missing isVibeCoding usage');
  assert(content.includes('#10B981'), 'Missing emerald accent #10B981');
});

// 4. SkillsSection.jsx checks
test('SkillsSection.jsx defines Vibe Coding categories and skill data points', () => {
  const content = fs.readFileSync(path.resolve('src/components/SkillsSection.jsx'), 'utf8');
  assert(content.includes('VIBE_CODING_CATEGORIES'), 'Missing VIBE_CODING_CATEGORIES');
  assert(content.includes('Cursor & Windsurf IDEs'), 'Missing Cursor & Windsurf IDEs skill');
  assert(content.includes('Claude Code & Agent Loops'), 'Missing Claude Code & Agent Loops skill');
  assert(content.includes('v0.dev & Generative UI'), 'Missing v0.dev skill');
  assert(content.includes('Autonomous Debugging & Verification'), 'Missing Autonomous Debugging skill');
  assert(content.includes('Next.js 14 & React Ecosystem'), 'Missing Next.js 14 skill');
  assert(content.includes('Tailwind CSS & Modern UI'), 'Missing Tailwind CSS skill');
  assert(content.includes('Supabase & Cloud Backend'), 'Missing Supabase skill');
  assert(content.includes('LLM APIs & Prompt Architecture'), 'Missing LLM APIs skill');
});

// 5. ProjectsSection.jsx checks
test('ProjectsSection.jsx provides 3 vibe coding projects and overview inclusion', () => {
  const content = fs.readFileSync(path.resolve('src/components/ProjectsSection.jsx'), 'utf8');
  assert(content.includes('VIBE_CODING_PROJECTS'), 'Missing VIBE_CODING_PROJECTS array');
  assert(content.includes('proj-ai-saas-generator'), 'Missing project 07');
  assert(content.includes('proj-agent-workflow-engine'), 'Missing project 08');
  assert(content.includes('proj-doc-code-synthesizer'), 'Missing project 09');
  assert(content.includes('renderVibeProject01'), 'Missing renderVibeProject01');
  assert(content.includes('renderVibeProject02'), 'Missing renderVibeProject02');
  assert(content.includes('renderVibeProject03'), 'Missing renderVibeProject03');
});

// 6. ExperienceSection.jsx checks (6 Months)
test('ExperienceSection.jsx explicitly specifies 6 months of experience', () => {
  const content = fs.readFileSync(path.resolve('src/components/ExperienceSection.jsx'), 'utf8');
  assert(content.includes('exp-vibe-01'), 'Missing exp-vibe-01');
  assert(content.includes("'2026 (6 MONTHS)'"), 'Period must explicitly state 2026 (6 MONTHS)');
  assert(content.includes('2026 (6 Months) • Rapid AI Prototyping & SaaS Engineering'), 'Period pill must state 2026 (6 Months)');
  assert(content.includes('VIBE_CODING_ROLES'), 'Missing VIBE_CODING_ROLES array');
});

// 7. TechMarqueeBanner.jsx checks
test('TechMarqueeBanner.jsx includes vibe coding tools in marquee and TECH_DETAILS', () => {
  const content = fs.readFileSync(path.resolve('src/components/TechMarqueeBanner.jsx'), 'utf8');
  assert(content.includes("'Cursor IDE'"), 'Missing Cursor IDE in marquee');
  assert(content.includes("'Claude Code'"), 'Missing Claude Code in marquee');
  assert(content.includes("'Windsurf'"), 'Missing Windsurf in marquee');
  assert(content.includes("'v0.dev'"), 'Missing v0.dev in marquee');
  assert(content.includes("'Next.js 14'"), 'Missing Next.js 14 in marquee');
  assert(content.includes("'Supabase'"), 'Missing Supabase in marquee');
  assert(content.includes("'Tailwind CSS'"), 'Missing Tailwind CSS in marquee');
  assert(content.includes("'LLM Prompt APIs'"), 'Missing LLM Prompt APIs in marquee');
  assert(content.includes("role: 'vibe_coding'"), 'Missing role: vibe_coding in TECH_DETAILS');
});

// 8. CodingAchievementsSection.jsx checks
test('CodingAchievementsSection.jsx defines vibe stats, ticker, and banner card', () => {
  const content = fs.readFileSync(path.resolve('src/components/CodingAchievementsSection.jsx'), 'utf8');
  assert(content.includes('VIBE_CODING_STATS'), 'Missing VIBE_CODING_STATS');
  assert(content.includes('VIBE_CODING_TICKER_ITEMS'), 'Missing VIBE_CODING_TICKER_ITEMS');
  assert(content.includes('10x Shipping Velocity: Prompt-Driven Full-Stack SaaS Engineering'), 'Missing 10x banner card');
  assert(content.includes('10x Vibe Coder'), 'Missing 10x Vibe Coder badge');
});

// 9. resumeConfig.js checks
test('resumeConfig.js includes vibe_coding download and config', () => {
  const content = fs.readFileSync(path.resolve('src/utils/resumeConfig.js'), 'utf8');
  assert(content.includes('vibe_coding: {'), 'Missing vibe_coding resume entry');
  assert(content.includes('Atul_Verma_Vibe_Coder_Resume.pdf'), 'Missing Atul_Verma_Vibe_Coder_Resume.pdf downloadFilename');
  assert(content.includes('Vibe Coder Resume'), 'Missing label Vibe Coder Resume');
  assert(content.includes('#10B981'), 'Missing emerald accent in resumeConfig');
});

// 10. searchCatalog.js checks
test('searchCatalog.js has catalog items for action, projects, skills, and experience', () => {
  const content = fs.readFileSync(path.resolve('src/utils/searchCatalog.js'), 'utf8');
  assert(content.includes('act-role-vibe'), 'Missing act-role-vibe switcher action');
  assert(content.includes('proj-ai-saas-generator'), 'Missing proj-ai-saas-generator');
  assert(content.includes('proj-agent-workflow-engine'), 'Missing proj-agent-workflow-engine');
  assert(content.includes('proj-doc-code-synthesizer'), 'Missing proj-doc-code-synthesizer');
  assert(content.includes('skill-cursor-windsurf-ides'), 'Missing skill-cursor-windsurf-ides');
  assert(content.includes('skill-claude-code-agent-loops'), 'Missing skill-claude-code-agent-loops');
  assert(content.includes('exp-vibe-coder'), 'Missing exp-vibe-coder');
  assert(content.includes('2026 (6 Mos)'), 'Missing 2026 (6 Mos) experience badge');
});

// 11. CommandPalette.jsx checks
test('CommandPalette.jsx recognizes vibe_coding in role switching and badge', () => {
  const content = fs.readFileSync(path.resolve('src/components/CommandPalette.jsx'), 'utf8');
  assert(content.includes("'vibe_coding'"), 'Missing vibe_coding in role switch condition');
  assert(content.includes('⚡ Vibe Coder'), 'Missing ⚡ Vibe Coder badge');
});

console.log('\n====================================================');
console.log(`TOTAL AUDIT CHECKS PASSED: ${passCount} / 11`);
console.log('====================================================\n');
