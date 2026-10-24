"use client";

import React from "react";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content || content.trim().length === 0) {
    return (
      <div className="p-8 rounded-xl border border-dashed border-[var(--line)] text-center text-xs font-mono text-[var(--muted)]">
        No README documentation provided for this repository yet.
      </div>
    );
  }

  // Pre-split lines and parse blocks cleanly
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeBlockLang = "";
  let codeBlockLines: string[] = [];
  let listItems: string[] = [];

  const flushList = (key: string) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key} className="list-disc list-inside space-y-1.5 my-3 pl-2 text-sm text-[var(--muted)] font-sans">
          {listItems.map((item, i) => (
            <li key={i} className="leading-relaxed">
              {parseInlineMarkdown(item)}
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  const flushCodeBlock = (key: string) => {
    if (inCodeBlock) {
      elements.push(
        <div key={key} className="my-4 rounded-xl overflow-hidden border border-[var(--line)] bg-[var(--surface-card)]">
          {codeBlockLang && (
            <div className="px-4 py-1.5 border-b border-[var(--line)] text-[11px] font-mono text-[var(--accent)] bg-[var(--surface)]">
              {codeBlockLang}
            </div>
          )}
          <pre className="p-4 text-xs font-mono overflow-x-auto text-[var(--ink)] leading-relaxed">
            <code>{codeBlockLines.join("\n")}</code>
          </pre>
        </div>
      );
      codeBlockLines = [];
      inCodeBlock = false;
      codeBlockLang = "";
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Check code blocks
    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        flushCodeBlock(`code-block-${index}`);
      } else {
        flushList(`list-before-code-${index}`);
        inCodeBlock = true;
        codeBlockLang = trimmed.replace("```", "").trim();
        codeBlockLines = [];
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      return;
    }

    // Check unordered lists
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      listItems.push(trimmed.slice(2));
      return;
    } else {
      flushList(`list-${index}`);
    }

    // Headings
    if (trimmed.startsWith("# ")) {
      elements.push(
        <h1 key={`h1-${index}`} className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink)] mt-6 mb-3">
          {parseInlineMarkdown(trimmed.slice(2))}
        </h1>
      );
      return;
    }

    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={`h2-${index}`} className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--ink)] mt-6 mb-3 pb-2 border-b border-[var(--line)]">
          {parseInlineMarkdown(trimmed.slice(3))}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={`h3-${index}`} className="text-lg sm:text-xl font-semibold text-[var(--ink)] mt-5 mb-2">
          {parseInlineMarkdown(trimmed.slice(4))}
        </h3>
      );
      return;
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      elements.push(
        <blockquote key={`quote-${index}`} className="border-l-2 border-[var(--accent)] pl-4 py-1 my-3 text-sm italic text-[var(--muted)]">
          {parseInlineMarkdown(trimmed.slice(2))}
        </blockquote>
      );
      return;
    }

    // Horizontal rule
    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      elements.push(<hr key={`hr-${index}`} className="my-6 border-[var(--line)]" />);
      return;
    }

    // Images
    const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) {
      const alt = imgMatch[1];
      const src = imgMatch[2];
      elements.push(
        <div key={`img-${index}`} className="my-5 rounded-xl overflow-hidden border border-[var(--line)] bg-[var(--surface-card)]">
          <img
            src={src}
            alt={alt || "Project preview"}
            className="w-full max-h-[480px] object-contain mx-auto"
            loading="lazy"
          />
          {alt && (
            <p className="p-2 text-center text-xs font-mono text-[var(--muted)] border-t border-[var(--line)]">
              {alt}
            </p>
          )}
        </div>
      );
      return;
    }

    // Empty lines
    if (trimmed.length === 0) {
      return;
    }

    // Regular paragraphs
    elements.push(
      <p key={`p-${index}`} className="text-sm sm:text-base leading-relaxed text-[var(--muted)] my-2.5 font-sans">
        {parseInlineMarkdown(line)}
      </p>
    );
  });

  flushList("list-end");
  flushCodeBlock("code-end");

  return <div className="space-y-1">{elements}</div>;
}

/**
 * Parses inline elements: `code`, **bold**, *italic*, and [links](url)
 */
function parseInlineMarkdown(text: string): React.ReactNode {
  // Regex to split tokens
  const parts: React.ReactNode[] = [];
  let remaining = text;

  let keyIndex = 0;
  while (remaining.length > 0) {
    // Check for inline link: [text](url)
    const linkMatch = remaining.match(/\[(.*?)\]\((.*?)\)/);
    // Check for inline code: `code`
    const codeMatch = remaining.match(/`(.*?)`/);
    // Check for bold: **bold**
    const boldMatch = remaining.match(/\*\*(.*?)\*\*/);

    let earliestMatch: { type: "link" | "code" | "bold"; index: number; match: RegExpMatchArray } | null = null;

    if (linkMatch && linkMatch.index !== undefined) {
      earliestMatch = { type: "link", index: linkMatch.index, match: linkMatch };
    }
    if (codeMatch && codeMatch.index !== undefined) {
      if (!earliestMatch || codeMatch.index < earliestMatch.index) {
        earliestMatch = { type: "code", index: codeMatch.index, match: codeMatch };
      }
    }
    if (boldMatch && boldMatch.index !== undefined) {
      if (!earliestMatch || boldMatch.index < earliestMatch.index) {
        earliestMatch = { type: "bold", index: boldMatch.index, match: boldMatch };
      }
    }

    if (!earliestMatch) {
      parts.push(remaining);
      break;
    }

    if (earliestMatch.index > 0) {
      parts.push(remaining.substring(0, earliestMatch.index));
    }

    const m = earliestMatch.match;
    if (earliestMatch.type === "link") {
      parts.push(
        <a
          key={`link-${keyIndex++}`}
          href={m[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--accent)] hover:underline font-medium inline-flex items-center gap-0.5"
        >
          {m[1]}
        </a>
      );
      remaining = remaining.substring(earliestMatch.index + m[0].length);
    } else if (earliestMatch.type === "code") {
      parts.push(
        <code
          key={`code-${keyIndex++}`}
          className="px-1.5 py-0.5 rounded bg-[var(--surface-card)] border border-[var(--line)] text-xs font-mono text-[var(--accent)]"
        >
          {m[1]}
        </code>
      );
      remaining = remaining.substring(earliestMatch.index + m[0].length);
    } else if (earliestMatch.type === "bold") {
      parts.push(
        <strong key={`bold-${keyIndex++}`} className="font-bold text-[var(--ink)]">
          {m[1]}
        </strong>
      );
      remaining = remaining.substring(earliestMatch.index + m[0].length);
    }
  }

  return parts.length === 1 ? parts[0] : parts;
}
