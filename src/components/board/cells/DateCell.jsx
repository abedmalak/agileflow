import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

export default function DateCell({ value, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');

  const handleSave = () => {
    onUpdate(editValue);
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(value || '');
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <Input
        type="date"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyPress}
        className="border-none bg-transparent p-0 h-auto focus:ring-0 text-foreground"
        autoFocus
      />
    );
  }

  if (!value) {
    return (
      <div
        className="cursor-pointer text-muted-foreground hover:bg-accent hover:rounded px-2 py-1 -mx-2 -my-1 transition-colors flex items-center gap-2"
        onClick={() => setIsEditing(true)}
      >
        <Calendar className="w-4 h-4" />
        <span>Set date</span>
      </div>
    );
  }

  const isOverdue = new Date(value) < new Date() && new Date(value).toDateString() !== new Date().toDateString();
  
  return (
    <div
      className={`cursor-pointer hover:opacity-80 transition-opacity px-2 py-1 -mx-2 -my-1 rounded text-sm ${
        isOverdue ? 'bg-destructive/10 text-destructive' : 'text-foreground'
      }`}
      onClick={() => setIsEditing(true)}
    >
      {format(new Date(value), 'MMM d')}
    </div>
  );
}