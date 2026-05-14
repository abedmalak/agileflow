import { useState, useRef, useEffect, useCallback } from "react";
import { invokeLLM } from "@/api/openrouter";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, X, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

function extractArticleText(article) {
  if (!article?.content) return "";
  return article.content
    .map((block) => {
      if (block.text) return block.text;
      if (block.items) return block.items.join("\n");
      return "";
    })
    .filter(Boolean)
    .join("\n\n");
}

function buildSystemPrompt(article, category) {
  let context = `You are a helpful AI assistant embedded in the AgileFlow Help Center. AgileFlow is a project management platform for agile teams, featuring boards, sprint planning, backlogs, analytics, calendar, and team collaboration.

Your role is to answer questions about how AgileFlow works based on the documentation. Be concise, friendly, and specific. Use short paragraphs. Reference specific UI elements when helpful (button names, menu locations, etc).`;

  if (article && category) {
    const articleText = extractArticleText(article);
    context += `

The user is currently reading this help article:
Category: ${category.title}
Article: ${article.title}
${article.description ? `Description: ${article.description}` : ""}

Article content:
${articleText}

Answer questions in the context of this article. If the question is about a different topic, still try to help but mention they can search for other articles.`;
  }

  return context;
}

export default function HelpAIAssistant({ article, category }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const systemPrompt = buildSystemPrompt(article, category);
      const conversationHistory = messages
        .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
        .join("\n\n");

      const fullPrompt = `${systemPrompt}\n\n${conversationHistory ? `Previous conversation:\n${conversationHistory}\n\n` : ""}User: ${trimmed}`;

      const reply = await invokeLLM(fullPrompt);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Sorry, I couldn't process that request. ${error.message}`,
        },
      ]);
    }

    setIsLoading(false);
  }, [input, isLoading, article, category, messages]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const isAIAvailable = !!import.meta.env.VITE_OPENROUTER_API_KEY;

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "fixed bottom-6 right-6 z-50 flex items-center gap-2",
            "bg-primary text-primary-foreground rounded-full px-4 py-3",
            "shadow-lg hover:shadow-xl transition-all",
            "hover:scale-105 active:scale-95 cursor-pointer"
          )}
        >
          <Sparkles className="h-5 w-5" />
          <span className="text-sm font-medium">Ask AI</span>
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] bg-card border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Help Assistant
                </p>
                <p className="text-xs text-muted-foreground">
                  {article
                    ? `Reading: ${article.title}`
                    : "Ask about AgileFlow"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 max-h-[400px] min-h-[200px]">
            <div ref={scrollRef} className="p-4 space-y-4">
              {!isAIAvailable && (
                <div className="text-center py-8">
                  <Bot className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    AI help is currently unavailable. The API key has not been configured.
                  </p>
                </div>
              )}

              {isAIAvailable && messages.length === 0 && (
                <div className="text-center py-8">
                  <Bot className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Ask me anything about AgileFlow
                  </p>
                  <div className="space-y-2">
                    {[
                      "How do I create a board?",
                      "What are sprint points?",
                      "How does filtering work?",
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setInput(suggestion);
                          setTimeout(() => inputRef.current?.focus(), 0);
                        }}
                        className="block w-full text-left text-xs text-muted-foreground bg-accent/50 hover:bg-accent rounded-md px-3 py-2 transition-colors cursor-pointer"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent text-accent-foreground"
                    )}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-accent text-accent-foreground rounded-lg px-3 py-2 flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span className="text-sm text-muted-foreground">
                      Thinking...
                    </span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t border-border p-3">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question..."
                disabled={isLoading || !isAIAvailable}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none disabled:opacity-50"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
                onClick={handleSend}
                disabled={!input.trim() || isLoading || !isAIAvailable}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
