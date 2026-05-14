import { useState, useEffect, useMemo, useCallback } from "react";
import { helpCategories } from "@/components/help/helpContent";
import HelpSidebar from "@/components/help/HelpSidebar";
import HelpArticle from "@/components/help/HelpArticle";
import HelpSearch from "@/components/help/HelpSearch";
import HelpCategoryCard from "@/components/help/HelpCategoryCard";
import HelpMobileNav from "@/components/help/HelpMobileNav";
import HelpBreadcrumb from "@/components/help/HelpBreadcrumb";
import HelpAIAssistant from "@/components/help/HelpAIAssistant";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Search,
  BookOpen,
  Menu,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";

function findArticleAndCategory(categories, articleId) {
  for (const category of categories) {
    const article = category.articles?.find((a) => a.id === articleId);
    if (article) return { article, category };
  }
  return { article: null, category: null };
}

export default function Help() {
  const [view, setView] = useState("home");
  const [activeArticleId, setActiveArticleId] = useState(null);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [searchQuery, setSidebarSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const isMac =
    typeof navigator !== "undefined" &&
    (navigator.platform?.includes("Mac") || navigator.userAgent?.includes("Mac"));

  const { article: activeArticle, category: activeCategory } = useMemo(() => {
    if (!activeArticleId) return { article: null, category: null };
    return findArticleAndCategory(helpCategories, activeArticleId);
  }, [activeArticleId]);

  const selectedCategory = useMemo(() => {
    if (!activeCategoryId) return null;
    return helpCategories.find((c) => c.id === activeCategoryId) || null;
  }, [activeCategoryId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleArticleSelect = useCallback((articleOrId) => {
    const id = typeof articleOrId === "string" ? articleOrId : articleOrId?.id;
    if (!id) return;
    setActiveArticleId(id);
    setView("article");
    setSidebarSearch("");
  }, []);

  const handleCategorySelect = useCallback((category) => {
    setActiveCategoryId(category.id);
    setView("category");
  }, []);

  const handleNavigate = useCallback((target, id) => {
    if (target === "home") {
      setView("home");
      setActiveArticleId(null);
      setActiveCategoryId(null);
    } else if (target === "category" && id) {
      setView("category");
      setActiveCategoryId(id);
      setActiveArticleId(null);
    }
  }, []);

  const goBack = useCallback(() => {
    if (view === "article" && activeCategoryId) {
      setView("category");
      setActiveArticleId(null);
    } else {
      setView("home");
      setActiveArticleId(null);
      setActiveCategoryId(null);
    }
  }, [view, activeCategoryId]);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] md:h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <HelpSidebar
          categories={helpCategories}
          activeArticleId={activeArticleId}
          onArticleSelect={handleArticleSelect}
          searchQuery={searchQuery}
          onSearchChange={setSidebarSearch}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-background border-b border-border px-4 lg:px-6 h-14 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {view !== "home" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={goBack}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}

          <div className="flex items-center gap-2 flex-1 min-w-0">
            <BookOpen className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <h1 className="text-base font-semibold text-foreground truncate">
              Help Center
            </h1>
          </div>

          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-md bg-background text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors text-sm cursor-pointer"
          >
            <Search className="h-4 w-4 flex-shrink-0" />
            <span className="hidden sm:inline">Search docs...</span>
            <kbd className="hidden sm:inline-flex ml-2 text-xs bg-muted px-1.5 py-0.5 rounded">
              {isMac ? "⌘/" : "Ctrl+/"}
            </kbd>
          </button>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          {view === "home" && (
            <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8">
              {/* Hero */}
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-foreground mb-3">
                  How can we help?
                </h2>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                  Everything you need to know about AgileFlow. Browse topics or
                  search for specific answers.
                </p>
                <div className="mt-6 max-w-md mx-auto relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for articles..."
                    className="pl-9"
                    readOnly
                    onClick={() => setSearchOpen(true)}
                  />
                </div>
              </div>

              {/* Category grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {helpCategories.map((category) => (
                  <HelpCategoryCard
                    key={category.id}
                    category={category}
                    onSelect={handleCategorySelect}
                  />
                ))}
              </div>

              {/* Footer */}
              <Separator className="mt-12 mb-6" />
              <div className="text-center text-sm text-muted-foreground pb-8">
                <p>
                  Can&apos;t find what you&apos;re looking for? Contact your team
                  administrator for additional support.
                </p>
              </div>
            </div>
          )}

          {view === "category" && selectedCategory && (
            <div className="max-w-3xl mx-auto px-4 lg:px-8 py-8">
              <div className="mb-6">
                <HelpBreadcrumb
                  items={[
                    { label: "Help Center", onClick: () => handleNavigate("home") },
                    { label: selectedCategory.title },
                  ]}
                />
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-2">
                {selectedCategory.title}
              </h2>
              {selectedCategory.description && (
                <p className="text-muted-foreground mb-6">
                  {selectedCategory.description}
                </p>
              )}

              <Separator className="mb-6" />

              <div className="space-y-2">
                {selectedCategory.articles?.map((article) => (
                  <button
                    key={article.id}
                    onClick={() => handleArticleSelect(article.id)}
                    className="w-full text-left bg-card border border-border rounded-lg px-5 py-4 hover:border-foreground/20 hover:shadow-sm transition-all cursor-pointer flex items-center gap-3 group"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-foreground">
                        {article.title}
                      </h3>
                      {article.description && (
                        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                          {article.description}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {view === "article" && (
            <HelpArticle
              article={activeArticle}
              category={activeCategory}
              onNavigate={handleNavigate}
            />
          )}
        </ScrollArea>
      </div>

      {/* Search overlay */}
      <HelpSearch
        open={searchOpen}
        onOpenChange={setSearchOpen}
        categories={helpCategories}
        onArticleSelect={handleArticleSelect}
      />

      {/* Mobile navigation */}
      <HelpMobileNav
        open={mobileNavOpen}
        onOpenChange={setMobileNavOpen}
        categories={helpCategories}
        activeArticleId={activeArticleId}
        onArticleSelect={handleArticleSelect}
      />

      {/* AI Help Assistant */}
      <HelpAIAssistant article={activeArticle} category={activeCategory} />
    </div>
  );
}
