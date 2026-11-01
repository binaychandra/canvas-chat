import { FileText } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Attachment } from "@/components/chat/ChatComposer";
import { TodoList, type TodoStep } from "@/components/chat/TodoList";
import { cn } from "@/lib/utils";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachments?: Attachment[];
  todo?: TodoStep[];
}

interface Props {
  messages: ChatMessage[];
  pending?: boolean;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function AttachmentGrid({ items, tone }: { items: Attachment[]; tone: "user" | "assistant" }) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {items.map((a) => {
        const isImage = a.type.startsWith("image/");
        if (isImage) {
          return (
            <a
              key={a.id}
              href={a.url}
              target="_blank"
              rel="noreferrer"
              className="block overflow-hidden rounded-lg border border-border/60"
            >
              <img src={a.url} alt={a.name} className="max-h-48 max-w-[220px] object-cover" />
            </a>
          );
        }
        return (
          <a
            key={a.id}
            href={a.url}
            target="_blank"
            rel="noreferrer"
            download={a.name}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-2 py-1.5 text-xs transition-colors",
              tone === "user"
                ? "border-primary-foreground/20 bg-primary-foreground/10 hover:bg-primary-foreground/20"
                : "border-border bg-background/60 hover:bg-background",
            )}
          >
            <FileText className="h-4 w-4 shrink-0" />
            <div className="flex flex-col leading-tight">
              <span className="max-w-[160px] truncate font-medium">{a.name}</span>
              <span className="text-[10px] opacity-70">{formatSize(a.size)}</span>
            </div>
          </a>
        );
      })}
    </div>
  );
}

export function ChatMessages({ messages, pending }: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, pending]);

  return (
    <div className="flex flex-col gap-5 px-1 py-6">
      {messages.map((m) => (
        <div
          key={m.id}
          className={cn("flex animate-fade-in", m.role === "user" ? "justify-end" : "justify-start")}
        >
          {m.role === "user" ? (
            <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-primary-foreground shadow-sm">
              {m.content && (
                <p className="whitespace-pre-wrap text-sm leading-6">{m.content}</p>
              )}
              {m.attachments && m.attachments.length > 0 && (
                <AttachmentGrid items={m.attachments} tone="user" />
              )}
            </div>
          ) : (
            <div className="w-full max-w-[92%] text-[0.95rem] leading-7 text-foreground">
              {m.content && <div className="whitespace-pre-wrap">{m.content}</div>}
              {m.todo && (
                <div className={cn(m.content && "mt-3")}>
                  <TodoList steps={m.todo} />
                </div>
              )}
              {m.attachments && m.attachments.length > 0 && (
                <AttachmentGrid items={m.attachments} tone="assistant" />
              )}
            </div>
          )}
        </div>
      ))}
      {pending && (
        <div className="flex animate-fade-in items-center gap-1.5 text-muted-foreground">
          <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground/60" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground/60 [animation-delay:150ms]" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground/60 [animation-delay:300ms]" />
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}
