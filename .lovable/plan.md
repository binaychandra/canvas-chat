# Chat App with Split Canvas View

A single-page chat experience: empty state shows a centered composer; sending the first message animates into a two-pane layout — chat on the left, a tabbed "canvas" panel on the right rendering sample markdown.

## Layout & UX

**Empty state (`/`)**
- Full-height centered column: app title, one-line subtitle, large rounded composer (Textarea + send Button) with 3–4 suggested prompt chips below.
- Subtle background gradient using design tokens (no hardcoded colors).

**Active state (after first message)**
- Two-column grid: left = chat (min 380px, flex), right = canvas panel (flex-1).
- Smooth transition: composer slides from center → docks bottom-left; canvas slides in from the right (`animate-slide-in-right` + fade). Uses CSS transitions on a single layout state flag, no layout thrash.
- On mobile: canvas becomes a Sheet triggered by a "View canvas" button; chat stays full width.

**Chat pane (left)**
- Scrollable message list with user/assistant bubbles using semantic tokens (`bg-primary/primary-foreground` for user, plain foreground for assistant — no bubble bg).
- Sticky composer at bottom with auto-grow textarea, Enter to send, Shift+Enter for newline.
- Assistant replies are canned/random placeholder text (no backend) with a short simulated typing delay + shimmer.

**Canvas pane (right)**
- Card container with shadcn `Tabs`: 4 tabs — Overview, Features, Code, Notes.
- Each tab renders a static sample markdown document (different random content per tab) via a lightweight markdown renderer.
- Header row: document title, small badge, copy button.

## Technical Details

- **Route**: rewrite `src/routes/index.tsx` (placeholder route). Update `head()` with real title/description/og tags.
- **State**: single `useState` for messages in the index component; derive `hasStarted = messages.length > 0` for layout. No routing changes, no persistence.
- **Components** (new, under `src/components/chat/`):
  - `ChatComposer.tsx` — textarea + send button, controlled input, used in both centered and docked positions.
  - `ChatMessages.tsx` — message list with bubbles + typing shimmer.
  - `CanvasPanel.tsx` — Tabs + markdown renderer + header.
  - `Markdown.tsx` — tiny renderer using `react-markdown` + `remark-gfm`.
- **Deps to add**: `react-markdown`, `remark-gfm`.
- **Design tokens**: extend `src/styles.css` with a subtle `--gradient-hero` and one `--shadow-elegant` token; use existing shadcn semantic colors elsewhere. No hardcoded colors in components.
- **Performance**: single client route, no data fetching, memoize the canvas tabs content, lazy-render markdown only for the active tab, avoid re-mounting the composer on transition (same component, different container class).
- **Sample data**: hardcoded arrays for suggested prompts, random assistant replies, and per-tab markdown strings in `src/lib/sample-content.ts`.

## Out of Scope
- Real AI backend, streaming, persistence, auth, multi-thread history. (Can be added later via Lovable Cloud + AI Gateway.)
