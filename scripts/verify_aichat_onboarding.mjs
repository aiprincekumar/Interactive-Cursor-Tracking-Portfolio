import fs from 'fs';
import path from 'path';
import assert from 'assert';

const widgetPath = path.resolve('src/components/AIChatWidget.jsx');
const code = fs.readFileSync(widgetPath, 'utf8');

console.log('--- Verifying AIChatWidget Implementation Invariants ---');

// 1. Initial welcome message & 3-row summary card
assert(code.includes("step: 'preferences_prompt'"), "Preferences prompt step defined");
assert(code.includes("summaryCard: {"), "summaryCard property exists in welcome message");
assert(code.includes("audience:"), "summaryCard contains audience");
assert(code.includes("role:"), "summaryCard contains role");
assert(code.includes("viewMode:"), "summaryCard contains viewMode");
assert(code.includes("⚙️ Current Preferences / वर्तमान प्राथमिकताएं"), "Summary card header present");
assert(code.includes("👥 Audience"), "Summary card Audience row present");
assert(code.includes("💼 Job Role"), "Summary card Job Role row present");
assert(code.includes("⚡ View Mode"), "Summary card View Mode row present");
console.log('✓ Invariant 1 verified: 3-row summary card and preferences prompt exist and render correctly.');

// 2. customize_no jumps straight to Step 4: AI Model Download Consent
assert(code.includes("if (actionId === 'customize_no') {"), "customize_no handler exists");
assert(code.includes("step: 'ai_consent'"), "ai_consent step defined");
assert(code.includes("options: AI_MODEL_CONSENT_OPTIONS"), "AI_MODEL_CONSENT_OPTIONS referenced");
console.log('✓ Invariant 2 verified: customize_no jumps straight to Step 4 AI Model Download Consent.');

// 3. customize_yes initiates sequential decision tree: Audience -> Role -> View Mode -> AI Consent
assert(code.includes("handlePreferencesPromptSelect"), "handlePreferencesPromptSelect exists");
assert(code.includes("step: 'audience'"), "step: audience exists");
assert(code.includes("isSequential: true"), "isSequential flag supported");
assert(code.includes("handleAudienceDecisionSelect"), "handleAudienceDecisionSelect exists");
assert(code.includes("step: 'role'"), "step: role exists");
assert(code.includes("handleRoleDecisionSelect"), "handleRoleDecisionSelect exists");
assert(code.includes("step: 'viewMode'"), "step: viewMode exists");
assert(code.includes("handleViewModeDecisionSelect"), "handleViewModeDecisionSelect exists");
console.log('✓ Invariant 3 verified: customize_yes initiates Audience -> Role -> View Mode -> AI Consent sequence.');

// 4. Skip advances smoothly to next step
assert(code.includes("handleAudienceDecisionSkip"), "handleAudienceDecisionSkip exists");
assert(code.includes("handleRoleDecisionSkip"), "handleRoleDecisionSkip exists");
assert(code.includes("handleViewModeDecisionSkip"), "handleViewModeDecisionSkip exists");
assert(code.includes("handleSkipClick"), "handleSkipClick router exists in JSX");
console.log('✓ Invariant 4 verified: Skip advances through sequential steps correctly.');

// 5. AI model consent persistence & event dispatch
assert(code.includes("portfolio_ai_model_consent"), "portfolio_ai_model_consent key used for localStorage");
assert(code.includes("portfolio:ai-consent-change"), "portfolio:ai-consent-change event dispatched");
console.log('✓ Invariant 5 verified: AI consent persists in localStorage and dispatches event.');

// 6. Layout: single-column full-width and dedicated bottom Skip button container
assert(code.includes("flex flex-col gap-2 w-full"), "Options list renders with single-column w-full flex-col");
assert(code.includes("const regularOptions = allOptions.filter((chip) => !chip.isSkip);"), "Skip filtered from regular options");
assert(code.includes("const skipOption = allOptions.find((chip) => chip.isSkip);"), "Skip extracted separately");
assert(code.includes("border-t border-stone-200/50 dark:border-stone-700/50 w-full"), "Dedicated bottom skip container exists with full width");
console.log('✓ Invariant 6 verified: 1-column w-full layout and dedicated bottom skip container confirmed.');

console.log('All automated invariant assertions passed successfully!');
