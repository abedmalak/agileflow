import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function GroupByMenu({ groupBy, columns, onChange, onClose }) {
  const groupOptions = [
    { id: 'group', label: 'Default Groups', type: 'default' },
    { id: 'status', label: 'Status', type: 'status' },
    { id: 'owner', label: 'Person', type: 'people' },
    { id: 'priority', label: 'Priority', type: 'priority' },
    ...columns.filter(col => col.type === 'dropdown' || col.type === 'tags')
      .map(col => ({ id: col.id, label: col.title, type: col.type }))
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-full left-0 mt-2 z-50"
    >
      <Card className="w-64 shadow-sm border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg font-bold text-foreground">Group By</CardTitle>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </CardHeader>
        <CardContent className="space-y-1">
          {groupOptions.map((option) => (
            <Button
              key={option.id}
              variant="ghost"
              className={`w-full justify-between h-auto p-3 ${
                groupBy === option.id ? 'bg-muted text-primary' : 'hover:bg-muted'
              }`}
              onClick={() => {
                onChange(option.id);
                onClose();
              }}
            >
              <span>{option.label}</span>
              {groupBy === option.id && <Check className="w-4 h-4" />}
            </Button>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}