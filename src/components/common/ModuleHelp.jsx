import { useState } from "react";
import { HelpCircle, X, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { MODULE_HELP } from "@/lib/help-content";
import ReactMarkdown from "react-markdown";

export default function ModuleHelp({ moduleKey, className }) {
  const [open, setOpen] = useState(false);
  const help = MODULE_HELP[moduleKey];

  if (!help) return null;

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium",
          "border border-border bg-card text-muted-foreground",
          "hover:bg-muted hover:text-foreground",
          "transition-colors duration-150",
          className
        )}
        title={`Learn about ${help.title}`}
      >
        <HelpCircle className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Help</span>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-[200] transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full sm:w-[420px] z-[201]",
          "bg-card border-l border-border shadow-2xl",
          "transform transition-transform duration-300 ease-out",
          "flex flex-col",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">{help.title}</h2>
              <p className="text-xs text-muted-foreground">{help.subtitle}</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {help.sections.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold flex-shrink-0">
                  {idx + 1}
                </span>
                {section.heading}
              </h3>
              <div className="text-sm text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none prose-p:my-1.5 prose-strong:text-foreground prose-ul:my-1 prose-li:my-0.5">
                <ReactMarkdown>{section.body}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground text-center">
            Hover over <HelpCircle className="w-3 h-3 inline -mt-0.5" /> icons for quick tips on specific elements
          </p>
        </div>
      </div>
    </>
  );
}
