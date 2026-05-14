import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronRight,
  BookOpen,
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
} from "lucide-react";
import { cn } from "@/lib/utils";

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

export default function HelpMobileNav({
  open,
  onOpenChange,
  categories = [],
  activeArticleId,
  onArticleSelect,
}) {
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  function toggleCategory(categoryId) {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }

  function handleArticleSelect(article) {
    onArticleSelect?.(article);
    onOpenChange?.(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[85vw] max-w-sm p-0 flex flex-col">
        <SheetHeader className="px-4 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <SheetTitle className="text-base">Help Center</SheetTitle>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <nav className="p-3 space-y-1">
            {categories.map((category) => {
              const categoryKey = category.id || category.title;
              const isExpanded = expandedCategories.has(categoryKey);
              const IconComponent = iconMap[category.icon] || BookOpen;
              const articleCount = category.articles?.length || 0;

              return (
                <div key={categoryKey}>
                  <button
                    onClick={() => toggleCategory(categoryKey)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors",
                      "min-h-[44px]",
                      "hover:bg-accent/50 active:bg-accent"
                    )}
                  >
                    <IconComponent className="h-4.5 w-4.5 shrink-0 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-foreground">
                        {category.title}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums mr-1">
                      {articleCount}
                    </span>
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                        isExpanded && "rotate-90"
                      )}
                    />
                  </button>

                  {isExpanded && category.articles && (
                    <div className="ml-4 border-l border-border pl-2 mb-1">
                      {category.articles.map((article) => {
                        const articleKey = article.id || article.title;
                        const isActive = activeArticleId === articleKey;

                        return (
                          <button
                            key={articleKey}
                            onClick={() => handleArticleSelect(article)}
                            className={cn(
                              "flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left transition-colors",
                              "min-h-[44px]",
                              isActive
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground active:bg-accent"
                            )}
                          >
                            <span className="text-sm truncate">{article.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
