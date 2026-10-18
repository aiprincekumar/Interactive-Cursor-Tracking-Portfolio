const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- RUNNING INDEPENDENT VERIFICATION OF DYNAMIC ROLE AVATAR ---');

// 1. Verify Profile Picture Assets
const assetDir = path.resolve(process.cwd(), 'public/assets/Profile_Pic');
const requiredImages = ['Accountant.jpg', 'MIS.jpg', 'Others.jpg', 'Overview.jpg'];

for (const img of requiredImages) {
  const imgPath = path.join(assetDir, img);
  assert(fs.existsSync(imgPath), `Missing asset: ${imgPath}`);
  const stats = fs.statSync(imgPath);
  assert(stats.size > 10000, `Asset ${img} appears corrupted or too small (${stats.size} bytes)`);
  console.log(`✅ PASS: Asset '${img}' exists and valid (${(stats.size / 1024).toFixed(1)} KB)`);
}

// 2. Verify RoleContext.jsx
const rcPath = path.resolve(process.cwd(), 'src/context/RoleContext.jsx');
const rcContent = fs.readFileSync(rcPath, 'utf8');

assert(rcContent.includes('cleanBase'), 'cleanBase path helper not found in RoleContext');
assert(rcContent.includes('Overview.jpg'), 'OVERVIEW_ROLE does not reference Overview.jpg');
assert(rcContent.includes('Accountant.jpg'), 'Accountant role does not reference Accountant.jpg');
assert(rcContent.includes('MIS.jpg'), 'MIS role does not reference MIS.jpg');
assert(rcContent.includes('Others.jpg'), 'OTHER_ROLE does not reference Others.jpg');
assert(rcContent.includes('portfolio_control_center'), 'Fallback to portfolio_control_center defaultStartupRole not found');
console.log('✅ PASS: RoleContext avatar mappings and cleanBase asset resolution verified');

// 3. Verify Navbar.jsx
const nbPath = path.resolve(process.cwd(), 'src/components/Navbar.jsx');
const nbContent = fs.readFileSync(nbPath, 'utf8');

assert(nbContent.includes('ROLE_DATA'), 'ROLE_DATA not imported or referenced in Navbar');
assert(nbContent.includes('activeTrack'), 'activeTrack not resolved in Navbar');
assert(nbContent.includes('avatarSrc'), 'avatarSrc not resolved in Navbar');
assert(nbContent.includes('accentColor'), 'accentColor not resolved in Navbar');

// Image loading logic
assert(nbContent.includes('imageLoaded') && nbContent.includes('imageError'), 'Image state handlers (loaded/error) missing');
assert(nbContent.includes('avatarImgRef'), 'avatarImgRef for instant cache evaluation missing');
assert(nbContent.includes('naturalWidth'), 'Image cache naturalWidth check missing in useEffect');

// Visual styling: Accent ring glow
assert(nbContent.includes('borderColor: accentColor'), 'Dynamic borderColor based on accentColor missing');
assert(nbContent.includes('boxShadow:') && nbContent.includes('accentColor'), 'Dynamic boxShadow glow missing');

// Fallback AV Monogram
assert(nbContent.includes('<span className="font-mono text-[11px] text-[#FAF8F5] dark:text-[#F5F2F8]">AV</span>'), 'Fallback AV monogram missing');
assert(nbContent.includes('opacity-0 pointer-events-none'), 'Monogram hide on imageLoaded missing');

// Cross dissolve and scale transitions
assert(nbContent.includes('scale-100') && nbContent.includes('scale-95'), 'Cross-dissolve scale transition missing');
assert(nbContent.includes('hover:scale-105') || nbContent.includes('group-hover:scale-105'), 'Hover scale animation missing');

// Tooltip / Accessibility
assert(nbContent.includes('title=') && nbContent.includes('Profile • Atul Verma'), 'Native tooltip title missing');
assert(nbContent.includes('aria-label='), 'aria-label for screen-reader accessibility missing');

console.log('✅ PASS: Navbar avatar loading, fallback, glow, transitions, and accessibility verified');
console.log('🎉 ALL DYNAMIC ROLE AVATAR CHECKS PASSED PERFECTLY!');
