import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
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

function HelpCategoryCard({ category, onSelect }) {
  const Icon = iconMap[category?.icon];
  const articleCount = category?.articles?.length || 0;

  return (
    <button
      onClick={() => onSelect?.(category)}
      className={cn(
        "w-full text-left bg-card border border-border rounded-lg p-6",
        "hover:border-foreground/20 hover:shadow-sm transition-all cursor-pointer",
        "flex items-start gap-4 group"
      )}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
        {Icon && <Icon className="h-5 w-5 text-foreground" />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-semibold text-foreground truncate">
            {category?.title}
          </h3>
          <Badge variant="secondary" className="text-xs flex-shrink-0">
            {articleCount} {articleCount === 1 ? "article" : "articles"}
          </Badge>
        </div>
        {category?.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {category.description}
          </p>
        )}
      </div>

      <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5 group-hover:text-foreground transition-colors" />
    </button>
  );
}

export default HelpCategoryCard;
