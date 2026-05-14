import React, { useState, useEffect, useCallback } from "react";
import { User as UserEntity } from "@/api/entities/User";
import { Item } from "@/api/entities/Item";
import { suggestAssignees } from "@/lib/ai-assignment";
import { Sparkles, ChevronDown, ChevronUp, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export default function AssignmentSuggestion({ task, board, onSelectAssignee }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState(null);

  const fetchSuggestions = useCallback(async () => {
    if (!task?.title || !board?.id) return;

    setLoading(true);
    setError(null);
    try {
      const [members, allItems] = await Promise.all([
        UserEntity.listAll(),
        Item.filter({ board_id: board.id }),
      ]);

      if (!members || members.length === 0) {
        setSuggestions([]);
        setLoading(false);
        return;
      }

      const ranked = suggestAssignees(task, members, allItems, board.columns || []);
      setSuggestions(ranked.slice(0, 5));
    } catch (err) {
      setError("Could not load suggestions");
      console.error("Assignment suggestion error:", err);
    }
    setLoading(false);
  }, [task?.title, board?.id, board?.columns]);

  useEffect(() => {
    if (task?.title?.trim()) {
      const timer = setTimeout(fetchSuggestions, 300);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
    }
  }, [task?.title, fetchSuggestions]);

  if (!task?.title?.trim()) return null;

  const topSuggestion = suggestions[0];

  return (
    <div className="rounded-lg border border-border bg-muted/30 dark:bg-muted/10 p-3">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Suggested Assignees</span>
        </div>
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
        ) : (
          expanded
            ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
            : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        )}
      </button>

      {!loading && !expanded && topSuggestion && (
        <div className="mt-2 flex items-center gap-2">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectAssignee?.(topSuggestion.member.id, topSuggestion.member.name);
                  }}
                  className="h-7 px-2 text-xs gap-1.5 hover:bg-primary/10"
                >
                  <User className="w-3 h-3" />
                  <span className="font-medium">{topSuggestion.member.name}</span>
                  <span className="text-muted-foreground">
                    ({Math.round(topSuggestion.score * 100)}% match)
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                <ScoreBreakdown suggestion={topSuggestion} />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      {!loading && expanded && (
        <div className="mt-3 space-y-1.5">
          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}
          {suggestions.length === 0 && !error && (
            <p className="text-xs text-muted-foreground">No team members found</p>
          )}
          {suggestions.map((s, idx) => (
            <TooltipProvider key={s.member.id} delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => onSelectAssignee?.(s.member.id, s.member.name)}
                    className={cn(
                      "w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-sm transition-colors",
                      "hover:bg-accent dark:hover:bg-accent/50",
                      idx === 0 && "bg-primary/5 dark:bg-primary/10"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                        {(s.member.name || "?").charAt(0).toUpperCase()}
                      </div>
                      <div className="text-left">
                        <span className="font-medium text-foreground">{s.member.name}</span>
                        {s.member.role && (
                          <span className="text-muted-foreground ml-1.5 text-xs">
                            {s.member.role}
                          </span>
                        )}
                      </div>
                    </div>
                    <ScoreBadge score={s.score} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">
                  <ScoreBreakdown suggestion={s} />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      )}
    </div>
  );
}

function ScoreBadge({ score }) {
  const pct = Math.round(score * 100);
  const color = pct >= 70
    ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30"
    : pct >= 40
      ? "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30"
      : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30";

  return (
    <span className={cn("text-xs font-semibold px-1.5 py-0.5 rounded", color)}>
      {pct}%
    </span>
  );
}

function ScoreBreakdown({ suggestion }) {
  return (
    <div className="space-y-1 min-w-[160px]">
      <p className="font-medium mb-1">{suggestion.member.name}</p>
      <div className="flex justify-between">
        <span>Competency</span>
        <span className="font-mono">{(suggestion.competency * 100).toFixed(0)}%</span>
      </div>
      <div className="flex justify-between">
        <span>Availability</span>
        <span className="font-mono">{(suggestion.availability * 100).toFixed(0)}%</span>
      </div>
      <div className="flex justify-between">
        <span>Performance</span>
        <span className="font-mono">{(suggestion.performance * 100).toFixed(0)}%</span>
      </div>
      <p className="text-muted-foreground pt-1 border-t border-border mt-1">
        {suggestion.reasoning}
      </p>
    </div>
  );
}
