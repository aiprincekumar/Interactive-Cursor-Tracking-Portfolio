/**
 * Zero-Cloud On-Device Telemetry & Analytics Aggregator (Pure ESM Utility)
 * Collects local latency stats, token throughput, model routing distribution, domain tags,
 * and user satisfaction feedback without transmitting any telemetry off the user's browser.
 */

const ANALYTICS_STORAGE_KEY = 'atul_portfolio_ai_analytics_v1';

// Default initial state
function getDefaultState() {
  return {
    totalInteractions: 0,
    totalLatencyMs: 0,
    totalTokens: 0,
    streamingRuns: 0,
    modelDistribution: {
      'portfolio-engine': 0
    },
    domainBreakdown: {
      accounting: 0,
      mis: 0,
      ai: 0,
      projects: 0,
      tax: 0,
      career: 0,
      navigation: 0
    },
    feedback: {
      positive: 0,
      negative: 0,
      entries: []
    },
    latencyHistory: [], // last 20 samples for moving averages
    lastUpdated: new Date().toISOString()
  };
}

let memoryState = getDefaultState();

function isStorageAvailable() {
  try {
    return (
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined' &&
      window.localStorage !== null
    );
  } catch {
    return false;
  }
}

function loadState() {
  if (isStorageAvailable()) {
    try {
      const raw = window.localStorage.getItem(ANALYTICS_STORAGE_KEY);
      if (raw) {
        return { ...getDefaultState(), ...JSON.parse(raw) };
      }
    } catch {
      return memoryState;
    }
  }
  return memoryState;
}

function saveState(state) {
  memoryState = state;
  if (isStorageAvailable()) {
    try {
      window.localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore quota errors
    }
  }
}

/**
 * Records latency and token count for an assistant response
 * @param {number} latencyMs 
 * @param {string} modelId 
 * @param {number} tokensCount 
 */
export function recordMessageLatency(latencyMs = 0, modelId = 'portfolio-engine', tokensCount = 0) {
  const state = loadState();
  const safeLatency = Math.max(0, Number(latencyMs) || 0);
  const safeTokens = Math.max(0, Number(tokensCount) || 0);
  const safeModel = String(modelId || 'portfolio-engine');

  state.totalInteractions += 1;
  state.totalLatencyMs += safeLatency;
  state.totalTokens += safeTokens;

  if (safeTokens > 0) {
    state.streamingRuns += 1;
  }

  // Model routing tracking
  state.modelDistribution[safeModel] = (state.modelDistribution[safeModel] || 0) + 1;

  // Latency sliding window (max 20 samples)
  state.latencyHistory.push({
    timestamp: Date.now(),
    latencyMs: safeLatency,
    tokens: safeTokens,
    modelId: safeModel
  });
  if (state.latencyHistory.length > 20) {
    state.latencyHistory.shift();
  }

  state.lastUpdated = new Date().toISOString();
  saveState(state);
}

/**
 * Records user feedback (thumbs up / thumbs down) on assistant messages
 * @param {string} messageId 
 * @param {'up'|'down'|number} rating - 'up' | 1 for positive, 'down' | -1 for negative
 * @param {string} [notes] 
 */
export function recordMessageFeedback(messageId, rating, notes = '') {
  const state = loadState();
  const isPositive = rating === 'up' || rating === 1 || rating === true;
  
  if (isPositive) {
    state.feedback.positive += 1;
  } else {
    state.feedback.negative += 1;
  }

  state.feedback.entries.push({
    messageId: String(messageId || `msg_${Date.now()}`),
    rating: isPositive ? 1 : -1,
    notes: String(notes || '').slice(0, 120),
    timestamp: new Date().toISOString()
  });

  if (state.feedback.entries.length > 30) {
    state.feedback.entries.shift();
  }

  state.lastUpdated = new Date().toISOString();
  saveState(state);
}

/**
 * Records an interaction categorized by domain
 * @param {'accounting'|'mis'|'ai'|'projects'|'tax'|'career'|'navigation'|string} topic 
 */
export function recordDomainInteraction(topic = 'general') {
  const state = loadState();
  const safeTopic = String(topic).toLowerCase().trim() || 'general';
  state.domainBreakdown[safeTopic] = (state.domainBreakdown[safeTopic] || 0) + 1;
  state.lastUpdated = new Date().toISOString();
  saveState(state);
}

/**
 * Computes aggregated analytics summary
 * @returns {Object}
 */
export function getAnalyticsSummary() {
  const state = loadState();
  const total = state.totalInteractions || 0;
  const avgLatencyMs = total > 0 ? Math.round(state.totalLatencyMs / total) : 0;
  
  // Calculate tokens per second across streaming runs
  let tokensPerSec = 0;
  const streamingSamples = state.latencyHistory.filter((s) => s.tokens > 0 && s.latencyMs > 0);
  if (streamingSamples.length > 0) {
    const totalSampleTokens = streamingSamples.reduce((sum, s) => sum + s.tokens, 0);
    const totalSampleSecs = streamingSamples.reduce((sum, s) => sum + s.latencyMs, 0) / 1000;
    tokensPerSec = totalSampleSecs > 0 ? Number((totalSampleTokens / totalSampleSecs).toFixed(1)) : 0;
  } else if (state.totalTokens > 0 && state.totalLatencyMs > 0) {
    tokensPerSec = Number(((state.totalTokens / (state.totalLatencyMs / 1000))).toFixed(1));
  }

  const posFeedback = state.feedback.positive || 0;
  const negFeedback = state.feedback.negative || 0;
  const totalFeedback = posFeedback + negFeedback;
  const satisfactionRate = totalFeedback > 0 ? Math.round((posFeedback / totalFeedback) * 100) : 100;

  return {
    totalInteractions: total,
    totalTokens: state.totalTokens || 0,
    averageLatencyMs: avgLatencyMs,
    tokensPerSecond: tokensPerSec,
    modelDistribution: { ...state.modelDistribution },
    domainBreakdown: { ...state.domainBreakdown },
    feedbackStats: {
      positive: posFeedback,
      negative: negFeedback,
      total: totalFeedback
    },
    satisfactionRate,
    lastUpdated: state.lastUpdated
  };
}

/**
 * Returns human-readable markdown scorecard for slash commands and dashboard display
 * @returns {string}
 */
export function formatAnalyticsScorecard() {
  const summary = getAnalyticsSummary();
  const models = Object.entries(summary.modelDistribution)
    .map(([m, count]) => `  • **${m}**: ${count} queries`)
    .join('\n') || '  • No model telemetry recorded yet';

  const domains = Object.entries(summary.domainBreakdown)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([d, count]) => `  • **${d.toUpperCase()}**: ${count}`)
    .join('\n') || '  • General interactions';

  return `📊 **Client-Side AI Telemetry & Benchmark Scorecard**

🔒 *Zero-Cloud Telemetry: All performance metrics computed locally in browser memory.*

⚡ **Performance & Throughput**:
  • **Total Interactions**: ${summary.totalInteractions} queries
  • **Average Response Latency**: ${summary.averageLatencyMs} ms
  • **Total Tokens Generated**: ${summary.totalTokens} tokens
  • **Throughput Rate**: ${summary.tokensPerSecond} tokens/sec

🤖 **Model Routing Distribution**:
${models}

🌐 **Domain Inquiry Breakdown**:
${domains}

⭐ **User Satisfaction**:
  • **Rating Score**: ${summary.satisfactionRate}% positive
  • **Feedback Ratio**: 👍 ${summary.feedbackStats.positive} helpful / 👎 ${summary.feedbackStats.negative} unhelpful`;
}

/**
 * Resets local telemetry data
 */
export function resetAnalytics() {
  memoryState = getDefaultState();
  if (isStorageAvailable()) {
    try {
      window.localStorage.removeItem(ANALYTICS_STORAGE_KEY);
    } catch {
      // Ignore
    }
  }
}

export default {
  recordMessageLatency,
  recordMessageFeedback,
  recordDomainInteraction,
  getAnalyticsSummary,
  formatAnalyticsScorecard,
  resetAnalytics
};
