import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export default function TextCell({ value, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    onUpdate(editValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(value || '');
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="absolute inset-x-0 top-0 z-20 bg-card border border-primary/40 rounded-md shadow-lg p-2 min-w-[200px]">
        <Textarea
          ref={textareaRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="text-xs min-h-[60px] max-h-[120px] resize-none border-0 p-0 focus-visible:ring-0 bg-transparent"
          placeholder="Enter text..."
        />
        <p className="text-[10px] text-muted-foreground mt-1">Enter to save · Shift+Enter for new line · Esc to cancel</p>
      </div>
    );
  }

  const hasValue = value && value.trim().length > 0;

  return (
    <div
      className={cn(
        "cursor-pointer text-xs w-full",
        "line-clamp-1 leading-tight",
        "hover:bg-accent/50 rounded px-1.5 py-1 -mx-1.5 -my-1 transition-colors",
        hasValue ? "text-foreground" : "text-muted-foreground"
      )}
      onClick={() => {
        setEditValue(value || '');
        setIsEditing(true);
      }}
      title={value || 'Click to edit'}
    >
      {hasValue ? value : 'Enter text...'}
    </div>
  );
}
