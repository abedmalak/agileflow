import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

export function MarkdownContent({ content, className, compact = false }) {
  return (
    <div className={cn("break-words", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className={cn("font-bold text-foreground", compact ? "text-sm mb-2 mt-3 first:mt-0" : "text-lg mb-3 mt-4 first:mt-0")}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className={cn("font-bold text-foreground", compact ? "text-sm mb-1.5 mt-2.5 first:mt-0" : "text-base mb-2 mt-3 first:mt-0")}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className={cn("font-semibold text-foreground", compact ? "text-sm mb-1 mt-2 first:mt-0" : "text-sm mb-1.5 mt-2.5 first:mt-0")}>
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className={cn("leading-relaxed", compact ? "mb-1.5 last:mb-0" : "mb-2.5 last:mb-0")}>
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          ul: ({ children }) => (
            <ul className={cn("list-disc list-outside pl-4", compact ? "mb-1.5 space-y-0.5" : "mb-2.5 space-y-1")}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className={cn("list-decimal list-outside pl-4", compact ? "mb-1.5 space-y-0.5" : "mb-2.5 space-y-1")}>
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary/80">
              {children}
            </a>
          ),
          code: ({ children, className: codeClassName }) => {
            const isBlock = codeClassName?.startsWith("language-");
            if (isBlock) {
              return (
                <code className={cn("block overflow-x-auto rounded-lg bg-zinc-900 p-3 text-xs leading-relaxed text-zinc-300", compact ? "my-1.5" : "my-2.5")}>
                  {children}
                </code>
              );
            }
            return (
              <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono text-foreground">
                {children}
              </code>
            );
          },
          pre: ({ children }) => <pre className="overflow-hidden">{children}</pre>,
          blockquote: ({ children }) => (
            <blockquote className={cn("border-l-2 border-primary/30 pl-3 italic text-muted-foreground", compact ? "my-1.5" : "my-2.5")}>
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-3 border-border" />,
          table: ({ children }) => (
            <div className="my-2 overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-xs">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/50 border-b border-border">{children}</thead>
          ),
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => (
            <tr className="border-b border-border/30 last:border-0">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 text-left font-semibold text-foreground whitespace-nowrap">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 text-muted-foreground">{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
