import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Menu, Sparkles, Send, Square, Zap, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAI } from "@/components/ai/AIProvider";
import { ChatMessage } from "@/components/ai/ChatMessage";
import { ChatSidebar } from "@/components/ai/ChatSidebar";

export default function ChatPage() {
  const {
    messages, streaming, thinking, sessionId,
    sessions, sessionsLoading,
    sendMessage, startNewChat, loadSessions, loadSession,
    renameSession, deleteSession, stopStreaming,
    mode, setMode,
  } = useAI();

  const [searchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { loadSessions(); }, [loadSessions]);

  useEffect(() => {
    const sid = searchParams.get("session");
    if (sid && sid !== sessionId) loadSession(sid);
  }, [searchParams]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const ta = inputRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 144)}px`;
  }, [inputValue]);

  function handleSend() {
    const text = inputValue.trim();
    if (text && !streaming) {
      sendMessage(text);
      setInputValue("");
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleSelectSession(id) {
    loadSession(id);
    setSidebarOpen(false);
  }

  const suggestions = [
    "Create a new board for our frontend sprint",
    "Who should I assign the API integration task to?",
    "Show me all tasks on the main board",
    "Plan the next sprint based on our backlog",
  ];

  return (
    <div className="flex h-[calc(100vh-3.5rem)] md:h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 border-r border-border bg-card">
        <ChatSidebar
          sessions={sessions}
          activeSessionId={sessionId}
          onSelectSession={handleSelectSession}
          onNewChat={startNewChat}
          onRenameSession={renameSession}
          onDeleteSession={deleteSession}
          loading={sessionsLoading}
        />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <aside
            className="absolute left-0 top-0 bottom-0 w-64 bg-card border-r"
            onClick={(e) => e.stopPropagation()}
          >
            <ChatSidebar
              sessions={sessions}
              activeSessionId={sessionId}
              onSelectSession={handleSelectSession}
              onNewChat={() => { startNewChat(); setSidebarOpen(false); }}
              onRenameSession={renameSession}
              onDeleteSession={deleteSession}
              loading={sessionsLoading}
            />
          </aside>
        </div>
      )}

      {/* Main chat area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-1 rounded-md text-muted-foreground hover:bg-muted cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Sparkles className="h-4 w-4 text-primary" />
          <h1 className="text-sm font-semibold">AI Assistant</h1>
          <div className="ml-auto flex items-center rounded-lg border border-border/50 p-0.5">
            <button
              type="button"
              onClick={() => setMode("fast")}
              className={cn(
                "flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer",
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
                "flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer",
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
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              <Sparkles className="h-12 w-12 text-muted-foreground/20 mb-4" />
              <h2 className="text-lg font-semibold text-foreground mb-1">How can I help?</h2>
              <p className="text-sm text-muted-foreground mb-8 max-w-md">
                I can create boards, manage tasks, assign work, plan sprints, and analyze your project.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full">
                {suggestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-left rounded-xl border border-border/50 px-4 py-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto py-4">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  role={msg.role}
                  content={
                    msg.role === "assistant" && msg.content === "" && thinking ? "" : msg.content
                  }
                  isStreaming={
                    streaming && msg.role === "assistant" && msg.id === messages[messages.length - 1]?.id
                  }
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t bg-background px-4 py-3">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-end gap-2 rounded-xl border bg-card p-2 shadow-sm focus-within:ring-2 focus-within:ring-ring">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your project..."
                rows={1}
                className="max-h-36 min-h-[36px] flex-1 resize-none border-0 bg-transparent px-2 py-1.5 text-sm focus:outline-none placeholder:text-muted-foreground"
              />
              {streaming ? (
                <button
                  onClick={stopStreaming}
                  className="shrink-0 rounded-lg bg-destructive p-2 text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
                  title="Stop generating"
                >
                  <Square className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className={cn(
                    "shrink-0 rounded-lg bg-primary p-2 text-primary-foreground transition cursor-pointer",
                    inputValue.trim() ? "hover:bg-primary/90" : "opacity-40 cursor-not-allowed"
                  )}
                  title="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
