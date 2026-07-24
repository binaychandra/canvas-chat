export const SUGGESTED_PROMPTS = [
  "Explain quantum entanglement",
  "Draft a launch announcement",
  "Show me a React hook example",
  "Summarize today's top AI news",
];

const REPLIES = [
  "Great question — here's a starting point. I've opened the canvas on the right with a working draft you can explore across tabs.",
  "Sure. I pulled together an overview, a feature breakdown, a code sample, and some notes in the canvas. Take a look and let me know what to refine.",
  "Absolutely. The canvas now has a structured document you can navigate — jump between the tabs to see different angles on this.",
  "Done. I've drafted this into the canvas with sections for context, capabilities, and implementation notes.",
];

export function randomReply(): string {
  return REPLIES[Math.floor(Math.random() * REPLIES.length)];
}

export const CANVAS_TABS: { id: string; label: string; markdown: string }[] = [
  {
    id: "overview",
    label: "Overview",
    markdown: `# Project Nebula

A workspace where **conversation** and **artifacts** live side by side.

## What this is
Nebula is a lightweight chat surface that pairs each conversation with a
persistent canvas — think of it as a shared whiteboard your assistant can
edit in real time.

> "The best interfaces disappear into the work." — anon

## Highlights
- Split view that materializes on the first message
- Tabbed canvas for long-form output
- Zero-config markdown rendering
- Keyboard-first composer
`,
  },
  {
    id: "features",
    label: "Features",
    markdown: `# Features

| Area | Detail |
|------|--------|
| Composer | Auto-grow textarea, ⏎ to send, ⇧⏎ for newline |
| Canvas | Tabs, markdown, copy-to-clipboard |
| Motion | Slide + fade transition into split layout |
| Theming | Semantic tokens, light/dark ready |

## Roadmap
1. Streaming assistant responses
2. Persistent threads
3. Inline artifact editing
4. Collaborative cursors
`,
  },
  {
    id: "code",
    label: "Code",
    markdown: `# Code sample

A tiny hook for auto-scrolling a message list.

\`\`\`tsx
import { useEffect, useRef } from "react";

export function useAutoScroll<T>(dep: T) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" });
  }, [dep]);
  return ref;
}
\`\`\`

Usage:

\`\`\`tsx
const ref = useAutoScroll(messages.length);
return <div ref={ref}>{/* messages */}</div>;
\`\`\`
`,
  },
  {
    id: "notes",
    label: "Notes",
    markdown: `# Notes

- The canvas is intentionally read-only in this draft.
- Content across tabs is illustrative — swap in real data later.
- Consider a resizable divider between chat and canvas.

## Open questions
- Should the canvas persist across sessions?
- Do we want per-message artifacts, or one shared canvas per thread?
- Where do attachments live?
`,
  },
];
