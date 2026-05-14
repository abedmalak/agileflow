import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function DropdownCell({ value, onUpdate, options }) {
  const choices = options?.choices || [];
  const selectedChoice = choices.find(c => c.value === value);

  const handleValueChange = (newValue) => {
    onUpdate(newValue);
  };

  return (
    <Select value={value || ""} onValueChange={handleValueChange}>
      <SelectTrigger className="h-full w-full p-1 border-none bg-transparent text-sm focus:ring-0 shadow-none">
        {selectedChoice ? (
          <Badge 
            style={{ backgroundColor: selectedChoice.color ? `${selectedChoice.color}20` : '#e5e7eb', color: selectedChoice.color || '#374151' }}
            className="font-normal"
          >
            {selectedChoice.label}
          </Badge>
        ) : (
          <SelectValue placeholder="Select..." />
        )}
      </SelectTrigger>
      <SelectContent>
        {choices.map((choice) => (
          <SelectItem key={choice.value} value={choice.value}>
            <div className="flex items-center gap-2">
              {choice.color && (
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: choice.color }}
                />
              )}
              <span>{choice.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}