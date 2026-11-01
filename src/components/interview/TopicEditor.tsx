import { Eye, Pencil, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { Markdown } from "@/components/chat/Markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { CustomTopic, TopicFormat } from "@/lib/custom-topics";

interface Props {
  initial?: CustomTopic | null;
  groups: string[];
  onSave: (topic: CustomTopic) => void;
  onCancel: () => void;
}

export function TopicEditor({ initial, groups, onSave, onCancel }: Props) {
  const [label, setLabel] = useState(initial?.label ?? "");
  const [group, setGroup] = useState(initial?.group ?? groups[0] ?? "My Topics");
  const [format, setFormat] = useState<TopicFormat>(initial?.format ?? "markdown");
  const [content, setContent] = useState(initial?.content ?? "");
  const [preview, setPreview] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file?: File) => {
    if (!file) return;
    const text = await file.text();
    setContent(text);
    setFormat(/\.html?$/i.test(file.name) ? "html" : "markdown");
    if (!label) setLabel(file.name.replace(/\.(md|markdown|html?)$/i, ""));
  };

  const canSave = label.trim().length > 0 && content.trim().length > 0;

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col gap-4 p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold tracking-tight">
          {initial ? "Edit topic" : "New topic"}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setPreview((v) => !v)}>
            {preview ? <Pencil className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {preview ? "Edit" : "Preview"}
          </Button>
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={!canSave}
            onClick={() =>
              onSave({
                id: initial?.id ?? crypto.randomUUID(),
                label: label.trim(),
                group: group.trim() || "My Topics",
                format,
                content,
              })
            }
          >
            Save
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="topic-label">Title</Label>
          <Input
            id="topic-label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Dynamic Programming"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="topic-group">Section</Label>
          <Input
            id="topic-group"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            placeholder="e.g. Data Structures"
            list="topic-groups"
          />
          <datalist id="topic-groups">
            {groups.map((g) => (
              <option key={g} value={g} />
            ))}
          </datalist>
        </div>
        <div className="space-y-1.5">
          <Label>Language</Label>
          <Select value={format} onValueChange={(v) => setFormat(v as TopicFormat)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="markdown">Markdown</SelectItem>
              <SelectItem value="html">HTML</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          ref={fileRef}
          type="file"
          accept=".md,.markdown,.html,.htm,text/markdown,text/html"
          className="hidden"
          onChange={(e) => {
            void handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => fileRef.current?.click()}>
          <Upload className="h-3.5 w-3.5" />
          Upload .md / .html
        </Button>
        <span className="text-xs text-muted-foreground">or write it below</span>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-border bg-card shadow-elegant">
        {preview ? (
          <div className="h-full overflow-y-auto p-6">
            {format === "html" ? (
              <div
                className="prose-sm max-w-none [&_*]:max-w-full"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <Markdown>{content}</Markdown>
            )}
          </div>
        ) : (
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              format === "html" ? "<h1>My topic</h1>" : "# My topic\n\nNotes go here…"
            }
            className="h-full min-h-[320px] resize-none border-0 bg-transparent font-mono text-xs leading-relaxed focus-visible:ring-0"
          />
        )}
      </div>
    </div>
  );
}
