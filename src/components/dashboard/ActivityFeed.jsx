import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import InfoTooltip from "@/components/common/InfoTooltip";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const statusMeta = {
  done: { className: 'bg-green-500', label: 'Done' },
  working: { className: 'bg-amber-500', label: 'In Progress' },
  stuck: { className: 'bg-red-500', label: 'Stuck' },
};

const getStatusDotClass = (status) => {
  return statusMeta[status]?.className || 'bg-muted-foreground';
};

const getStatusLabel = (status) => {
  return statusMeta[status]?.label || 'Not Started';
};

export default function ActivityFeed({ items, isLoading }) {
  return (
    <Card className="border border-border bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-1">
            Recent Activity
            <InfoTooltip text="Your most recently updated tasks across all boards. Status colors: green = done, amber = in progress, red = stuck, gray = not started." />
          </CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">Latest updates</p>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array(Math.min(3, items?.length || 3)).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-2 h-2 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-3 w-full mb-2" />
                  <Skeleton className="h-2 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Activity className="h-10 w-10 text-muted-foreground/50 mb-3" />
            <h3 className="text-sm font-medium text-foreground mb-1">No recent activity</h3>
            <p className="text-xs text-muted-foreground">Activity will appear here as you work on tasks.</p>
          </div>
        ) : (
          <TooltipProvider delayDuration={150}>
            <div>
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3 py-3 border-b border-border last:border-0"
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span
                        className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 cursor-default ${getStatusDotClass(item.data?.status)}`}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="left" className="text-xs">
                      Status: {getStatusLabel(item.data?.status)}
                    </TooltipContent>
                  </Tooltip>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{item.title}</p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="text-xs text-muted-foreground cursor-default w-fit">
                          {format(new Date(item.updated_date), 'MMM d, h:mm a')}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-xs">
                        Last updated: {format(new Date(item.updated_date), 'EEEE, MMMM d, yyyy \'at\' h:mm a')}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </motion.div>
              ))}
            </div>
          </TooltipProvider>
        )}
      </CardContent>
    </Card>
  );
}
