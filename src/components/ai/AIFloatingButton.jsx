import { useState, useEffect } from "react";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAI } from "@/components/ai/AIProvider";

export function AIFloatingButton() {
  const { panelOpen, togglePanel } = useAI();
  const [showGlow, setShowGlow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowGlow(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "transition-all duration-300 ease-out",
        panelOpen && "scale-0 opacity-0 pointer-events-none"
      )}
    >
      {/* Gradient ring overlay */}
      {showGlow && (
        <div
          className="absolute inset-[-3px] rounded-full animate-ai-ring-spin"
          style={{
            background: "conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #3b82f6)",
            opacity: 1,
            animation: "ai-ring-spin 0.8s linear, ai-ring-fade 1.5s ease-out forwards",
          }}
        />
      )}

      <button
        onClick={togglePanel}
        type="button"
        className={cn(
          "relative flex h-14 w-14 items-center justify-center",
          "rounded-full bg-primary text-primary-foreground shadow-lg",
          "transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "cursor-pointer"
        )}
        aria-label="Open AI assistant"
      >
        <Bot className="h-6 w-6" />
      </button>

      <style>{`
        @keyframes ai-ring-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes ai-ring-fade {
          0%, 40% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
