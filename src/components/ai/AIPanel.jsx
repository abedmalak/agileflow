import { useEffect, useRef, useState } from "react";
import { ExternalLink, PanelRightClose, Plus, Send, Square, Sparkles, Zap, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAI } from "@/components/ai/AIProvider";
import { ChatMessage } from "@/components/ai/ChatMessage";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

export function AIPanel() {
  const navigate = useNavigate();
  const {
    messages,
    streaming,
    thinking,
    panelOpen,
    pageContext,
    sendMessage,
    closePanel,
    startNewChat,
    stopStreaming,
    sessionId,
    loadSessions,
    mode,
    setMode,
  } = useAI();

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");

  // Load sessions when panel opens
  useEffect(() => {
    if (panelOpen) loadSessions();
  }, [panelOpen, loadSessions]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (panelOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [panelOpen]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = inputRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, [inputValue]);

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleSend() {
    const text = inputValue.trim();
    if (text && !streaming) {
      sendMessage(text);
      setInputValue("");
    }
  }

  const contextBadge = pageContext.pageTitle !== "Dashboard" ? pageContext.pageTitle : null;

  const suggestions = [
    "Create a new board for our frontend sprint",
    "Who should I assign the API integration task to?",
    "Show me all tasks on the main board",
  ];

  return (
    <Sheet open={panelOpen} onOpenChange={(open) => { if (!open) closePanel(); }}>
      <SheetContent
        side="right"
        className="w-[420px] max-w-full p-0 flex flex-col sm:max-w-[420px] [&>button]:hidden"
      >
        <SheetTitle className="sr-only">AI Assistant</SheetTitle>

        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles className="h-4 w-4 shrink-0 text-primary" />
            <h3 className="text-sm font-semibold truncate">AI Assistant</h3>
          </div>
          <div className="flex items-center gap-1">
            <div className="flex items-center rounded-lg border border-border/50 p-0.5 mr-1">
              <button
                type="button"
                onClick={() => setMode("fast")}
                className={cn(
                  "flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-colors cursor-pointer",
                  mode === "fast"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Fast mode — quick responses"
              >
                <Zap className="h-3 w-3" />
                Fast
              </button>
              <button
                type="button"
                onClick={() => setMode("thinking")}
                className={cn(
                  "flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-colors cursor-pointer",
                  mode === "thinking"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Thinking mode — extended analysis"
              >
                <Brain className="h-3 w-3" />
                Think
              </button>
            </div>
            <button
              type="button"
              onClick={startNewChat}
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
              title="New conversation"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                closePanel();
                navigate(sessionId ? `/Chat?session=${sessionId}` : "/Chat");
              }}
              className="flex h-7 items-center gap-1 rounded-full px-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
              title="Open full chat page"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Expand</span>
            </button>
            <button
              type="button"
              onClick={closePanel}
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
              title="Close panel"
            >
              <PanelRightClose className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Context badge */}
        {contextBadge && (
          <div className="border-b px-4 py-2">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
              {contextBadge}
            </span>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              <Sparkles className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">
                How can I help?
              </p>
              <p className="text-xs text-muted-foreground mb-6">
                I can create boards, manage tasks, assign work, plan sprints, and analyze your project
              </p>
              <div className="space-y-2 w-full max-w-xs">
                {suggestions.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => sendMessage(q)}
                    className="w-full text-left rounded-lg border border-border/50 px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-2">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  role={msg.role}
                  content={
                    msg.role === "assistant" && msg.content === "" && thinking
                      ? ""
                      : msg.content
                  }
                  isStreaming={
                    streaming &&
                    msg.role === "assistant" &&
                    msg.id === messages[messages.length - 1]?.id
                  }
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t px-3 py-3">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your project..."
              rows={1}
              className={cn(
                "flex-1 resize-none rounded-xl border border-input bg-background px-3 py-2",
                "text-sm text-foreground placeholder:text-muted-foreground",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                "max-h-24"
              )}
            />
            {streaming ? (
              <button
                type="button"
                onClick={stopStreaming}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-destructive text-destructive-foreground transition hover:bg-destructive/90 cursor-pointer"
                aria-label="Stop generating"
              >
                <Square className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                  "bg-primary text-primary-foreground transition-all duration-150",
                  "hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                )}
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
