import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Props {
  messages: ChatMessage[];
  pending?: boolean;
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
              <p className="whitespace-pre-wrap text-sm leading-6">{m.content}</p>
            </div>
          ) : (
            <div className="max-w-[92%] text-[0.95rem] leading-7 text-foreground">
              {m.content}
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
