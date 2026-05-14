import { useState, useRef, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { AIInsightPopover } from "./AIInsightPopover";

export function AIExplainButton({ widgetTitle, widgetData, className }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative inline-flex", className)}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium",
          "border border-border bg-card text-muted-foreground",
          "hover:bg-primary/10 hover:text-primary hover:border-primary/30",
          "transition-all duration-150",
          open && "bg-primary/10 text-primary border-primary/30"
        )}
        title={`Ask AI about ${widgetTitle}`}
      >
        <Sparkles className="w-3 h-3" />
        Ask AI
      </button>

      <AIInsightPopover
        open={open}
        onClose={() => setOpen(false)}
        widgetTitle={widgetTitle}
        widgetData={widgetData}
      />
    </div>
  );
}
