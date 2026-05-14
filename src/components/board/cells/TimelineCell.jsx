import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

export default function TimelineCell({ value, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const popoverRef = useRef(null);

  // Parse value — could be {from, to} object or JSON string
  let parsed = null;
  if (value && typeof value === 'object' && value.from) {
    parsed = value;
  } else if (typeof value === 'string') {
    try {
      const obj = JSON.parse(value);
      if (obj.from) parsed = obj;
    } catch {
      // not JSON
    }
  }

  const [fromDate, setFromDate] = useState(parsed?.from || '');
  const [toDate, setToDate] = useState(parsed?.to || '');

  // Close on outside click
  useEffect(() => {
    if (!isEditing) return;
    const handleClick = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        handleSave();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isEditing, fromDate, toDate]);

  const handleSave = () => {
    if (fromDate || toDate) {
      onUpdate({ from: fromDate, to: toDate });
    } else {
      onUpdate(null);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setFromDate(parsed?.from || '');
      setToDate(parsed?.to || '');
      setIsEditing(false);
    }
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  if (isEditing) {
    return (
      <div className="relative" ref={popoverRef}>
        <div className="absolute top-1/2 left-0 -translate-y-1/2 z-20 bg-popover border border-border rounded-lg shadow-md p-3 min-w-[280px]">
          <p className="text-xs font-medium text-muted-foreground mb-2">Set timeline</p>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-[10px] text-muted-foreground mb-0.5 block">Start</label>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-8 text-xs"
                autoFocus
              />
            </div>
            <span className="text-muted-foreground text-xs mt-4">–</span>
            <div className="flex-1">
              <label className="text-[10px] text-muted-foreground mb-0.5 block">End</label>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-8 text-xs"
              />
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <button
              onClick={handleSave}
              className="text-xs text-primary hover:text-primary/80 font-medium px-2 py-1 rounded hover:bg-accent transition-colors"
            >
              Done
            </button>
          </div>
        </div>

        {/* Keep inline display while popover is open */}
        <CellDisplay parsed={parsed} />
      </div>
    );
  }

  if (!parsed || (!parsed.from && !parsed.to)) {
    return (
      <div
        className="cursor-pointer text-muted-foreground hover:bg-accent hover:rounded px-2 py-1 -mx-2 -my-1 transition-colors flex items-center gap-2 text-sm"
        onClick={() => setIsEditing(true)}
      >
        <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="truncate">Set timeline</span>
      </div>
    );
  }

  return (
    <div onClick={() => setIsEditing(true)}>
      <CellDisplay parsed={parsed} />
    </div>
  );
}

function CellDisplay({ parsed }) {
  if (!parsed || (!parsed.from && !parsed.to)) {
    return (
      <span className="text-sm text-muted-foreground flex items-center gap-1">
        <Calendar className="w-3.5 h-3.5" />
        Set timeline
      </span>
    );
  }

  const formatDate = (dateStr) => {
    try {
      return format(new Date(dateStr), 'MMM d');
    } catch {
      return dateStr;
    }
  };

  const fromStr = parsed.from ? formatDate(parsed.from) : '?';
  const toStr = parsed.to ? formatDate(parsed.to) : '?';

  const isOverdue = parsed.to && new Date(parsed.to) < new Date() &&
    new Date(parsed.to).toDateString() !== new Date().toDateString();

  return (
    <div
      className={`cursor-pointer hover:opacity-80 transition-opacity px-2 py-1 -mx-2 -my-1 rounded text-sm flex items-center gap-1 whitespace-nowrap overflow-hidden ${
        isOverdue ? 'bg-destructive/10 text-destructive' : 'text-foreground'
      }`}
    >
      <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground" />
      <span className="truncate">{fromStr} – {toStr}</span>
    </div>
  );
}
