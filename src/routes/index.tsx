import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, PanelRightOpen } from "lucide-react";
import { useState } from "react";
import { CanvasPanel } from "@/components/chat/CanvasPanel";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { ChatMessages, type ChatMessage } from "@/components/chat/ChatMessages";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { randomReply, SUGGESTED_PROMPTS } from "@/lib/sample-content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nebula — Chat with a live canvas" },
      {
        name: "description",
        content:
          "A fast, minimal chat workspace that opens a tabbed markdown canvas alongside your conversation.",
      },
      { property: "og:title", content: "Nebula — Chat with a live canvas" },
      {
        property: "og:description",
        content: "Ask anything. Your assistant drafts into a canvas beside the chat.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const hasStarted = messages.length > 0;

  const send = (text?: string) => {
    const content = (text ?? input).trim();
    if (!content) return;
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setPending(true);
    window.setTimeout(() => {
      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), role: "assistant", content: randomReply() },
      ]);
      setPending(false);
    }, 700);
  };

  return (
    <div className="relative min-h-screen bg-hero">
      {!hasStarted ? (
        <EmptyState
          input={input}
          setInput={setInput}
          onSend={() => send()}
          onPick={(p) => send(p)}
        />
      ) : (
        <ActiveState
          messages={messages}
          pending={pending}
          input={input}
          setInput={setInput}
          onSend={() => send()}
          sheetOpen={sheetOpen}
          setSheetOpen={setSheetOpen}
        />
      )}
    </div>
  );
}

function EmptyState({
  input,
  setInput,
  onSend,
  onPick,
}: {
  input: string;
  setInput: (v: string) => void;
  onSend: () => void;
  onPick: (p: string) => void;
}) {
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4 py-16">
      <div className="mb-8 flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur animate-fade-in">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        Nebula · a chat with a canvas
      </div>
      <h1 className="mb-3 text-center text-4xl font-semibold tracking-tight sm:text-5xl animate-fade-in">
        What should we work on?
      </h1>
      <p className="mb-10 max-w-md text-center text-muted-foreground animate-fade-in">
        Ask a question and I'll draft a document beside our chat you can explore across tabs.
      </p>
      <div className="w-full animate-fade-in">
        <ChatComposer
          value={input}
          onChange={setInput}
          onSubmit={onSend}
          autoFocus
          placeholder="Message Nebula…"
        />
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-2 animate-fade-in">
        {SUGGESTED_PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => onPick(p)}
            className="rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:bg-card hover:text-foreground"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

function ActiveState({
  messages,
  pending,
  input,
  setInput,
  onSend,
  sheetOpen,
  setSheetOpen,
}: {
  messages: ChatMessage[];
  pending: boolean;
  input: string;
  setInput: (v: string) => void;
  onSend: () => void;
  sheetOpen: boolean;
  setSheetOpen: (v: boolean) => void;
}) {
  return (
    <div className="flex h-screen w-full flex-col md:grid md:grid-cols-[minmax(380px,1fr)_1.2fr] md:gap-4 md:p-4">
      {/* Chat pane */}
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden md:rounded-2xl md:border md:border-border md:bg-card/40">
        <header className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <div className="text-sm font-medium">Nebula</div>
          </div>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 md:hidden">
                <PanelRightOpen className="h-3.5 w-3.5" />
                Canvas
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full p-0 sm:max-w-lg">
              <SheetTitle className="sr-only">Canvas</SheetTitle>
              <div className="h-full p-3">
                <CanvasPanel />
              </div>
            </SheetContent>
          </Sheet>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4">
          <div className="mx-auto max-w-2xl">
            <ChatMessages messages={messages} pending={pending} />
          </div>
        </div>

        <div className="border-t border-border/60 bg-background/60 px-4 py-3 backdrop-blur">
          <div className="mx-auto max-w-2xl">
            <ChatComposer value={input} onChange={setInput} onSubmit={onSend} autoFocus />
          </div>
        </div>
      </section>

      {/* Canvas pane (desktop) */}
      <aside className="hidden min-h-0 animate-slide-in-right md:block">
        <CanvasPanel />
      </aside>
    </div>
  );
}
