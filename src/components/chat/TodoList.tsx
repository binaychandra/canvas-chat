import { Check, Loader2, Circle, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type TodoStatus = "pending" | "running" | "done";

export interface TodoStep {
  id: string;
  title: string;
  logs: string[];
  status: TodoStatus;
  visibleLogs?: number;
}

interface Props {
  title?: string;
  steps: TodoStep[];
}

export function TodoList({ title = "Plan", steps }: Props) {
  const doneCount = steps.filter((s) => s.status === "done").length;
  const [userOpen, setUserOpen] = useState<Record<string, boolean | undefined>>({});

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-border bg-card/60 p-3 shadow-elegant">
      <div className="mb-2 flex items-center justify-between px-2 pt-1">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {title}
        </div>
        <div className="text-xs text-muted-foreground">
          {doneCount}/{steps.length} complete
        </div>
      </div>
      <ul className="flex flex-col gap-2">
        {steps.map((step) => {
          const isRunning = step.status === "running";
          const isDone = step.status === "done";
          const override = userOpen[step.id];
          // Default: only running steps auto-expand. User toggle overrides.
          const isOpen = override ?? isRunning;
          const visible = step.visibleLogs ?? (isDone ? step.logs.length : 0);
          const logsToShow = isOpen
            ? isRunning
              ? step.logs.slice(0, visible)
              : step.logs
            : [];
          const hasLogs = step.logs.length > 0;
          return (
            <li
              key={step.id}
              className={cn(
                "relative rounded-xl border transition-colors",
                isRunning
                  ? "border-primary/40 bg-primary/5"
                  : isDone
                    ? "border-border bg-background/40"
                    : "border-border/60 bg-background/20",
              )}
            >
              {isRunning && (
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
                  <div
                    className="absolute inset-y-0 -left-1/3 w-1/3"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, color-mix(in oklab, var(--primary) 28%, transparent), transparent)",
                      animation: "todo-sweep 1.4s ease-in-out infinite",
                    }}
                  />
                </div>
              )}
              <div className="relative z-[1] flex items-center gap-3 px-3 py-2.5">
                <span
                  className={cn(
                    "grid h-5 w-5 shrink-0 place-items-center rounded-full border",
                    isDone
                      ? "border-primary bg-primary text-primary-foreground"
                      : isRunning
                        ? "border-primary/60 text-primary"
                        : "border-border text-muted-foreground",
                  )}
                >
                  {isDone ? (
                    <Check className="h-3 w-3" strokeWidth={3} />
                  ) : isRunning ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Circle className="h-2 w-2" />
                  )}
                </span>
                <span
                  className={cn(
                    "flex-1 text-sm",
                    isDone
                      ? "text-muted-foreground line-through"
                      : isRunning
                        ? "font-medium text-foreground"
                        : "text-foreground/80",
                  )}
                >
                  {step.title}
                </span>
                {hasLogs && (
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-label={isOpen ? "Hide logs" : "Show logs"}
                    onClick={() =>
                      setUserOpen((u) => ({ ...u, [step.id]: !isOpen }))
                    }
                    className="grid h-6 w-6 shrink-0 place-items-center rounded-md border border-border/60 bg-background/60 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>
                )}
              </div>
              {logsToShow.length > 0 && (
                <div className="relative z-[1] mx-3 mb-3 max-h-40 overflow-y-auto rounded-lg border border-border/60 bg-background/70 px-3 py-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
                  {logsToShow.map((log, i) => (
                    <div key={i} className="animate-fade-in">
                      <span className="text-primary/70">›</span> {log}
                    </div>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

