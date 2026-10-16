/**
 * Smart Fuzzy Search & Levenshtein Spelling Tolerance Engine
 * Optimized for Atul Kant Verma's Portfolio Index
 */

// Common typo & alias dictionary for zero-latency normalization
export const ALIAS_MAP = {
  taly: 'tally',
  talli: 'tally',
  tallyp: 'tally prime',
  excl: 'excel',
  excle: 'excel',
  xcel: 'excel',
  incometx: 'income tax',
  incomtax: 'income tax',
  inctax: 'income tax',
  acounting: 'accounting',
  acount: 'accounting',
  acounts: 'accounting',
  accnt: 'accounting',
  photoshp: 'photoshop',
  photoshp7: 'photoshop 7.0',
  pshop: 'photoshop',
  corel: 'coreldraw',
  coreldrw: 'coreldraw',
  pagemakr: 'pagemaker',
  pgmaker: 'pagemaker',
  dalton: 'daltonganj',
  daltongnj: 'daltonganj',
  palamau: 'palamu',
  plamu: 'palamu',
  garhwa: 'garhwa',
  latehar: 'latehar',
  chatra: 'chatra',
  nulm: 'day-nulm',
  daynulm: 'day-nulm',
  biometrc: 'biometric',
  biometrics: 'biometric',
  aadhaar: 'aadhaar',
  aadhar: 'aadhaar',
  adhar: 'aadhaar',
  uidai: 'uidai',
  vlook: 'vlookup',
  vlookp: 'vlookup',
  hlook: 'hlookup',
  hlookp: 'hlookup',
  'p&l': 'profit & loss',
  pnl: 'profit & loss',
  brs: 'bank reconciliation',
  itc: 'itc-2b',
  itc2b: 'itc-2b',
  gstr: 'gstr',
  gstr1: 'gstr-1',
  gstr3b: 'gstr-3b',
  gstr9: 'gstr-9',
  gstr2a: 'gstr-2a',
  rsby: 'rsby',
  hsn: 'hsn code',
  tds: 'tds',
  '80c': 'section 80c',
  sec80c: 'section 80c',
  curser: 'cursor',
  curserlab: 'physics lab',
  resum: 'resume',
  resme: 'resume',
  watsapp: 'whatsapp',
  whatsap: 'whatsapp'
};

/**
 * Compute Levenshtein distance between two strings
 * Handles small typos (Levenshtein <= 2)
 */
export function levenshteinDistance(s1, s2) {
  if (s1 === s2) return 0;
  const len1 = s1.length;
  const len2 = s2.length;
  if (len1 === 0) return len2;
  if (len2 === 0) return len1;

  // If length diff is greater than tolerance, return diff
  if (Math.abs(len1 - len2) > 2) return Math.abs(len1 - len2);

  let prevRow = new Array(len2 + 1);
  let currRow = new Array(len2 + 1);

  for (let j = 0; j <= len2; j++) {
    prevRow[j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    currRow[0] = i;
    const c1 = s1.charCodeAt(i - 1);
    for (let j = 1; j <= len2; j++) {
      const c2 = s2.charCodeAt(j - 1);
      const cost = c1 === c2 ? 0 : 1;
      currRow[j] = Math.min(
        currRow[j - 1] + 1,       // insertion
        prevRow[j] + 1,           // deletion
        prevRow[j - 1] + cost     // substitution
      );
    }
    for (let j = 0; j <= len2; j++) {
      prevRow[j] = currRow[j];
    }
  }

  return currRow[len2];
}

/**
 * Check if a single query token matches words within a text corpus
 */
function tokenMatchesCorpus(token, textCorpus, corpusWords) {
  // 1. Direct substring match (fastest)
  if (textCorpus.includes(token)) {
    return { match: true, exact: true, score: 25 };
  }

  // 2. Check alias map match
  const alias = ALIAS_MAP[token];
  if (alias && textCorpus.includes(alias)) {
    return { match: true, exact: true, score: 22 };
  }

  // 3. For short tokens (< 3 chars), require exact prefix or substring match
  if (token.length < 3) {
    return { match: false, exact: false, score: 0 };
  }

  // 4. Check word-level fuzzy match (Levenshtein <= 2)
  const maxAllowedDist = token.length <= 4 ? 1 : 2;

  for (const word of corpusWords) {
    // Exact word or prefix match
    if (word === token || word.startsWith(token)) {
      return { match: true, exact: true, score: 20 };
    }

    // Levenshtein distance check on word
    const dist = levenshteinDistance(token, word);
    if (dist <= maxAllowedDist) {
      return { match: true, exact: false, score: 15 - dist * 3 };
    }
  }

  return { match: false, exact: false, score: 0 };
}

/**
 * Filter and score catalog items with fuzzy tolerance & multi-token matching
 */
export function searchCatalogItems(items, query, selectedCategory = 'All') {
  // Filter by category tab first
  let candidates = items;
  if (selectedCategory !== 'All') {
    candidates = candidates.filter((item) => item.category === selectedCategory);
  }

  const rawQuery = query.trim().toLowerCase();
  if (!rawQuery) {
    return candidates.map((item) => ({ ...item, isExactMatch: false, searchScore: 0 }));
  }

  const tokens = rawQuery.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) {
    return candidates.map((item) => ({ ...item, isExactMatch: false, searchScore: 0 }));
  }

  const results = [];

  for (const item of candidates) {
    const titleLower = (item.title || '').toLowerCase();
    const descLower = (item.description || '').toLowerCase();
    const keywordsLower = (item.keywords || '').toLowerCase();
    const badgeLower = (item.badge || '').toLowerCase();
    const matchTypeLower = (item.matchType || '').toLowerCase();
    const categoryLower = (item.category || '').toLowerCase();

    // Composite searchable corpus
    const fullCorpus = `${titleLower} ${descLower} ${keywordsLower} ${badgeLower} ${matchTypeLower} ${categoryLower}`;
    const words = fullCorpus.replace(/[^a-z0-9+#.\-_]/g, ' ').split(/\s+/).filter((w) => w.length >= 2);

    let allTokensMatched = true;
    let itemScore = 0;
    let hasExactPhrase = false;

    // Check full query phrase exact match
    if (fullCorpus.includes(rawQuery) || (ALIAS_MAP[rawQuery] && fullCorpus.includes(ALIAS_MAP[rawQuery]))) {
      hasExactPhrase = true;
      itemScore += 50;
      if (titleLower.includes(rawQuery)) itemScore += 40;
      if (keywordsLower.includes(rawQuery)) itemScore += 30;
      if (badgeLower.includes(rawQuery) || matchTypeLower.includes(rawQuery)) itemScore += 25;
    }

    // Check each token
    for (const token of tokens) {
      const matchResult = tokenMatchesCorpus(token, fullCorpus, words);
      if (!matchResult.match) {
        allTokensMatched = false;
        break;
      }
      itemScore += matchResult.score;

      // Bonus if matched specifically in title
      if (titleLower.includes(token)) itemScore += 15;
      // Bonus if matched in badge or matchType
      if (badgeLower.includes(token) || matchTypeLower.includes(token)) itemScore += 12;
    }

    if (allTokensMatched) {
      // Determine if this is an "Exact Match"
      const isExactMatch = hasExactPhrase || tokens.some((t) => {
        return titleLower.includes(t) || 
               keywordsLower.split(/\s+/).includes(t) || 
               badgeLower.toLowerCase() === t ||
               (ALIAS_MAP[t] && (titleLower.includes(ALIAS_MAP[t]) || keywordsLower.includes(ALIAS_MAP[t])));
      });

      // Quick actions boost when relevant
      if (item.category === 'Actions') {
        itemScore += 8;
      }

      results.push({
        ...item,
        isExactMatch,
        searchScore: itemScore
      });
    }
  }

  // Sort by search score descending
  results.sort((a, b) => b.searchScore - a.searchScore);

  return results;
}
