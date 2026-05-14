import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export function AIFollowUpChips({ suggestions, onSelect, disabled }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5 mt-3">
      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Follow up</p>
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion)}
          disabled={disabled}
          className={cn(
            "flex items-start gap-2 rounded-lg border border-border px-3 py-2 text-left",
            "text-xs text-foreground transition-all duration-150",
            "hover:bg-muted hover:border-primary/30",
            "disabled:opacity-40 disabled:cursor-not-allowed"
          )}
        >
          <MessageSquare className="w-3 h-3 mt-0.5 flex-shrink-0 text-muted-foreground" />
          <span className="line-clamp-2">{suggestion}</span>
        </button>
      ))}
    </div>
  );
}
