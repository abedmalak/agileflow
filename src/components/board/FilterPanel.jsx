import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import { motion } from "framer-motion";

export default function FilterPanel({ filters, onChange, onClose, board }) {
  const statusColumn = board?.columns?.find(col => col.type === 'status');
  const statusChoices = statusColumn?.options?.choices || [
    { label: 'Not Started', color: '#C4C4C4' },
    { label: 'Working on it', color: '#FFCB00' },
    { label: 'Done', color: '#00C875' },
    { label: 'Stuck', color: '#E2445C' }
  ];

  const priorities = ['Low', 'Medium', 'High', 'Critical'];

  const handleStatusChange = (status, checked) => {
    const newStatuses = checked 
      ? [...filters.status, status]
      : filters.status.filter(s => s !== status);
    onChange({ ...filters, status: newStatuses });
  };

  const handlePriorityChange = (priority, checked) => {
    const newPriorities = checked
      ? [...filters.priority, priority]
      : filters.priority.filter(p => p !== priority);
    onChange({ ...filters, priority: newPriorities });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-full left-0 mt-2 z-50"
    >
      <Card className="w-80 shadow-sm border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg font-bold text-foreground">Filter Items</CardTitle>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Filter */}
          <div>
            <h4 className="font-medium text-foreground mb-3">Status</h4>
            <div className="space-y-2">
              {statusChoices.map((choice) => (
                <div key={choice.label} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${choice.label}`}
                    checked={filters.status.includes(choice.label)}
                    onCheckedChange={(checked) => handleStatusChange(choice.label, checked)}
                  />
                  <label 
                    htmlFor={`status-${choice.label}`}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: choice.color }}
                    />
                    <span>{choice.label}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Filter */}
          <div>
            <h4 className="font-medium text-foreground mb-3">Priority</h4>
            <div className="space-y-2">
              {priorities.map((priority) => (
                <div key={priority} className="flex items-center space-x-2">
                  <Checkbox
                    id={`priority-${priority}`}
                    checked={filters.priority.includes(priority)}
                    onCheckedChange={(checked) => handlePriorityChange(priority, checked)}
                  />
                  <label 
                    htmlFor={`priority-${priority}`}
                    className="text-sm cursor-pointer"
                  >
                    {priority}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {(filters.status.length > 0 || filters.priority.length > 0) && (
            <div className="pt-3 border-t border-border">
              <button
                onClick={() => onChange({ status: [], people: filters.people, priority: [] })}
                className="text-sm text-destructive hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}