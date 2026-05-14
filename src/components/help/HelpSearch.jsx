import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, FileText, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function highlightMatch(text, query) {
  if (!query || !text) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark
        key={i}
        className="bg-yellow-200 dark:bg-yellow-800 text-foreground rounded-sm px-0.5"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function getMatchSnippet(article, query) {
  const lower = query.toLowerCase();

  if (article.title?.toLowerCase().includes(lower)) {
    return article.title;
  }
  if (article.description?.toLowerCase().includes(lower)) {
    return article.description;
  }

  if (article.content) {
    for (const block of article.content) {
      if (block.text?.toLowerCase().includes(lower)) {
        const idx = block.text.toLowerCase().indexOf(lower);
        const start = Math.max(0, idx - 40);
        const end = Math.min(block.text.length, idx + query.length + 60);
        let snippet = block.text.slice(start, end);
        if (start > 0) snippet = "..." + snippet;
        if (end < block.text.length) snippet = snippet + "...";
        return snippet;
      }
    }
  }

  return article.description || "";
}

function searchArticles(categories, query) {
  if (!query || query.trim().length === 0) return [];

  const lower = query.toLowerCase().trim();
  const results = [];

  for (const category of categories) {
    if (!category.articles) continue;

    for (const article of category.articles) {
      let score = 0;

      if (article.title?.toLowerCase().includes(lower)) {
        score += 3;
      }
      if (article.description?.toLowerCase().includes(lower)) {
        score += 2;
      }
      if (article.content) {
        for (const block of article.content) {
          if (block.text?.toLowerCase().includes(lower)) {
            score += 1;
            break;
          }
        }
      }

      if (score > 0) {
        results.push({
          article,
          category,
          score,
          snippet: getMatchSnippet(article, query),
        });
      }
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, 10);
}

export default function HelpSearch({ open, onOpenChange, categories = [], onArticleSelect }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  const debouncedQuery = useDebounce(query, 200);

  const results = useMemo(
    () => searchArticles(categories, debouncedQuery),
    [categories, debouncedQuery]
  );

  const groupedResults = useMemo(() => {
    const groups = new Map();
    for (const result of results) {
      const key = result.category.id || result.category.title;
      if (!groups.has(key)) {
        groups.set(key, { category: result.category, items: [] });
      }
      groups.get(key).items.push(result);
    }
    return Array.from(groups.values());
  }, [results]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [debouncedQuery]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [open]);

  useEffect(() => {
    function handleGlobalKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        onOpenChange?.(true);
      }
    }
    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, [onOpenChange]);

  const handleSelect = useCallback(
    (article) => {
      onArticleSelect?.(article);
      onOpenChange?.(false);
    },
    [onArticleSelect, onOpenChange]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (results.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (results[selectedIndex]) {
            handleSelect(results[selectedIndex].article);
          }
          break;
        default:
          break;
      }
    },
    [results, selectedIndex, handleSelect]
  );

  useEffect(() => {
    if (!resultsRef.current) return;
    const selected = resultsRef.current.querySelector("[data-selected='true']");
    if (selected) {
      selected.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  let flatIndex = -1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-2xl p-0 gap-0 overflow-hidden"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          inputRef.current?.focus();
        }}
      >
        <DialogTitle className="sr-only">Search help articles</DialogTitle>

        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search help articles..."
            className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground outline-none"
          />
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>

        <ScrollArea className="max-h-[60vh]">
          <div ref={resultsRef} className="p-2">
            {!debouncedQuery.trim() && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="h-10 w-10 text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground">
                  Type to search across all help articles
                </p>
              </div>
            )}

            {debouncedQuery.trim() && results.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-10 w-10 text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground">
                  No articles found for &lsquo;{debouncedQuery}&rsquo;
                </p>
              </div>
            )}

            {groupedResults.map((group) => (
              <div key={group.category.id || group.category.title} className="mb-2">
                <div className="px-2 py-1.5">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {group.category.title}
                  </span>
                </div>
                {group.items.map((result) => {
                  flatIndex++;
                  const isSelected = flatIndex === selectedIndex;
                  const currentIndex = flatIndex;

                  return (
                    <button
                      key={result.article.id || result.article.title}
                      data-selected={isSelected}
                      onClick={() => handleSelect(result.article)}
                      onMouseEnter={() => setSelectedIndex(currentIndex)}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left transition-colors",
                        isSelected
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent/50"
                      )}
                    >
                      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm truncate">
                            {highlightMatch(result.article.title, debouncedQuery)}
                          </span>
                          <Badge variant="secondary" className="shrink-0 text-[10px] px-1.5 py-0">
                            {group.category.title}
                          </Badge>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                          {highlightMatch(result.snippet, debouncedQuery)}
                        </p>
                      </div>
                      <ArrowRight
                        className={cn(
                          "mt-1 h-3.5 w-3.5 shrink-0 transition-opacity",
                          isSelected ? "opacity-100 text-muted-foreground" : "opacity-0"
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </ScrollArea>

        {results.length > 0 && (
          <div className="flex items-center gap-4 border-t border-border px-4 py-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <kbd className="inline-flex h-4 items-center rounded border border-border bg-muted px-1 font-mono text-[10px]">
                &uarr;
              </kbd>
              <kbd className="inline-flex h-4 items-center rounded border border-border bg-muted px-1 font-mono text-[10px]">
                &darr;
              </kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="inline-flex h-4 items-center rounded border border-border bg-muted px-1 font-mono text-[10px]">
                &crarr;
              </kbd>
              select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="inline-flex h-4 items-center rounded border border-border bg-muted px-1 font-mono text-[10px]">
                esc
              </kbd>
              close
            </span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
