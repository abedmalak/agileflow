import { HelpCircle, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export default function InfoTooltip({
  text,
  side = "top",
  className,
  iconClassName,
  variant = "help",
  size = "sm",
  align = "center",
}) {
  const Icon = variant === "info" ? Info : HelpCircle;

  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
  };

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center rounded-full text-muted-foreground/70 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              className
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <Icon className={cn(sizeClasses[size] || sizeClasses.sm, iconClassName)} />
          </button>
        </TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className={cn(
            "max-w-xs text-xs leading-relaxed font-normal z-[300]",
            "bg-foreground text-background dark:bg-card dark:text-foreground dark:border dark:border-border"
          )}
        >
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
