import React, { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';

/**
 * Fenced code block component with header bar, language badge,
 * monospaced typography, horizontal scroll, and 1-click clipboard copy.
 */
function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else if (typeof document !== 'undefined') {
        const textarea = document.createElement('textarea');
        textarea.value = code;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // safe fallback
    }
  };

  const displayLang = (language || 'code').trim().toLowerCase();

  return (
    <div className="my-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-[#161224] text-stone-100 overflow-hidden shadow-xs text-left">
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#1F172E] border-b border-stone-800 text-[10px] font-mono select-none">
        <span className="font-semibold uppercase tracking-wider text-stone-400">
          {displayLang}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? 'Code copied to clipboard' : 'Copy code'}
          title="Copy code"
          className="flex items-center gap-1 px-2 py-0.5 rounded text-stone-300 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-stone-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-3 overflow-x-auto">
        <pre className="font-mono text-[11px] leading-relaxed text-stone-200 whitespace-pre">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

/**
 * Tokenize and parse inline markdown elements:
 * - Links: [label](url)
 * - Inline code: `code`
 * - Bold: **text**
 * - Italics: *text*
 * - Bold-Italics: ***text***
 */
export function parseInlineMarkdown(text, isUser = false) {
  if (!text || typeof text !== 'string') return null;

  const pattern = /(\[[^\]]+\]\([^\s)]+\)|`[^`]+`|\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*)/g;

  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    const key = `inline-${match.index}-${lastIndex}`;

    if (token.startsWith('`') && token.endsWith('`') && token.length >= 2) {
      const codeContent = token.slice(1, -1);
      parts.push(
        <code
          key={key}
          className={
            isUser
              ? 'px-1.5 py-0.5 rounded bg-white/20 text-white font-mono text-[11px]'
              : 'px-1.5 py-0.5 rounded bg-stone-200/70 dark:bg-stone-800 text-[#FF4D6D] dark:text-[#FF758F] font-mono text-[11px]'
          }
        >
          {codeContent}
        </code>
      );
    } else if (token.startsWith('***') && token.endsWith('***') && token.length >= 6) {
      const inner = token.slice(3, -3);
      parts.push(
        <strong
          key={key}
          className={isUser ? 'font-bold text-white' : 'font-semibold text-stone-900 dark:text-stone-100'}
        >
          <em className="italic">{parseInlineMarkdown(inner, isUser)}</em>
        </strong>
      );
    } else if (token.startsWith('**') && token.endsWith('**') && token.length >= 4) {
      const inner = token.slice(2, -2);
      parts.push(
        <strong
          key={key}
          className={isUser ? 'font-bold text-white' : 'font-semibold text-stone-900 dark:text-stone-100'}
        >
          {parseInlineMarkdown(inner, isUser)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*') && token.length >= 2) {
      const inner = token.slice(1, -1);
      parts.push(
        <em key={key} className="italic">
          {parseInlineMarkdown(inner, isUser)}
        </em>
      );
    } else if (token.startsWith('[') && token.includes('](')) {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        const [, label, url] = linkMatch;
        const isSafe = /^(https?:\/\/|mailto:|tel:|#|\/)/i.test(url);
        const isExternal = /^https?:\/\//i.test(url);
        if (isSafe) {
          parts.push(
            <a
              key={key}
              href={url}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              className={
                isUser
                  ? 'text-white underline hover:opacity-85 inline-flex items-center gap-0.5 font-medium break-all'
                  : 'text-[#FF4D6D] dark:text-[#FF758F] underline hover:opacity-80 inline-flex items-center gap-0.5 font-medium break-all'
              }
            >
              <span>{label}</span>
              {isExternal && <ExternalLink className="w-2.5 h-2.5 inline-block shrink-0 opacity-80" />}
            </a>
          );
        } else {
          parts.push(label);
        }
      } else {
        parts.push(token);
      }
    } else {
      parts.push(token);
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length === 1 ? parts[0] : parts;
}

/**
 * Tokenizes markdown into blocks:
 * 1. Fenced code blocks (```lang\ncode\n```)
 * 2. Unordered/ordered lists (•, -, *, 1.)
 * 3. Paragraph lines with line break preservation
 */
export function parseBlocks(rawText) {
  if (!rawText || typeof rawText !== 'string') return [];

  const FENCED_CODE_REGEX = /```([a-zA-Z0-9_-]*)[ \t]*\r?\n([\s\S]*?)```/g;
  const rawBlocks = [];
  let lastIdx = 0;
  let match;

  while ((match = FENCED_CODE_REGEX.exec(rawText)) !== null) {
    if (match.index > lastIdx) {
      rawBlocks.push({ type: 'text', content: rawText.slice(lastIdx, match.index) });
    }
    rawBlocks.push({
      type: 'code',
      lang: match[1]?.trim() || 'code',
      code: match[2]?.replace(/\r\n/g, '\n').replace(/\n$/, '')
    });
    lastIdx = FENCED_CODE_REGEX.lastIndex;
  }
  if (lastIdx < rawText.length) {
    rawBlocks.push({ type: 'text', content: rawText.slice(lastIdx) });
  }

  const structuredBlocks = [];
  for (const block of rawBlocks) {
    if (block.type === 'code') {
      structuredBlocks.push(block);
    } else {
      const lines = block.content.split(/\r?\n/);
      let currentList = null;
      let currentParagraph = [];

      const flushParagraph = () => {
        if (currentParagraph.length > 0) {
          structuredBlocks.push({ type: 'paragraph', lines: [...currentParagraph] });
          currentParagraph = [];
        }
      };

      const flushList = () => {
        if (currentList && currentList.length > 0) {
          structuredBlocks.push({ type: 'list', items: [...currentList] });
          currentList = null;
        }
      };

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const listMatch = line.match(/^[\s]*([•\-*]|\d+\.)\s+(.+)$/);

        if (listMatch) {
          flushParagraph();
          if (!currentList) currentList = [];
          currentList.push(listMatch[2]);
        } else if (line.trim() === '') {
          flushList();
          flushParagraph();
        } else {
          flushList();
          currentParagraph.push(line);
        }
      }
      flushList();
      flushParagraph();
    }
  }

  return structuredBlocks;
}

/**
 * FormattedMessage: Lightweight zero-dependency React component that parses
 * Markdown safely without dangerouslySetInnerHTML.
 */
export default function FormattedMessage({ text = '', isUser = false, className = '' }) {
  if (!text) return null;

  const blocks = parseBlocks(text);

  if (blocks.length === 0) return null;

  return (
    <div className={`formatted-message space-y-1.5 ${className}`}>
      {blocks.map((block, bIdx) => {
        if (block.type === 'code') {
          return <CodeBlock key={`code-${bIdx}`} code={block.code} language={block.lang} />;
        }

        if (block.type === 'list') {
          return (
            <ul
              key={`list-${bIdx}`}
              className={
                isUser
                  ? 'pl-3 list-disc space-y-1 my-1 marker:text-white/80'
                  : 'pl-3 list-disc space-y-1 my-1.5 marker:text-[#FF4D6D] dark:marker:text-[#FF758F]'
              }
            >
              {block.items.map((item, iIdx) => (
                <li key={`item-${bIdx}-${iIdx}`} className="pl-0.5 leading-relaxed">
                  {parseInlineMarkdown(item, isUser)}
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === 'paragraph') {
          return (
            <div key={`p-${bIdx}`} className="leading-relaxed">
              {block.lines.map((line, lIdx) => (
                <React.Fragment key={`line-${bIdx}-${lIdx}`}>
                  {lIdx > 0 && <br />}
                  {parseInlineMarkdown(line, isUser)}
                </React.Fragment>
              ))}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
