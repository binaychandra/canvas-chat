import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare, Pencil, Plus, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ChatWorkspace } from "@/components/chat/ChatWorkspace";
import { Markdown } from "@/components/chat/Markdown";
import { TopicEditor } from "@/components/interview/TopicEditor";
import { Button } from "@/components/ui/button";
import { INTERVIEW_PROMPTS, INTERVIEW_TOPICS } from "@/lib/app-data";
import {
  deleteCustomTopic,
  loadCustomTopics,
  upsertCustomTopic,
  type CustomTopic,
} from "@/lib/custom-topics";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/interview-prep")({
  head: () => ({
    meta: [
      { title: "Interview Prep — topics, notes and a live coach" },
      {
        name: "description",
        content:
          "Browse interview topics by category, add your own markdown or HTML notes, and toggle a chat coach that builds a canvas as you practice.",
      },
      { property: "og:title", content: "Interview Prep — topics, notes and a live coach" },
      {
        property: "og:description",
        content: "Structured interview notes plus an on-demand chat coach with a live canvas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InterviewPrepPage,
});

type AnyTopic = {
  id: string;
  label: string;
  group: string;
  format: "markdown" | "html";
  content: string;
  custom: boolean;
};

const BUILT_IN: AnyTopic[] = INTERVIEW_TOPICS.map((t) => ({
  id: t.id,
  label: t.label,
  group: t.group,
  format: "markdown",
  content: t.markdown,
  custom: false,
}));

function InterviewPrepPage() {
  const [selected, setSelected] = useState(BUILT_IN[0].id);
  const [chatOpen, setChatOpen] = useState(false);
  const [custom, setCustom] = useState<CustomTopic[]>([]);
  const [editing, setEditing] = useState<CustomTopic | null | undefined>(undefined);

  useEffect(() => {
    setCustom(loadCustomTopics());
  }, []);

  const topics: AnyTopic[] = useMemo(
    () => [...BUILT_IN, ...custom.map((t) => ({ ...t, custom: true as const }))],
    [custom],
  );

  const groups = useMemo(() => {
    const map = new Map<string, AnyTopic[]>();
    for (const t of topics) map.set(t.group, [...(map.get(t.group) ?? []), t]);
    return [...map.entries()];
  }, [topics]);

  const topic = topics.find((t) => t.id === selected) ?? topics[0];
  const isEditing = editing !== undefined;

  const handleSave = (next: CustomTopic) => {
    setCustom(upsertCustomTopic(next));
    setSelected(next.id);
    setEditing(undefined);
  };

  const handleDelete = (id: string) => {
    const next = deleteCustomTopic(id);
    setCustom(next);
    if (selected === id) setSelected(BUILT_IN[0].id);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-hero">
      <div className="flex items-center justify-between gap-3 border-b border-border/60 px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Interview Prep</h1>
          <p className="text-xs text-muted-foreground">Pick a topic, add your own, or ask the coach</p>
        </div>
        <Button
          variant={chatOpen ? "default" : "outline"}
          size="sm"
          className="gap-1.5"
          onClick={() => setChatOpen((v) => !v)}
        >
          {chatOpen ? <X className="h-3.5 w-3.5" /> : <MessageSquare className="h-3.5 w-3.5" />}
          {chatOpen ? "Close coach" : "Ask the coach"}
        </Button>
      </div>

      {chatOpen ? (
        <div className="min-h-0 flex-1">
          <ChatWorkspace
            title="Coach"
            heading="What should we practice?"
            subtitle="Ask for a mock interview or a topic drill — I'll build the material in the canvas beside us."
            suggestions={INTERVIEW_PROMPTS}
          />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1">
          <aside className="hidden w-64 shrink-0 flex-col overflow-y-auto border-r border-border/60 p-3 md:flex">
            <Button
              variant="outline"
              size="sm"
              className="mb-3 w-full gap-1.5"
              onClick={() => setEditing(null)}
            >
              <Plus className="h-3.5 w-3.5" />
              Add topic
            </Button>
            {groups.map(([group, list]) => (
              <div key={group} className="mb-4">
                <div className="px-2 pb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  {group}
                </div>
                <div className="space-y-0.5">
                  {list.map((t) => (
                    <div key={t.id} className="group/item flex items-center gap-1">
                      <button
                        onClick={() => {
                          setSelected(t.id);
                          setEditing(undefined);
                        }}
                        className={cn(
                          "min-w-0 flex-1 truncate rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                          t.id === selected
                            ? "bg-primary/10 font-medium text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        {t.label}
                      </button>
                      {t.custom && (
                        <div className="flex opacity-0 transition-opacity group-hover/item:opacity-100">
                          <button
                            aria-label={`Edit ${t.label}`}
                            className="rounded p-1 text-muted-foreground hover:text-foreground"
                            onClick={() =>
                              setEditing(custom.find((c) => c.id === t.id) ?? null)
                            }
                          >
                            <Pencil className="h-3 w-3" />
                          </button>
                          <button
                            aria-label={`Delete ${t.label}`}
                            className="rounded p-1 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDelete(t.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </aside>

          <div className="min-w-0 flex-1 overflow-y-auto">
            {isEditing ? (
              <TopicEditor
                initial={editing}
                groups={[...new Set(topics.map((t) => t.group))]}
                onSave={handleSave}
                onCancel={() => setEditing(undefined)}
              />
            ) : (
              <div className="p-4 sm:p-6">
                <div className="mb-4 flex gap-2 overflow-x-auto md:hidden">
                  <button
                    onClick={() => setEditing(null)}
                    className="shrink-0 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground"
                  >
                    + Add
                  </button>
                  {topics.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelected(t.id)}
                      className={cn(
                        "shrink-0 rounded-full border px-3 py-1.5 text-xs transition-colors",
                        t.id === selected
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-border bg-card/60 text-muted-foreground",
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-elegant">
                  {topic.format === "html" ? (
                    <div
                      className="prose-sm max-w-none [&_*]:max-w-full"
                      dangerouslySetInnerHTML={{ __html: topic.content }}
                    />
                  ) : (
                    <Markdown>{topic.content}</Markdown>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

