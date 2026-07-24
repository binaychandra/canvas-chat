import { Check, Copy, FileText } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CANVAS_TABS } from "@/lib/sample-content";
import { Markdown } from "./Markdown";

export function CanvasPanel() {
  const [active, setActive] = useState(CANVAS_TABS[0].id);
  const [copied, setCopied] = useState(false);

  const current = CANVAS_TABS.find((t) => t.id === active) ?? CANVAS_TABS[0];

  const copy = async () => {
    await navigator.clipboard.writeText(current.markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-elegant">
      <Tabs value={active} onValueChange={setActive} className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <FileText className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">project-nebula.md</div>
              <div className="truncate text-xs text-muted-foreground">Draft canvas · updated just now</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="hidden sm:inline-flex">Draft</Badge>
            <Button variant="ghost" size="sm" onClick={copy} className="gap-1.5">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
            </Button>
          </div>
        </div>

        <div className="border-b border-border px-3 pt-2">
          <TabsList className="bg-transparent p-0">
            {CANVAS_TABS.map((t) => (
              <TabsTrigger
                key={t.id}
                value={t.id}
                className="rounded-none border-b-2 border-transparent bg-transparent px-3 py-2 text-sm text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto">
          {CANVAS_TABS.map((t) => (
            <TabsContent key={t.id} value={t.id} className="mt-0 px-6 py-6">
              {t.id === active && <Markdown>{t.markdown}</Markdown>}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
