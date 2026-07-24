import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-chat">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...p }) => <h1 className="mb-3 mt-1 text-2xl font-semibold tracking-tight" {...p} />,
          h2: ({ node, ...p }) => <h2 className="mb-2 mt-6 text-lg font-semibold tracking-tight" {...p} />,
          h3: ({ node, ...p }) => <h3 className="mb-2 mt-4 text-base font-semibold" {...p} />,
          p: ({ node, ...p }) => <p className="mb-3 leading-7 text-foreground/90" {...p} />,
          ul: ({ node, ...p }) => <ul className="mb-3 list-disc space-y-1 pl-6 text-foreground/90" {...p} />,
          ol: ({ node, ...p }) => <ol className="mb-3 list-decimal space-y-1 pl-6 text-foreground/90" {...p} />,
          li: ({ node, ...p }) => <li className="leading-7" {...p} />,
          blockquote: ({ node, ...p }) => (
            <blockquote className="my-4 border-l-2 border-primary/40 pl-4 italic text-muted-foreground" {...p} />
          ),
          code: ({ node, className, children, ...p }) => {
            const isBlock = /language-/.test(className ?? "");
            if (isBlock) {
              return (
                <code className="block text-sm leading-6" {...p}>
                  {children}
                </code>
              );
            }
            return (
              <code className="rounded bg-muted px-1.5 py-0.5 text-[0.85em] font-mono" {...p}>
                {children}
              </code>
            );
          },
          pre: ({ node, ...p }) => (
            <pre className="mb-4 overflow-x-auto rounded-lg border border-border bg-muted/60 p-4 font-mono" {...p} />
          ),
          table: ({ node, ...p }) => (
            <div className="mb-4 overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm" {...p} />
            </div>
          ),
          th: ({ node, ...p }) => (
            <th className="border-b border-border bg-muted/50 px-3 py-2 text-left font-medium" {...p} />
          ),
          td: ({ node, ...p }) => <td className="border-b border-border/60 px-3 py-2" {...p} />,
          a: ({ node, ...p }) => <a className="text-primary underline underline-offset-4" {...p} />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
