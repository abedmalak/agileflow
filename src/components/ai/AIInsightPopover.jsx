import { useState, useEffect, useRef } from "react";
import { X, Maximize2, Loader2, Send, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { explainInsight, askFollowUp, parseExplainResponse } from "@/lib/ai-explain";
import { AIFollowUpChips } from "./AIFollowUpChips";
import { useAI } from "./AIProvider";
import ReactMarkdown from "react-markdown";

export function AIInsightPopover({ open, onClose, widgetTitle, widgetData }) {
  const [messages, setMessages] = useState([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const { openPanel, sendMessage } = useAI();

  // Auto-explain on open
  useEffect(() => {
    if (open && messages.length === 0) {
      handleExplain();
    }
  }, [open]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streaming]);

  // Focus input when ready
  useEffect(() => {
    if (open && !streaming && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open, streaming]);

  const handleExplain = async () => {
    setStreaming(true);
    setError(null);
    setSuggestions([]);

    const question = `Explain the "${widgetTitle}" data: what does it mean, what changed, and what should we do?`;
    setMessages([{ role: "user", content: question }]);

    try {
      const fullResponse = await explainInsight(widgetTitle, widgetData, (chunk) => {
        const { content } = parseExplainResponse(chunk);
        setMessages([
          { role: "user", content: question },
          { role: "assistant", content },
        ]);
      });

      const { content, suggestions: sug } = parseExplainResponse(fullResponse);
      setMessages([
        { role: "user", content: question },
        { role: "assistant", content },
      ]);
      setSuggestions(sug);
    } catch (err) {
      setError(err.message);
    } finally {
      setStreaming(false);
    }
  };

  const handleFollowUp = async (question) => {
    if (streaming) return;
    setStreaming(true);
    setError(null);
    setSuggestions([]);

    const history = messages.map(m => ({ role: m.role, content: m.content }));
    const newMessages = [...messages, { role: "user", content: question }];
    setMessages(newMessages);
    setInput("");

    try {
      const fullResponse = await askFollowUp(widgetTitle, widgetData, history, question, (chunk) => {
        const { content } = parseExplainResponse(chunk);
        setMessages([
          ...newMessages,
          { role: "assistant", content },
        ]);
      });

      const { content, suggestions: sug } = parseExplainResponse(fullResponse);
      setMessages([
        ...newMessages,
        { role: "assistant", content },
      ]);
      setSuggestions(sug);
    } catch (err) {
      setError(err.message);
    } finally {
      setStreaming(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || streaming) return;
    handleFollowUp(text);
  };

  const handleExpandToPanel = () => {
    const lastAssistant = messages.filter(m => m.role === "assistant").pop();
    if (lastAssistant) {
      openPanel();
      sendMessage(`About the "${widgetTitle}" widget: ${lastAssistant.content.slice(0, 200)}...`);
    }
    onClose();
  };

  const handleClose = () => {
    setMessages([]);
    setSuggestions([]);
    setError(null);
    setInput("");
    onClose();
  };

  const hasConversation = messages.length > 2;

  return (
    <div
      className={cn(
        "absolute right-0 top-full z-50 mt-2",
        hasConversation ? "w-96" : "w-80",
        "rounded-xl border border-border bg-card shadow-xl",
        "transition-all duration-200 ease-out origin-top-right",
        "flex flex-col",
        open
          ? "scale-100 opacity-100 translate-y-0"
          : "scale-95 opacity-0 -translate-y-1 pointer-events-none"
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="text-xs font-semibold text-foreground truncate">
          AI Insight — {widgetTitle}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={handleExpandToPanel}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Expand to full chat"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleClose}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className={cn(
          "overflow-y-auto px-3 py-3 space-y-3",
          hasConversation ? "max-h-[28rem]" : "max-h-[24rem]"
        )}
      >
        {messages.filter(m => m.role === "assistant").map((msg, idx) => (
          <div key={idx} className="text-sm leading-relaxed text-foreground prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-headings:my-2 prose-headings:text-sm prose-ul:my-1">
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        ))}

        {streaming && messages.filter(m => m.role === "assistant").length === 0 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground py-4">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Analyzing...
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 text-xs text-destructive py-2">
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!streaming && suggestions.length > 0 && (
          <AIFollowUpChips
            suggestions={suggestions}
            onSelect={handleFollowUp}
            disabled={streaming}
          />
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="border-t border-border p-2 flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a follow-up..."
          disabled={streaming}
          className={cn(
            "flex-1 rounded-lg border border-input bg-background px-2.5 py-1.5",
            "text-xs text-foreground placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "disabled:opacity-50"
          )}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              handleSend(e);
            }
          }}
        />
        <button
          type="submit"
          disabled={streaming || !input.trim()}
          className={cn(
            "rounded-lg bg-primary p-1.5 text-primary-foreground",
            "hover:bg-primary/90 transition-colors",
            "disabled:opacity-40 disabled:cursor-not-allowed"
          )}
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
