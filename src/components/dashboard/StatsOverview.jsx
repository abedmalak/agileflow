import React from 'react';
import { Folder, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import InfoTooltip from "@/components/common/InfoTooltip";
import { AIExplainButton } from "@/components/ai/AIExplainButton";

export default function StatsOverview({ boards, items, isLoading }) {
  const completedItems = items?.filter(item => item.data?.status === 'done').length || 0;
  const pendingItems = items?.filter(item => !item.data?.status || item.data?.status !== 'done').length || 0;

  // When not loading and no boards exist, show a hint instead of zeros
  const isEmpty = !isLoading && boards.length === 0;

  const tooltips = {
    "Total Boards": "All project boards you currently own. Each board contains groups, tasks, and columns for tracking work.",
    "Completed Tasks": "Tasks marked as 'Done' across every board. A higher number relative to total tasks indicates strong progress.",
    "Pending Tasks": "Tasks still in progress — includes 'Not Started', 'Working On It', and 'Stuck' statuses. These need your attention.",
    "Total Tasks": "The combined count of all tasks across all boards, regardless of their current status.",
  };

  const stats = [
    {
      title: "Total Boards",
      value: boards.length,
      icon: Folder,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: "Completed Tasks",
      value: completedItems,
      icon: CheckCircle2,
      iconColor: 'text-green-500',
      iconBg: 'bg-green-50 dark:bg-green-950',
    },
    {
      title: "Pending Tasks",
      value: pendingItems,
      icon: Clock,
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-50 dark:bg-amber-950',
    },
    {
      title: "Total Tasks",
      value: items.length,
      icon: TrendingUp,
      iconColor: 'text-purple-500',
      iconBg: 'bg-purple-50 dark:bg-purple-950',
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <AIExplainButton
          widgetTitle="Dashboard Stats Overview"
          widgetData={{
            totalBoards: boards.length,
            completedTasks: completedItems,
            pendingTasks: pendingItems,
            totalTasks: items.length,
          }}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                {stat.title}
                <InfoTooltip text={tooltips[stat.title]} />
              </p>
              <div className={cn("h-8 w-8 rounded-md flex items-center justify-center", stat.iconBg)}>
                <stat.icon className={cn("h-4 w-4", stat.iconColor)} />
              </div>
            </div>
            {isLoading ? (
              <Skeleton className="mt-2 h-8 w-16" />
            ) : isEmpty ? (
              <p className="mt-2 text-lg text-muted-foreground">--</p>
            ) : (
              <p className="mt-2 text-2xl font-semibold text-foreground">{stat.value}</p>
            )}
          </div>
        </motion.div>
      ))}
      </div>
    </div>
  );
}
