import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, CalendarCheck, CheckCircle2, Loader2 } from "lucide-react";
import { ChatWorkspace } from "@/components/chat/ChatWorkspace";
import { Card } from "@/components/ui/card";
import { DASHBOARD_STATS } from "@/lib/app-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Nebula job workspace" },
      {
        name: "description",
        content:
          "Chat with an assistant that drafts into a live canvas, and track your application pipeline at a glance.",
      },
      { property: "og:title", content: "Dashboard — Nebula job workspace" },
      {
        property: "og:description",
        content: "Ask anything and watch your assistant build a canvas beside the chat.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

const ICONS = [Briefcase, Loader2, CalendarCheck, CheckCircle2];

function StatCards() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {DASHBOARD_STATS.map((s, i) => {
        const Icon = ICONS[i % ICONS.length];
        return (
          <Card key={s.id} className="gap-0 border-border/70 bg-card/70 p-4 shadow-elegant backdrop-blur">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-3.5 w-3.5" />
              </span>
            </div>
            <div className="mt-3 text-2xl font-semibold tracking-tight">{s.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{s.hint}</div>
          </Card>
        );
      })}
    </div>
  );
}

function DashboardPage() {
  return (
    <ChatWorkspace
      heading="What should we work on?"
      subtitle="Ask a question and I'll draft a document beside our chat you can explore across tabs."
      belowComposer={<StatCards />}
    />
  );
}
