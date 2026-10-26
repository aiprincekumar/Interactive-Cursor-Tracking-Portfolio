/**
 * Portfolio Semantic Index & Multi-Faceted Search Engine (Phase 10 Capstone)
 * Indexes search catalog, verified case studies, skills matrix, and authoritative FAQs
 * with fuzzy token matching, relevance scoring, categorization, and 1-click action triggers.
 */

import { SEARCH_ITEMS } from './searchCatalog.js';
import { CASE_STUDIES } from '../data/caseStudiesData.js';
import { SKILL_DATA, SKILLS_DATA } from '../data/skillsData.js';
import { FAQ_ITEMS } from '../data/faqConfig.js';

let cachedCorpus = null;

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'in', 'on', 'at', 'to', 'for', 'of', 'and', 'or', 'is', 'are', 'was',
  'with', 'by', 'from', 'about', 'how', 'what', 'where', 'who', 'show', 'tell', 'me', 'can',
  'you', 'please', 'i', 'my', 'do', 'does'
]);

/**
 * Tokenizes and cleans a search query string
 * @param {string} text
 * @returns {string[]} tokens
 */
export function tokenizeQuery(text) {
  if (!text || typeof text !== 'string') return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F-]/g, ' ')
    .split(/\s+/)
    .map(t => t.trim())
    .filter(t => t.length > 0 && !STOP_WORDS.has(t));
}

/**
 * Builds unified semantic search corpus across all portfolio entities
 * @returns {Array<Object>} indexed items
 */
export function buildSemanticCorpus() {
  if (cachedCorpus) return cachedCorpus;

  const corpus = [];
  const seenIds = new Set();

  // 1. Index Case Studies (Projects)
  if (Array.isArray(CASE_STUDIES)) {
    for (const cs of CASE_STUDIES) {
      const id = `cs-${cs.id}`;
      seenIds.add(id);

      const techList = Array.isArray(cs.techStack) ? cs.techStack.join(' ') : '';
      const metricsList = Array.isArray(cs.metrics)
        ? cs.metrics.map(m => `${m.label || ''} ${m.val || ''}`).join(' ')
        : '';

      corpus.push({
        id,
        caseStudyId: cs.id,
        entityType: 'case_study',
        title: cs.title,
        title_hi: cs.title_hi || '',
        category: 'Projects',
        badge: cs.trackBadge || 'Flagship Project',
        description: cs.summary || cs.subtitle || '',
        role: cs.role || 'both',
        targetId: cs.targetId || 'projects',
        keywords: [
          cs.title,
          cs.subtitle,
          cs.summary,
          cs.category,
          techList,
          metricsList,
          `case study ${cs.id}`,
          `project ${cs.id}`,
          `cs ${cs.id}`
        ].filter(Boolean).join(' ').toLowerCase(),
        action: {
          type: 'open-case-study',
          payload: { id: cs.id },
          label: `Open Case Study ${cs.id}`
        }
      });
    }
  }

  // 2. Index Skills Matrix
  const rawSkills = SKILL_DATA || SKILLS_DATA || {};
  for (const [skillKey, skill] of Object.entries(rawSkills)) {
    const id = `skill-${skillKey.toLowerCase().replace(/[^\w]/g, '-')}`;
    if (!seenIds.has(id)) {
      seenIds.add(id);
      const pointsText = Array.isArray(skill.points) ? skill.points.join(' ') : '';

      corpus.push({
        id,
        entityType: 'skill',
        title: skill.title || skillKey,
        title_hi: skill.title_hi || '',
        category: 'Skills',
        badge: skill.tag || 'Expertise',
        description: pointsText || skill.tag || '',
        role: skill.category?.includes('Accounting') ? 'accountant' : skill.category?.includes('MIS') ? 'mis' : 'both',
        targetId: 'skills',
        keywords: [
          skillKey,
          skill.title,
          skill.category,
          skill.tag,
          pointsText
        ].filter(Boolean).join(' ').toLowerCase(),
        action: {
          type: 'scroll',
          target: '#skills',
          payload: { selector: '#skills' },
          label: `View ${skill.title || skillKey} in Skills`
        }
      });
    }
  }

  // 3. Index Global Search Catalog Items
  if (Array.isArray(SEARCH_ITEMS)) {
    for (const item of SEARCH_ITEMS) {
      if (!seenIds.has(item.id)) {
        seenIds.add(item.id);

        let actionObj;
        if (item.actionType === 'download-resume') {
          actionObj = { type: 'download-resume', label: 'Download Verified Resume' };
        } else if (item.actionType === 'open-case-study' || item.caseStudyId) {
          actionObj = {
            type: 'open-case-study',
            payload: { id: item.caseStudyId || '01' },
            label: `Open Case Study ${item.caseStudyId || '01'}`
          };
        } else if (item.actionType === 'mailto' || item.actionType === 'external') {
          actionObj = {
            type: 'link',
            payload: { url: item.actionUrl },
            label: item.title
          };
        } else {
          const rawTarget = item.targetId || 'hero';
          const selector = rawTarget.startsWith('#') ? rawTarget : `#${rawTarget}`;
          actionObj = {
            type: 'scroll',
            target: selector,
            payload: { selector },
            label: `Go to ${item.title}`
          };
        }

        corpus.push({
          id: item.id,
          entityType: item.category === 'Actions' ? 'action' : 'catalog',
          title: item.title,
          category: item.category || 'General',
          badge: item.badge || item.matchType || 'Portfolio',
          description: item.description || '',
          role: item.role || 'both',
          targetId: item.targetId || 'hero',
          keywords: [
            item.title,
            item.description,
            item.keywords,
            item.category,
            item.matchType
          ].filter(Boolean).join(' ').toLowerCase(),
          action: actionObj
        });
      }
    }
  }

  // 4. Index FAQs
  if (Array.isArray(FAQ_ITEMS)) {
    for (const faq of FAQ_ITEMS) {
      const id = `faq-${faq.id}`;
      if (!seenIds.has(id)) {
        seenIds.add(id);

        let actionObj = {
          type: 'scroll',
          target: '#faq',
          payload: { selector: '#faq' },
          label: 'View in FAQ'
        };

        if (faq.actionCTA) {
          if (faq.actionCTA.type === 'case_study') {
            actionObj = {
              type: 'open-case-study',
              payload: { id: faq.actionCTA.target },
              label: faq.actionCTA.label || 'Open Case Study'
            };
          } else if (faq.actionCTA.type === 'quote') {
            actionObj = {
              type: 'open-estimator',
              label: faq.actionCTA.label || 'Quotation Calculator'
            };
          } else if (faq.actionCTA.type === 'contact') {
            actionObj = {
              type: 'scroll',
              target: '#contact',
              payload: { selector: '#contact' },
              label: faq.actionCTA.label || 'Contact Atul'
            };
          }
        }

        corpus.push({
          id,
          entityType: 'faq',
          title: faq.question,
          title_hi: faq.question_hi || '',
          category: 'FAQ',
          badge: faq.categoryTag || 'FAQ',
          description: faq.answer,
          role: Array.isArray(faq.role) ? faq.role.join(' ') : faq.role || 'both',
          targetId: 'faq',
          keywords: [
            faq.question,
            faq.question_hi,
            faq.answer,
            faq.answer_hi,
            faq.categoryTag
          ].filter(Boolean).join(' ').toLowerCase(),
          action: actionObj
        });
      }
    }
  }

  cachedCorpus = corpus;
  return cachedCorpus;
}

/**
 * Calculates a matching relevance score for an indexed item given query tokens
 */
function scoreItem(item, queryLower, tokens) {
  let score = 0;
  const titleLower = (item.title || '').toLowerCase();
  const descLower = (item.description || '').toLowerCase();
  const kwLower = item.keywords || '';
  const categoryLower = (item.category || '').toLowerCase();

  // 1. Exact Full Phrase Bonus
  if (queryLower.length >= 3) {
    if (titleLower.includes(queryLower)) score += 60;
    else if (descLower.includes(queryLower)) score += 30;
    else if (kwLower.includes(queryLower)) score += 20;
  }

  // 2. Token Matching
  for (const token of tokens) {
    if (token.length <= 1) continue;

    // Exact title match
    if (titleLower.includes(token)) {
      score += 25;
      if (titleLower.startsWith(token)) score += 10;
    }

    // Category match
    if (categoryLower.includes(token)) {
      score += 15;
    }

    // Description match
    if (descLower.includes(token)) {
      score += 12;
    }

    // General keyword index
    if (kwLower.includes(token)) {
      score += 8;
    }

    // Prefix fuzzy match for tokens 3+ chars
    if (token.length >= 3) {
      const prefix = token.slice(0, 3);
      if (titleLower.includes(prefix)) score += 4;
      if (kwLower.includes(prefix)) score += 2;
    }
  }

  // Entity specific boosts
  if (item.entityType === 'case_study') score += 5;
  if (item.entityType === 'action') score += 3;

  return score;
}

/**
 * Searches portfolio across case studies, skills, actions, and FAQs with multi-token fuzzy scoring.
 * @param {string} query
 * @param {Object} options
 * @param {number} [options.limit=5]
 * @param {string} [options.category]
 * @param {string} [options.role]
 * @param {number} [options.threshold=15]
 * @returns {Array<Object>} sorted matching results with action links
 */
export function searchPortfolio(query, options = {}) {
  const safeQuery = typeof query === 'string' ? query.trim() : '';
  if (!safeQuery) return [];

  const limit = options.limit && options.limit > 0 ? options.limit : 5;
  const threshold = options.threshold !== undefined ? options.threshold : 15;
  const targetCategory = options.category ? options.category.toLowerCase() : null;
  const targetRole = options.role ? options.role.toLowerCase() : null;

  const corpus = buildSemanticCorpus();
  const queryLower = safeQuery.toLowerCase();
  const tokens = tokenizeQuery(safeQuery);

  if (tokens.length === 0 && queryLower.length < 2) return [];

  const scored = [];

  for (const item of corpus) {
    // Optional category filter
    if (targetCategory && (item.category || '').toLowerCase() !== targetCategory) {
      continue;
    }

    // Optional role filter (preserve 'both')
    if (targetRole && targetRole !== 'both' && targetRole !== 'all') {
      const itemRole = (item.role || '').toLowerCase();
      if (itemRole !== 'both' && !itemRole.includes(targetRole) && !itemRole.includes('overview')) {
        continue;
      }
    }

    const score = scoreItem(item, queryLower, tokens);
    if (score >= threshold) {
      scored.push({
        ...item,
        score
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

/**
 * Returns corpus for external inspection or diagnostics
 */
export function getSemanticIndex() {
  return buildSemanticCorpus();
}
