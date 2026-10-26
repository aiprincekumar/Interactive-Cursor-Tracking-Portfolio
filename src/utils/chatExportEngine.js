/**
 * Chat Export Engine (Pure ESM Utility)
 * Zero external dependencies. Uses native Blob, URL.createObjectURL, and Clipboard API.
 * Supports Markdown, Plain Text, JSON, and Self-Contained HTML Print Formats.
 */

/**
 * Format messages into GitHub-flavored Markdown
 * @param {Array} messages 
 * @param {Object} metadata 
 * @returns {string}
 */
export function formatAsMarkdown(messages = [], metadata = {}) {
  const exportDate = metadata.exportedAt || new Date().toISOString();
  const sessionTitle = metadata.title || 'Portfolio Assistant Conversation';
  const role = metadata.role || 'overview';
  const audience = metadata.audience || 'all';
  const viewMode = metadata.viewMode || 'modern';
  const activeModel = metadata.activeModel || 'Portfolio Knowledge Engine (Offline RAG)';

  const lines = [
    `# 🤖 Atul Verma Portfolio Assistant — Chat Transcript`,
    ``,
    `> **Session Title**: ${sessionTitle}  `,
    `> **Exported Date**: ${exportDate}  `,
    `> **Audience**: ${audience} | **Career Track**: ${role} | **View Mode**: ${viewMode}  `,
    `> **Active Intelligence**: ${activeModel}  `,
    `> **Total Messages**: ${messages.length}`,
    ``,
    `---`,
    ``
  ];

  messages.forEach((msg, index) => {
    const isUser = msg.sender === 'user';
    const senderLabel = isUser ? '👤 User' : `🤖 Assistant [${msg.modelShortcut || activeModel}]`;
    const timeLabel = msg.timestamp ? `(${msg.timestamp})` : '';
    
    lines.push(`### ${index + 1}. ${senderLabel} ${timeLabel}`.trim());
    lines.push(``);
    lines.push(msg.text || '');
    lines.push(``);

    if (msg.feedback) {
      lines.push(`*User Feedback: ${msg.feedback === 'up' ? '👍 Helpful' : '👎 Unhelpful'}*`);
      lines.push(``);
    }
  });

  lines.push(`---`);
  lines.push(`*Exported securely via Atul Verma Interactive Portfolio Assistant (Zero-Cloud Client Storage)*`);
  return lines.join('\n');
}

/**
 * Format messages into Plain Text (TXT)
 * @param {Array} messages 
 * @param {Object} metadata 
 * @returns {string}
 */
export function formatAsTxt(messages = [], metadata = {}) {
  const exportDate = metadata.exportedAt || new Date().toISOString();
  const sessionTitle = metadata.title || 'Portfolio Assistant Conversation';
  const divider = '='.repeat(64);
  const subDivider = '-'.repeat(48);

  const lines = [
    divider,
    `ATUL VERMA PORTFOLIO ASSISTANT - TRANSCRIPT`,
    divider,
    `Session Title : ${sessionTitle}`,
    `Exported At   : ${exportDate}`,
    `Audience      : ${metadata.audience || 'all'}`,
    `Career Track  : ${metadata.role || 'overview'}`,
    `View Mode     : ${metadata.viewMode || 'modern'}`,
    `AI Model      : ${metadata.activeModel || 'Portfolio Knowledge Engine'}`,
    `Total Messages: ${messages.length}`,
    divider,
    ``
  ];

  messages.forEach((msg, index) => {
    const isUser = msg.sender === 'user';
    const sender = isUser ? '[USER]' : `[ASSISTANT - ${msg.modelShortcut || 'AI'}]`;
    const time = msg.timestamp ? ` @ ${msg.timestamp}` : '';
    lines.push(`[#${index + 1}] ${sender}${time}`);
    lines.push(msg.text || '');
    if (msg.feedback) {
      lines.push(`Rating: ${msg.feedback === 'up' ? '+1 (Helpful)' : '-1 (Unhelpful)'}`);
    }
    lines.push(subDivider);
    lines.push(``);
  });

  return lines.join('\n');
}

/**
 * Format messages into structured JSON
 * @param {Array} messages 
 * @param {Object} metadata 
 * @returns {string}
 */
export function formatAsJson(messages = [], metadata = {}) {
  const exportPayload = {
    schemaVersion: '1.0.0',
    generator: 'Atul Verma Portfolio AI Chat Assistant (Phase 9 Export Engine)',
    metadata: {
      title: metadata.title || 'Portfolio Assistant Conversation',
      sessionId: metadata.sessionId || null,
      exportedAt: metadata.exportedAt || new Date().toISOString(),
      role: metadata.role || 'overview',
      audience: metadata.audience || 'all',
      viewMode: metadata.viewMode || 'modern',
      activeModel: metadata.activeModel || 'Portfolio Knowledge Engine',
      totalMessages: messages.length,
      ...metadata
    },
    messages: messages.map((m) => ({
      id: m.id,
      sender: m.sender,
      text: m.text,
      timestamp: m.timestamp,
      modelShortcut: m.modelShortcut || null,
      feedback: m.feedback || null,
      hasActions: Boolean(m.actions?.length),
      actions: m.actions || []
    }))
  };

  return JSON.stringify(exportPayload, null, 2);
}

/**
 * Format messages into an elegant self-contained HTML page ready for browser viewing & printing
 * @param {Array} messages 
 * @param {Object} metadata 
 * @returns {string}
 */
export function formatAsHtml(messages = [], metadata = {}) {
  const exportDate = metadata.exportedAt || new Date().toLocaleString();
  const sessionTitle = metadata.title || 'Portfolio Assistant Conversation';
  const activeModel = metadata.activeModel || 'Portfolio Knowledge Engine';

  const safeEscape = (str = '') =>
    String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  const messageItemsHtml = messages
    .map((msg, index) => {
      const isUser = msg.sender === 'user';
      const senderBadge = isUser
        ? `<span class="badge user-badge">👤 User</span>`
        : `<span class="badge bot-badge">🤖 Assistant (${safeEscape(msg.modelShortcut || activeModel)})</span>`;
      
      const feedbackBadge = msg.feedback
        ? `<div class="feedback-badge">${msg.feedback === 'up' ? '👍 Helpful' : '👎 Needs Improvement'}</div>`
        : '';

      return `
        <article class="message-card ${isUser ? 'user-card' : 'bot-card'}">
          <header class="message-header">
            ${senderBadge}
            <time class="message-time">${safeEscape(msg.timestamp || `#${index + 1}`)}</time>
          </header>
          <div class="message-body">
            ${safeEscape(msg.text).replace(/\n/g, '<br/>')}
          </div>
          ${feedbackBadge}
        </article>
      `;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeEscape(sessionTitle)} - Atul Verma Portfolio AI Transcript</title>
  <style>
    :root {
      --bg: #0f172a;
      --card-bg: #1e293b;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --accent: #ff4d6d;
      --user-bg: #1e1b4b;
      --user-border: #4338ca;
      --bot-bg: #1e293b;
      --bot-border: #334155;
    }
    @media (prefers-color-scheme: light) {
      :root {
        --bg: #f8fafc;
        --card-bg: #ffffff;
        --text: #0f172a;
        --text-muted: #64748b;
        --accent: #e11d48;
        --user-bg: #eef2ff;
        --user-border: #c7d2fe;
        --bot-bg: #f1f5f9;
        --bot-border: #cbd5e1;
      }
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      padding: 2rem 1rem;
    }
    .container {
      max-width: 760px;
      margin: 0 auto;
    }
    .header {
      background: var(--card-bg);
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      border: 1px solid var(--bot-border);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .title {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--accent);
      margin-bottom: 0.5rem;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 0.5rem;
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: 1rem;
    }
    .messages-list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .message-card {
      border-radius: 12px;
      padding: 1rem 1.25rem;
      border: 1px solid;
    }
    .user-card {
      background: var(--user-bg);
      border-color: var(--user-border);
      margin-left: 1.5rem;
    }
    .bot-card {
      background: var(--bot-bg);
      border-color: var(--bot-border);
      margin-right: 1.5rem;
    }
    .message-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
      font-size: 0.8rem;
    }
    .badge {
      font-weight: 600;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      display: inline-block;
    }
    .user-badge { background: rgba(99, 102, 241, 0.2); color: #818cf8; }
    .bot-badge { background: rgba(255, 77, 109, 0.2); color: var(--accent); }
    .message-time { color: var(--text-muted); }
    .message-body {
      white-space: pre-wrap;
      word-break: break-word;
      font-size: 0.95rem;
    }
    .feedback-badge {
      margin-top: 0.5rem;
      font-size: 0.75rem;
      color: var(--text-muted);
      font-style: italic;
    }
    .footer {
      text-align: center;
      margin-top: 3rem;
      font-size: 0.8rem;
      color: var(--text-muted);
    }
    @media print {
      body { background: #fff !important; color: #000 !important; padding: 0; }
      .container { max-width: 100%; }
      .header, .message-card { box-shadow: none; border: 1px solid #ddd; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header class="header">
      <h1 class="title">🤖 Atul Verma Portfolio Assistant</h1>
      <p>Transcript of session: <strong>${safeEscape(sessionTitle)}</strong></p>
      <div class="meta-grid">
        <div><strong>Date:</strong> ${safeEscape(exportDate)}</div>
        <div><strong>Audience:</strong> ${safeEscape(metadata.audience || 'all')}</div>
        <div><strong>Role Track:</strong> ${safeEscape(metadata.role || 'overview')}</div>
        <div><strong>AI Engine:</strong> ${safeEscape(activeModel)}</div>
        <div><strong>Messages:</strong> ${messages.length}</div>
      </div>
    </header>

    <main class="messages-list">
      ${messageItemsHtml}
    </main>

    <footer class="footer">
      Generated directly by Atul Verma's On-Device Client Portfolio Assistant. Zero server logging.
    </footer>
  </div>
</body>
</html>`;
}

/**
 * Primary export dispatcher. Converts transcript to selected format and triggers download if running in a browser.
 * @param {Array} messages 
 * @param {'markdown'|'txt'|'json'|'html'} format 
 * @param {Object} metadata 
 * @returns {{ success: boolean, format: string, filename: string, content: string, mimeType: string }}
 */
export function exportTranscript(messages = [], format = 'markdown', metadata = {}) {
  const normFormat = String(format || 'markdown').toLowerCase().trim();
  const dateStr = new Date().toISOString().slice(0, 10);
  let content = '';
  let filename = `atul-verma-chat-transcript-${dateStr}`;
  let mimeType = 'text/plain;charset=utf-8';

  switch (normFormat) {
    case 'json':
      content = formatAsJson(messages, metadata);
      filename += '.json';
      mimeType = 'application/json;charset=utf-8';
      break;
    case 'txt':
    case 'text':
      content = formatAsTxt(messages, metadata);
      filename += '.txt';
      mimeType = 'text/plain;charset=utf-8';
      break;
    case 'html':
      content = formatAsHtml(messages, metadata);
      filename += '.html';
      mimeType = 'text/html;charset=utf-8';
      break;
    case 'markdown':
    case 'md':
    default:
      content = formatAsMarkdown(messages, metadata);
      filename += '.md';
      mimeType = 'text/markdown;charset=utf-8';
      break;
  }

  // Trigger client-side download if running in DOM environment
  if (typeof window !== 'undefined' && typeof document !== 'undefined' && typeof Blob !== 'undefined') {
    try {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      // In constrained environments, fallback silently
    }
  }

  return {
    success: true,
    format: normFormat,
    filename,
    content,
    mimeType
  };
}

/**
 * Copies transcript directly to user clipboard in formatted markdown
 * @param {Array} messages 
 * @param {Object} metadata 
 * @returns {Promise<{ success: boolean, content: string }>}
 */
export async function copyTranscriptToClipboard(messages = [], metadata = {}) {
  const content = formatAsMarkdown(messages, metadata);
  let success = false;

  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(content);
      success = true;
    } catch {
      success = false;
    }
  }

  return { success, content };
}

export default {
  exportTranscript,
  copyTranscriptToClipboard,
  formatAsMarkdown,
  formatAsTxt,
  formatAsJson,
  formatAsHtml
};
