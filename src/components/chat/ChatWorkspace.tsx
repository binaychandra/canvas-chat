import { PanelRightOpen, Sparkles } from "lucide-react";
import { useState, type ReactNode } from "react";
import { CanvasPanel } from "@/components/chat/CanvasPanel";
import { ChatComposer, type Attachment } from "@/components/chat/ChatComposer";
import { ChatMessages, type ChatMessage } from "@/components/chat/ChatMessages";
import { type TodoStep } from "@/components/chat/TodoList";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { randomReply, SUGGESTED_PROMPTS, TODO_TEMPLATE } from "@/lib/sample-content";

const STEP_TAB_MAP: Record<string, string> = {
  research: "features",
  draft: "code",
  publish: "notes",
};

interface Props {
  title?: string;
  heading?: string;
  subtitle?: string;
  suggestions?: string[];
  /** Rendered under the composer in the empty state (e.g. dashboard stat cards). */
  belowComposer?: ReactNode;
}

export function ChatWorkspace({
  title = "Nebula",
  heading = "What should we work on?",
  subtitle = "Ask a question and I'll draft a document beside our chat you can explore across tabs.",
  suggestions = SUGGESTED_PROMPTS,
  belowComposer,
}: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [canvasReady, setCanvasReady] = useState(false);
  const [visibleTabs, setVisibleTabs] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);

  const hasStarted = messages.length > 0;

  const handleAttach = (files: File[]) => {
    const next: Attachment[] = files.map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      size: f.size,
      type: f.type || "application/octet-stream",
      url: URL.createObjectURL(f),
    }));
    setAttachments((a) => [...a, ...next]);
  };

  const removeAttachment = (id: string) => {
    setAttachments((a) => {
      const gone = a.find((x) => x.id === id);
      if (gone) URL.revokeObjectURL(gone.url);
      return a.filter((x) => x.id !== id);
    });
  };

  const updateTodo = (msgId: string, updater: (steps: TodoStep[]) => TodoStep[]) => {
    setMessages((msgs) =>
      msgs.map((m) => (m.id === msgId && m.todo ? { ...m, todo: updater(m.todo) } : m)),
    );
  };

  const runTodos = async (
    msgId: string,
    steps: TodoStep[],
    onDone?: (index: number, step: TodoStep) => void,
  ) => {
    for (let i = 0; i < steps.length; i++) {
      updateTodo(msgId, (curr) =>
        curr.map((s, idx) => (idx === i ? { ...s, status: "running", visibleLogs: 0 } : s)),
      );
      const logs = steps[i].logs;
      const perLog = Math.max(150, Math.floor(1000 / Math.max(logs.length, 1)));
      for (let j = 0; j < logs.length; j++) {
        await new Promise((r) => setTimeout(r, perLog));
        updateTodo(msgId, (curr) =>
          curr.map((s, idx) => (idx === i ? { ...s, visibleLogs: j + 1 } : s)),
        );
      }
      await new Promise((r) => setTimeout(r, 120));
      updateTodo(msgId, (curr) => curr.map((s, idx) => (idx === i ? { ...s, status: "done" } : s)));
      onDone?.(i, steps[i]);
    }
  };

  const send = async (text?: string) => {
    if (processing) return;
    const content = (text ?? input).trim();
    if (!content && attachments.length === 0) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      attachments: attachments.length ? attachments : undefined,
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setAttachments([]);
    setCanvasReady(true);
    setVisibleTabs(["overview"]);
    setProcessing(true);
    setPending(true);

    await new Promise((r) => setTimeout(r, 500));
    setMessages((m) => [
      ...m,
      { id: crypto.randomUUID(), role: "assistant", content: randomReply() },
    ]);
    setPending(false);

    await new Promise((r) => setTimeout(r, 300));
    const steps: TodoStep[] = TODO_TEMPLATE.map((t) => ({
      id: `${t.id}-${crypto.randomUUID().slice(0, 6)}`,
      title: t.title,
      logs: t.logs,
      status: "pending",
    }));
    const todoMsgId = crypto.randomUUID();
    setMessages((m) => [
      ...m,
      {
        id: todoMsgId,
        role: "assistant",
        content: "Here's my plan — I'll work through each step:",
        todo: steps,
      },
    ]);

    await runTodos(todoMsgId, steps, (_i, step) => {
      const baseId = step.id.split("-")[0];
      const tabId = STEP_TAB_MAP[baseId];
      if (tabId) setVisibleTabs((prev) => (prev.includes(tabId) ? prev : [...prev, tabId]));
    });

    setMessages((m) => [
      ...m,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "All done — I've published the results to the canvas on the right.",
      },
    ]);
    setProcessing(false);
  };

  if (!hasStarted) {
    return (
      <div className="h-full overflow-y-auto bg-hero">
        <div className="mx-auto flex min-h-full max-w-3xl flex-col items-center justify-center px-4 py-12">
          <div className="mb-6 flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur animate-fade-in">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            {title} · a chat with a canvas
          </div>
          <h1 className="mb-3 text-center text-4xl font-semibold tracking-tight sm:text-5xl animate-fade-in">
            {heading}
          </h1>
          <p className="mb-8 max-w-md text-center text-muted-foreground animate-fade-in">
            {subtitle}
          </p>
          <div className="w-full max-w-2xl animate-fade-in">
            <ChatComposer
              value={input}
              onChange={setInput}
              onSubmit={() => send()}
              autoFocus
              placeholder={`Message ${title}…`}
              attachments={attachments}
              onAttach={handleAttach}
              onRemoveAttachment={removeAttachment}
            />
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2 animate-fade-in">
            {suggestions.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:bg-card hover:text-foreground"
              >
                {p}
              </button>
            ))}
          </div>
          {belowComposer && <div className="mt-12 w-full animate-fade-in">{belowComposer}</div>}
        </div>
      </div>
    );
  }

  const chatPane = (
    <section className="flex h-full min-h-0 flex-col overflow-hidden md:rounded-2xl md:border md:border-border md:bg-card/40">
      <header className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div className="text-sm font-medium">{title}</div>
        </div>
        {canvasReady && (
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
                <CanvasPanel visibleTabs={visibleTabs} />
              </div>
            </SheetContent>
          </Sheet>
        )}
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4">
        <div className="mx-auto w-full max-w-4xl">
          <ChatMessages messages={messages} pending={pending} />
        </div>
      </div>

      <div className="border-t border-border/60 bg-background/60 px-4 py-3 backdrop-blur">
        <div className="mx-auto w-full max-w-4xl">
          <ChatComposer
            value={input}
            onChange={setInput}
            onSubmit={() => send()}
            autoFocus
            disabled={processing}
            attachments={attachments}
            onAttach={handleAttach}
            onRemoveAttachment={removeAttachment}
          />
        </div>
      </div>
    </section>
  );

  return (
    <div className="flex h-full w-full flex-col bg-hero md:p-4">
      <div className="flex min-h-0 flex-1 flex-col md:hidden">{chatPane}</div>

      <div className="hidden min-h-0 flex-1 md:block">
        {canvasReady ? (
          <ResizablePanelGroup
            orientation="horizontal"
            className="gap-2"
            resizeTargetMinimumSize={{ fine: 16, coarse: 28 }}
          >
            <ResizablePanel defaultSize="38" minSize="30" maxSize="82">
              {chatPane}
            </ResizablePanel>
            <ResizableHandle className="w-px min-w-px bg-transparent p-0 px-0 transition-colors after:w-4 after:bg-transparent hover:bg-border/60 data-[resize-handle-state=drag]:bg-primary/40" />
            <ResizablePanel defaultSize="62" minSize="18" className="animate-slide-in-right">
              <CanvasPanel visibleTabs={visibleTabs} />
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <div className="mx-auto h-full w-full max-w-4xl">{chatPane}</div>
        )}
      </div>
    </div>
  );
}
