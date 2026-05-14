import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Tailwind-based color map for known status labels
const statusColorMap = {
  'not started': { bg: 'bg-muted', text: 'text-muted-foreground' },
  'working on it': { bg: 'bg-amber-50 dark:bg-amber-950', text: 'text-amber-700 dark:text-amber-400' },
  'done': { bg: 'bg-green-50 dark:bg-green-950', text: 'text-green-700 dark:text-green-400' },
  'stuck': { bg: 'bg-red-50 dark:bg-red-950', text: 'text-red-700 dark:text-red-400' },
};

const getStatusClasses = (label) => {
  const key = (label || '').toLowerCase();
  return statusColorMap[key] || { bg: 'bg-muted', text: 'text-muted-foreground' };
};

export default function StatusCell({ value, options, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);

  const choices = options?.choices || [
    { label: 'Not Started' },
    { label: 'Working on it' },
    { label: 'Done' },
    { label: 'Stuck' },
  ];

  const currentChoice = choices.find(choice =>
    choice.label.toLowerCase() === (value || '').toLowerCase()
  ) || choices[0];

  if (isEditing) {
    return (
      <Select
        value={currentChoice.label}
        onValueChange={(newValue) => {
          onUpdate(newValue);
          setIsEditing(false);
        }}
        onOpenChange={(open) => {
          if (!open) setIsEditing(false);
        }}
        open={true}
      >
        <SelectTrigger className="w-full border-none p-0 h-auto focus:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {choices.map((choice) => {
            const colors = getStatusClasses(choice.label);
            return (
              <SelectItem key={choice.label} value={choice.label}>
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

  const colors = getStatusClasses(currentChoice.label);

  return (
    <Badge
      className={cn(
        'cursor-pointer border-none font-medium px-3 py-1 hover:opacity-80 transition-opacity',
        colors.bg,
        colors.text
      )}
      onClick={() => setIsEditing(true)}
    >
      {currentChoice.label}
    </Badge>
  );
}
