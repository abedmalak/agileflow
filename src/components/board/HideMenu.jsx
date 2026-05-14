import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export default function HideMenu({ columns, hiddenColumns, onChange, onClose }) {
  const handleColumnToggle = (columnId, hide) => {
    const newHidden = new Set(hiddenColumns);
    if (hide) {
      newHidden.add(columnId);
    } else {
      newHidden.delete(columnId);
    }
    onChange(newHidden);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-full left-0 mt-2 z-50"
    >
      <Card className="w-64 shadow-sm border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg font-bold text-foreground">Show/Hide Columns</CardTitle>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </CardHeader>
        <CardContent className="space-y-3">
          {columns.map((column) => {
            const isHidden = hiddenColumns.has(column.id);
            return (
              <div key={column.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`column-${column.id}`}
                  checked={!isHidden}
                  onCheckedChange={(checked) => handleColumnToggle(column.id, !checked)}
                />
                <label 
                  htmlFor={`column-${column.id}`}
                  className="flex items-center gap-2 text-sm cursor-pointer flex-1"
                >
                  {isHidden ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-primary" />
                  )}
                  <span className={isHidden ? 'text-muted-foreground' : 'text-foreground'}>
                    {column.title}
                  </span>
                </label>
              </div>
            );
          })}
          
          {hiddenColumns.size > 0 && (
            <div className="pt-3 border-t border-border">
              <button
                onClick={() => onChange(new Set())}
                className="text-sm text-primary hover:underline"
              >
                Show all columns
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}