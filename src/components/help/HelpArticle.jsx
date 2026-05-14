import { useEffect, useRef, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import HelpBreadcrumb from "./HelpBreadcrumb";
import { Lightbulb, AlertTriangle } from "lucide-react";

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function TableOfContents({ headings, activeId }) {
  return (
    <nav className="hidden xl:block w-[200px] min-w-[200px] sticky top-8 self-start ml-8">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
        On this page
      </p>
      <ul className="space-y-1">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              className={cn(
                "block text-sm py-1 transition-colors border-l-2 pl-3",
                heading.level === 3 && "pl-5",
                activeId === heading.id
                  ? "border-primary text-foreground font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function SectionRenderer({ section }) {
  switch (section.type) {
    case "heading": {
      const id = slugify(section.text);
      const Tag = section.level === 3 ? "h3" : "h2";
      return (
        <Tag
          id={id}
          className={cn(
            "scroll-mt-8 font-semibold text-foreground",
            section.level === 3
              ? "text-lg mt-6 mb-3"
              : "text-xl mt-8 mb-4"
          )}
        >
          {section.text}
        </Tag>
      );
    }

    case "paragraph":
      return (
        <p className="text-foreground leading-relaxed mb-4">
          {section.text}
        </p>
      );

    case "list":
      return (
        <ul className="mb-4 space-y-2">
          {section.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      );

    case "steps":
      return (
        <ol className="mb-4 space-y-3">
          {section.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-foreground">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ol>
      );

    case "tip":
      return (
        <div className="mb-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex gap-3">
          <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900 dark:text-blue-100 leading-relaxed">
            {section.text}
          </div>
        </div>
      );

    case "warning":
      return (
        <div className="mb-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
            {section.text}
          </div>
        </div>
      );

    case "shortcut":
      return (
        <div className="mb-4 flex items-center gap-2 text-sm text-foreground">
          {section.label && <span>{section.label}</span>}
          <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono border border-border">
            {section.keys}
          </kbd>
        </div>
      );

    case "divider":
      return <Separator className="my-6" />;

    default:
      return null;
  }
}

function HelpArticle({ article, category, onNavigate }) {
  const contentRef = useRef(null);
  const [activeTocId, setActiveTocId] = useState("");

  const headings = useMemo(() => {
    if (!article?.content) return [];
    return article.content
      .filter((s) => s.type === "heading")
      .map((s) => ({
        id: slugify(s.text),
        text: s.text,
        level: s.level || 2,
      }));
  }, [article]);

  useEffect(() => {
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveTocId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 }
    );

    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean);

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (!article) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Select an article to get started.
      </div>
    );
  }

  return (
    <div className="flex-1 flex min-w-0">
      <div className="flex-1 min-w-0 max-w-3xl px-8 py-6" ref={contentRef}>
        <div className="mb-6">
          <HelpBreadcrumb
            items={[
              { label: "Help Center", onClick: () => onNavigate?.("home") },
              ...(category
                ? [{ label: category.title, onClick: () => onNavigate?.("category", category.id) }]
                : []),
              { label: article.title },
            ]}
          />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">
          {article.title}
        </h1>
        {article.description && (
          <p className="text-muted-foreground mb-6">{article.description}</p>
        )}

        <Separator className="mb-6" />

        <div>
          {article.content?.map((section, index) => (
            <SectionRenderer key={index} section={section} />
          ))}
        </div>
      </div>

      <TableOfContents headings={headings} activeId={activeTocId} />
    </div>
  );
}

export default HelpArticle;
