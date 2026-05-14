import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Tailwind-based color map for priority levels
const priorityColorMap = {
  critical: { bg: 'bg-red-50 dark:bg-red-950', text: 'text-red-700 dark:text-red-400' },
  high: { bg: 'bg-amber-50 dark:bg-amber-950', text: 'text-amber-700 dark:text-amber-400' },
  medium: { bg: 'bg-blue-50 dark:bg-blue-950', text: 'text-blue-700 dark:text-blue-400' },
  low: { bg: 'bg-muted', text: 'text-muted-foreground' },
};

const getPriorityClasses = (value) => {
  return priorityColorMap[(value || '').toLowerCase()] || { bg: 'bg-muted', text: 'text-muted-foreground' };
};

export default function PriorityCell({ value, onUpdate, options }) {
  const choices = options?.choices || [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
  ];

  const selectedChoice = choices.find(c => c.value === value);

  const handleValueChange = (newValue) => {
    onUpdate(newValue);
  };

  return (
    <Select value={value || ""} onValueChange={handleValueChange}>
      <SelectTrigger className="h-full w-full p-1 border-none bg-transparent text-sm focus:ring-0 shadow-none">
        {selectedChoice ? (
          <Badge
            className={cn(
              'font-normal border-none',
              getPriorityClasses(selectedChoice.value).bg,
              getPriorityClasses(selectedChoice.value).text
            )}
          >
            {selectedChoice.label}
          </Badge>
        ) : (
          <SelectValue placeholder="Set priority..." />
        )}
      </SelectTrigger>
      <SelectContent>
        {choices.map((choice) => {
          const colors = getPriorityClasses(choice.value);
          return (
            <SelectItem key={choice.value} value={choice.value}>
              <div className="flex items-center gap-2">
                <div className={cn('w-3 h-3 rounded-full', colors.bg)} />
                <span>{choice.label}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
