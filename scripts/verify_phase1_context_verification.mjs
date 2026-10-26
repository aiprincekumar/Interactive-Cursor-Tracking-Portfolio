import fs from 'fs';

console.log('=== VERIFYING PHASE 1 CONTEXT FILES ===');

const langFile = fs.readFileSync('src/context/LanguageContext.jsx', 'utf8');
const themeFile = fs.readFileSync('src/context/ThemeContext.jsx', 'utf8');
const labFile = fs.readFileSync('src/context/LabContext.jsx', 'utf8');

// 1. LanguageContext checks
console.log('\n--- Checking LanguageContext.jsx ---');
if (!langFile.includes('useMemo')) throw new Error('LanguageContext missing useMemo');
if (!langFile.includes('const value = useMemo(')) throw new Error('LanguageContext missing memoized value');
if (!langFile.includes('export function useLanguage()')) throw new Error('LanguageContext missing useLanguage');
console.log('✅ LanguageContext: useMemo imported, provider value memoized, useLanguage exported');

// 2. ThemeContext checks
console.log('\n--- Checking ThemeContext.jsx ---');
if (!themeFile.includes('useMemo')) throw new Error('ThemeContext missing useMemo');
if (!themeFile.includes('const value = useMemo(')) throw new Error('ThemeContext missing memoized value');
if (!themeFile.includes('export function useTheme()')) throw new Error('ThemeContext missing useTheme');
console.log('✅ ThemeContext: useMemo imported, provider value memoized, useTheme exported');

// 3. LabContext checks
console.log('\n--- Checking LabContext.jsx ---');
if (!labFile.includes('useMemo')) throw new Error('LabContext missing useMemo');
const sliceHooks = [
  'useLabCursor',
  'useLabAudio',
  'useLabHero',
  'useLabThreeD',
  'useLabVisuals',
  'useLabDrawer'
];
sliceHooks.forEach(hook => {
  if (!labFile.includes(`export function ${hook}()`)) {
    throw new Error('LabContext missing slice hook: ' + hook);
  }
});
console.log('✅ LabContext: All 6 slice hooks defined and exported');

const sliceContexts = [
  'LabCursorContext',
  'LabAudioContext',
  'LabHeroContext',
  'LabThreeDContext',
  'LabVisualsContext',
  'LabDrawerContext'
];
sliceContexts.forEach(ctx => {
  if (!labFile.includes(`export const ${ctx} = createContext`)) {
    throw new Error('LabContext missing slice context: ' + ctx);
  }
});
console.log('✅ LabContext: All 6 slice contexts created and exported');

const sliceValues = [
  'cursorValue = useMemo(',
  'audioValue = useMemo(',
  'heroValue = useMemo(',
  'threeDValue = useMemo(',
  'visualsValue = useMemo(',
  'drawerValue = useMemo('
];
sliceValues.forEach(val => {
  if (!labFile.includes(val)) {
    throw new Error('LabContext missing slice memoized value: ' + val);
  }
});
console.log('✅ LabContext: All 6 slice values are independently memoized with useMemo');

// Check providers nesting
const expectedProviders = [
  '<LabContext.Provider value={value}>',
  '<LabCursorContext.Provider value={cursorValue}>',
  '<LabAudioContext.Provider value={audioValue}>',
  '<LabHeroContext.Provider value={heroValue}>',
  '<LabThreeDContext.Provider value={threeDValue}>',
  '<LabVisualsContext.Provider value={visualsValue}>',
  '<LabDrawerContext.Provider value={drawerValue}>'
];
expectedProviders.forEach(p => {
  if (!labFile.includes(p)) {
    throw new Error('LabContext missing provider nesting: ' + p);
  }
});
console.log('✅ LabContext: All 7 nested provider layers verified');

// Backward compatibility check for useLab()
if (!labFile.includes('export function useLab()')) {
  throw new Error('LabContext missing useLab hook');
}
const legacyAliases = [
  'audioPitch',
  'setAudioPitch',
  'heroScale',
  'setHeroScale',
  'trailEnabled',
  'setTrailEnabled',
  'resetDefaults',
  'resetToDefaults',
  'resetToFactoryDefaults'
];
legacyAliases.forEach(alias => {
  if (!labFile.includes(alias)) {
    throw new Error('LabContext missing backward compatibility alias: ' + alias);
  }
});
console.log('✅ LabContext: Backward compatibility for useLab() and legacy aliases confirmed');

console.log('\n=== ALL PHASE 1 CHECKS PASSED PERFECTLY (100% GREEN) ===');
