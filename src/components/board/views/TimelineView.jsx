import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import {
  format, addDays, subDays, startOfWeek, endOfWeek,
  eachDayOfInterval, eachWeekOfInterval, differenceInDays,
  addMonths, subMonths, startOfMonth, endOfMonth, isToday,
  isWeekend
} from 'date-fns';
import { cn } from "@/lib/utils";

// Extracts start/end dates from an item
function getItemDates(item, timelineColId, startDateColId, endDateColId) {
  if (timelineColId) {
    const val = item.data?.[timelineColId];
    if (val && typeof val === 'object') return { start: val.from, end: val.to };
    if (typeof val === 'string') {
      try { const p = JSON.parse(val); return { start: p.from, end: p.to }; }
      catch { /* ignore */ }
    }
    return { start: null, end: null };
  }
  return { start: item.data?.[startDateColId], end: item.data?.[endDateColId] };
}

// Priority -> bar color
const priorityBarColors = {
  critical: '#E2445C',
  high: '#FDAB3D',
  medium: '#0073EA',
  low: '#579BFC',
};

const TASK_COL_WIDTH = 220;
const ROW_HEIGHT = 44;

export default function TimelineView({ board, items }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [zoomLevel, setZoomLevel] = useState('month');
  const [timelineColId, setTimelineColId] = useState(null);
  const [startDateColId, setStartDateColId] = useState(null);
  const [endDateColId, setEndDateColId] = useState(null);

  useEffect(() => {
    const timelineCol = board?.columns?.find(col => col.type === 'timeline');
    if (timelineCol) {
      setTimelineColId(timelineCol.id);
      setStartDateColId(null);
      setEndDateColId(null);
      return;
    }
    setTimelineColId(null);
    const dateCols = board?.columns?.filter(col => col.type === 'date') || [];
    if (dateCols.length >= 2) {
      setStartDateColId(dateCols[0].id);
      setEndDateColId(dateCols[1].id);
    } else if (dateCols.length === 1) {
      setStartDateColId(dateCols[0].id);
      setEndDateColId(dateCols[0].id);
    } else {
      const s = board?.columns?.find(c => c.id === 'startDate' || c.title?.toLowerCase().includes('start'))?.id;
      const e = board?.columns?.find(c => c.id === 'endDate' || c.id === 'due_date' || c.title?.toLowerCase().includes('end') || c.title?.toLowerCase().includes('due'))?.id;
      if (s) setStartDateColId(s);
      if (e) setEndDateColId(e);
    }
  }, [board]);

  // Build the time columns based on zoom level
  const { viewStart, viewEnd, columns: timeColumns } = useMemo(() => {
    let start, end, cols;

    if (zoomLevel === 'week') {
      start = startOfWeek(currentDate, { weekStartsOn: 1 });
      end = endOfWeek(currentDate, { weekStartsOn: 1 });
      const days = eachDayOfInterval({ start, end });
      cols = days.map(d => ({
        key: d.toISOString(),
        label: format(d, 'EEE'),
        subLabel: format(d, 'd'),
        date: d,
        width: 80,
        isToday: isToday(d),
        isWeekend: isWeekend(d),
      }));
    } else if (zoomLevel === 'month') {
      start = startOfMonth(currentDate);
      end = endOfMonth(currentDate);
      const days = eachDayOfInterval({ start, end });
      cols = days.map(d => ({
        key: d.toISOString(),
        label: format(d, 'd'),
        subLabel: format(d, 'EEE').charAt(0),
        date: d,
        width: 36,
        isToday: isToday(d),
        isWeekend: isWeekend(d),
      }));
    } else {
      // Quarter — show weeks
      start = startOfMonth(currentDate);
      end = endOfMonth(addMonths(currentDate, 2));
      const weeks = eachWeekOfInterval({ start, end }, { weekStartsOn: 1 });
      cols = weeks.map(w => ({
        key: w.toISOString(),
        label: format(w, 'MMM d'),
        subLabel: '',
        date: w,
        width: 60,
        isToday: false,
        isWeekend: false,
      }));
    }

    return { viewStart: start, viewEnd: end, columns: cols };
  }, [currentDate, zoomLevel]);

  const totalGridWidth = timeColumns.reduce((s, c) => s + c.width, 0);

  const handlePrev = () => {
    if (zoomLevel === 'week') setCurrentDate(subDays(currentDate, 7));
    else if (zoomLevel === 'month') setCurrentDate(subMonths(currentDate, 1));
    else setCurrentDate(subMonths(currentDate, 3));
  };

  const handleNext = () => {
    if (zoomLevel === 'week') setCurrentDate(addDays(currentDate, 7));
    else if (zoomLevel === 'month') setCurrentDate(addMonths(currentDate, 1));
    else setCurrentDate(addMonths(currentDate, 3));
  };

  const headerLabel = useMemo(() => {
    if (zoomLevel === 'week') return `Week of ${format(viewStart, 'MMM d, yyyy')}`;
    if (zoomLevel === 'month') return format(currentDate, 'MMMM yyyy');
    return `${format(viewStart, 'MMM yyyy')} — ${format(viewEnd, 'MMM yyyy')}`;
  }, [viewStart, viewEnd, currentDate, zoomLevel]);

  if (!board) return <div className="p-4 text-center text-muted-foreground">Board data not available.</div>;

  const hasSource = timelineColId || (startDateColId && endDateColId);
  if (!hasSource) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CalendarDays className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-1">Date columns required</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Add a Timeline column or two Date columns to use this view.
        </p>
      </div>
    );
  }

  // Items with valid dates
  const displayItems = items.filter(item => {
    const { start, end } = getItemDates(item, timelineColId, startDateColId, endDateColId);
    return start && end;
  });

  // Calculate bar position for an item
  const getBarStyle = (item) => {
    const { start, end } = getItemDates(item, timelineColId, startDateColId, endDateColId);
    if (!start || !end) return null;

    const itemStart = new Date(start);
    const itemEnd = new Date(end);
    if (isNaN(itemStart) || isNaN(itemEnd)) return null;

    const s = itemStart < itemEnd ? itemStart : itemEnd;
    const e = itemStart < itemEnd ? itemEnd : itemStart;

    // Clamp to view
    const clampedStart = s < viewStart ? viewStart : s;
    const clampedEnd = e > viewEnd ? viewEnd : e;

    if (clampedStart > viewEnd || clampedEnd < viewStart) return null;

    const totalDays = differenceInDays(viewEnd, viewStart) + 1;
    const startOffset = differenceInDays(clampedStart, viewStart);
    const duration = differenceInDays(clampedEnd, clampedStart) + 1;

    const leftPct = (startOffset / totalDays) * 100;
    const widthPct = (duration / totalDays) * 100;

    // Priority color
    const priorityCol = board?.columns?.find(c => c.type === 'priority');
    const pVal = item.data?.[priorityCol?.id];
    const color = priorityBarColors[pVal] || board?.color || '#0073EA';

    return { left: `${leftPct}%`, width: `${widthPct}%`, color, s, e };
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="text-base font-semibold text-foreground">{headerLabel}</h2>
        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={handlePrev}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="h-8 px-3 text-xs" onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleNext}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <div className="w-px h-6 bg-border mx-1" />
          {['week', 'month', 'quarter'].map(level => (
            <Button
              key={level}
              variant={zoomLevel === level ? 'default' : 'outline'}
              size="sm"
              className="h-8 px-3 text-xs capitalize"
              onClick={() => setZoomLevel(level)}
            >
              {level}
            </Button>
          ))}
        </div>
      </div>

      {/* Timeline grid */}
      <div className="overflow-x-auto">
        <div style={{ minWidth: TASK_COL_WIDTH + totalGridWidth }}>

          {/* Header row */}
          <div className="flex border-b border-border bg-muted/40 sticky top-0 z-10">
            <div
              className="flex-shrink-0 px-3 py-2 border-r border-border text-xs font-medium text-muted-foreground flex items-end"
              style={{ width: TASK_COL_WIDTH }}
            >
              Task
            </div>
            <div className="flex">
              {timeColumns.map(col => (
                <div
                  key={col.key}
                  className={cn(
                    'flex-shrink-0 text-center py-1.5 border-r border-border',
                    col.isToday && 'bg-primary/10',
                    col.isWeekend && !col.isToday && 'bg-muted/60'
                  )}
                  style={{ width: col.width }}
                >
                  {zoomLevel === 'month' ? (
                    <>
                      <div className="text-[10px] text-muted-foreground leading-tight">{col.subLabel}</div>
                      <div className={cn('text-xs font-medium', col.isToday ? 'text-primary' : 'text-foreground')}>{col.label}</div>
                    </>
                  ) : (
                    <>
                      <div className={cn('text-xs font-medium', col.isToday ? 'text-primary' : 'text-foreground')}>{col.label}</div>
                      {col.subLabel && <div className="text-[10px] text-muted-foreground">{col.subLabel}</div>}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Item rows */}
          {displayItems.map(item => {
            const barStyle = getBarStyle(item);
            return (
              <div key={item.id} className="flex border-b border-border hover:bg-muted/30 transition-colors" style={{ height: ROW_HEIGHT }}>
                {/* Task name */}
                <div
                  className="flex-shrink-0 px-3 flex items-center border-r border-border"
                  style={{ width: TASK_COL_WIDTH }}
                >
                  <span className="text-sm text-foreground truncate" title={item.title}>
                    {item.title}
                  </span>
                </div>

                {/* Bar area */}
                <div className="relative flex-1" style={{ width: totalGridWidth }}>
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex pointer-events-none">
                    {timeColumns.map(col => (
                      <div
                        key={col.key}
                        className={cn(
                          'flex-shrink-0 h-full border-r border-border/50',
                          col.isToday && 'bg-primary/5',
                          col.isWeekend && !col.isToday && 'bg-muted/30'
                        )}
                        style={{ width: col.width }}
                      />
                    ))}
                  </div>

                  {/* Bar */}
                  {barStyle && (
                    <div
                      className="absolute top-[8px] h-[28px] rounded-md flex items-center px-2 text-white text-xs font-medium truncate shadow-sm cursor-default"
                      style={{
                        left: barStyle.left,
                        width: barStyle.width,
                        minWidth: 4,
                        backgroundColor: barStyle.color,
                      }}
                      title={`${item.title} (${format(barStyle.s, 'MMM d')} — ${format(barStyle.e, 'MMM d')})`}
                    >
                      {item.title}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Empty states */}
          {displayItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CalendarDays className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <h3 className="text-sm font-medium text-foreground mb-1">
                {items.length === 0 ? 'No items on this board' : 'No items have timeline dates'}
              </h3>
              <p className="text-xs text-muted-foreground max-w-xs">
                {items.length === 0
                  ? 'Add items to see them on the timeline.'
                  : 'Set start and end dates on your items in the table view to see them here.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
