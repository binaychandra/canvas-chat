import { ArrowUp, Paperclip, X, FileText, Image as ImageIcon } from "lucide-react";
import { useEffect, useRef, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  className?: string;
  attachments?: Attachment[];
  onAttach?: (files: File[]) => void;
  onRemoveAttachment?: (id: string) => void;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function ChatComposer({
  value,
  onChange,
  onSubmit,
  disabled,
  autoFocus,
  placeholder = "Ask anything…",
  className,
  attachments = [],
  onAttach,
  onRemoveAttachment,
}: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [value]);

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if ((value.trim() || attachments.length > 0) && !disabled) onSubmit();
    }
  };

  const canSend = !disabled && (value.trim().length > 0 || attachments.length > 0);

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-elegant transition-all focus-within:border-primary/40 focus-within:shadow-lg",
        className,
      )}
    >
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 px-1 pt-1">
          {attachments.map((a) => {
            const isImage = a.type.startsWith("image/");
            return (
              <div
                key={a.id}
                className="group/att relative flex items-center gap-2 rounded-lg border border-border bg-background/80 py-1.5 pl-1.5 pr-7 text-xs"
              >
                {isImage ? (
                  <img
                    src={a.url}
                    alt={a.name}
                    className="h-8 w-8 rounded object-cover"
                  />
                ) : (
                  <div className="grid h-8 w-8 place-items-center rounded bg-muted text-muted-foreground">
                    <FileText className="h-4 w-4" />
                  </div>
                )}
                <div className="flex flex-col leading-tight">
                  <span className="max-w-[140px] truncate font-medium">{a.name}</span>
                  <span className="text-[10px] text-muted-foreground">{formatSize(a.size)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveAttachment?.(a.id)}
                  className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-muted text-muted-foreground opacity-70 transition-opacity hover:opacity-100"
                  aria-label={`Remove ${a.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}
      <div className="flex items-end gap-2">
        <input
          ref={fileRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            if (files.length) onAttach?.(files);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => fileRef.current?.click()}
          className="h-9 w-9 shrink-0 rounded-xl text-muted-foreground hover:text-foreground"
          aria-label="Attach files"
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        <Textarea
          ref={ref}
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          className="min-h-[44px] flex-1 resize-none border-0 bg-transparent px-1 py-2.5 text-base shadow-none focus-visible:ring-0"
        />
        <Button
          size="icon"
          onClick={onSubmit}
          disabled={!canSend}
          className="h-9 w-9 shrink-0 rounded-xl"
          aria-label="Send message"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export { ImageIcon };
