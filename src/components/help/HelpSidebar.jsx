import { useState, useRef, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Rocket,
  LayoutGrid,
  Folder,
  ListOrdered,
  Calendar,
  TrendingUp,
  Bot,
  Users,
  Settings,
  Keyboard,
  Shield,
  UserCog,
  ChevronRight,
  Search,
} from "lucide-react";

const iconMap = {
  Rocket,
  LayoutGrid,
  Folder,
  ListOrdered,
  Calendar,
  TrendingUp,
  Bot,
  Users,
  Settings,
  Keyboard,
  Shield,
  UserCog,
};

function HelpSidebar({
  categories,
  activeArticleId,
  onArticleSelect,
  searchQuery,
  onSearchChange,
}) {
  const [expandedCategories, setExpandedCategories] = useState({});
  const activeRef = useRef(null);

  useEffect(() => {
    if (activeArticleId && categories) {
      const expanded = {};
      categories.forEach((cat) => {
        if (cat.articles?.some((a) => a.id === activeArticleId)) {
          expanded[cat.id] = true;
        }
      });
      setExpandedCategories((prev) => ({ ...prev, ...expanded }));
    }
  }, [activeArticleId, categories]);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [activeArticleId]);

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const searchResults = useMemo(() => {
    if (!searchQuery?.trim()) return null;
    const query = searchQuery.toLowerCase();
    const results = [];
    categories?.forEach((cat) => {
      cat.articles?.forEach((article) => {
        if (article.title.toLowerCase().includes(query)) {
          results.push({ ...article, categoryName: cat.title });
        }
      });
    });
    return results;
  }, [searchQuery, categories]);

  return (
    <div className="w-[280px] min-w-[280px] border-r border-border bg-card flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={searchQuery || ""}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="py-2">
          {searchResults ? (
            <div className="px-3 py-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-2">
                {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
              </p>
              {searchResults.length === 0 && (
                <p className="text-sm text-muted-foreground px-2">
                  No articles found.
                </p>
              )}
              {searchResults.map((article) => (
                <button
                  key={article.id}
                  onClick={() => onArticleSelect?.(article.id)}
                  className={cn(
                    "w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors",
                    article.id === activeArticleId
                      ? "bg-accent text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                >
                  <span className="block truncate">{article.title}</span>
                  <span className="block text-xs text-muted-foreground truncate">
                    {article.categoryName}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            categories?.map((category) => {
              const Icon = iconMap[category.icon];
              const isExpanded = !!expandedCategories[category.id];

              return (
                <div key={category.id} className="mb-1">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground hover:bg-accent/50 transition-colors"
                  >
                    <ChevronRight
                      className={cn(
                        "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                        isExpanded && "rotate-90"
                      )}
                    />
                    {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                    <span className="truncate">{category.title}</span>
                  </button>

                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-200 ease-in-out",
                      isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="pl-10 pr-3 pb-1">
                      {category.articles?.map((article) => {
                        const isActive = article.id === activeArticleId;
                        return (
                          <button
                            key={article.id}
                            ref={isActive ? activeRef : null}
                            onClick={() => onArticleSelect?.(article.id)}
                            className={cn(
                              "w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors",
                              isActive
                                ? "bg-accent text-foreground font-medium"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                            )}
                          >
                            <span className="block truncate">{article.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export default HelpSidebar;
