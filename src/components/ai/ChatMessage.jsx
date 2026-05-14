import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { MarkdownContent } from "@/components/ai/MarkdownContent";

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1 py-1">
      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.3s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.15s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50" />
    </div>
  );
}

export function ChatMessage({ role, content, isStreaming }) {
  const isUser = role === "user";
  const showThinking = !isUser && !content && isStreaming;

  return (
    <div className={cn("group/message flex gap-3 px-4 py-3", isUser ? "justify-end" : "justify-start")}>
      {/* Assistant avatar */}
      {!isUser && (
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Bot className="h-4 w-4 text-primary" />
        </div>
      )}

      {/* Content bubble */}
      <div className={cn("max-w-[80%] space-y-2", isUser && "flex flex-col items-end")}>
        {(content || showThinking) && (
          <div
            dir="auto"
            className={cn(
              "rounded-xl px-4 py-3 text-sm",
              isUser
                ? "bg-primary text-primary-foreground rounded-br-sm"
                : "bg-muted text-foreground rounded-bl-sm"
            )}
          >
            {showThinking ? (
              <ThinkingDots />
            ) : isUser ? (
              <div className="whitespace-pre-wrap break-words">{content}</div>
            ) : (
              <MarkdownContent content={content} />
            )}
          </div>
        )}
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
          <User className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
    </div>
  );
}
