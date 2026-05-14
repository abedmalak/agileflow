
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Calendar, Hash, CheckCircle2, Users, DollarSign } from "lucide-react";
import { format, min, max } from "date-fns";

export default function GroupSummaryRow({ items, columns, groupId, dragHandleWidth, checkboxWidth, taskColumnWidth, priorityColumnWidth, actionColumnWidth, totalMinWidth }) {
  
  const getSummaryForColumn = (column) => {
    const values = items.map(item => 
      column.id === 'task' ? item.title : item.data?.[column.id]
    ).filter(val => val !== null && val !== undefined && val !== '');

    if (values.length === 0) {
      return { type: 'empty', content: '-' };
    }

    switch (column.type) {
      case 'status': {
        const statusCounts = {};
        values.forEach(status => {
          statusCounts[status] = (statusCounts[status] || 0) + 1;
        });
        
        const statusChoices = column.options?.choices || [];
        return {
          type: 'status_summary_colors',
          content: (
            <div className="flex items-center gap-0.5 flex-wrap">
              {statusChoices.map(choice => {
                const count = statusCounts[choice.label] || 0;
                if (count === 0) return null;
                return Array.from({ length: count }).map((_, i) => (
                  <div
                    key={`${choice.label}-${i}`}
                    className="w-2 h-4 rounded-sm"
                    style={{ backgroundColor: choice.color || '#e5e7eb' }}
                    title={`${count} ${choice.label}`}
                  />
                ));
              })}
            </div>
          )
        };
      }

      case 'priority': {
        const priorityCounts = {};
        values.forEach(priority => {
          priorityCounts[priority] = (priorityCounts[priority] || 0) + 1;
        });
        
        const priorityChoices = column.options?.choices || [];
        return {
          type: 'priority_summary_colors',
          content: (
            <div className="flex items-center gap-0.5 flex-wrap">
              {priorityChoices.map(choice => {
                const count = priorityCounts[choice.value] || 0;
                if (count === 0) return null;
                return Array.from({ length: count }).map((_, i) => (
                  <div
                    key={`${choice.value}-${i}`}
                    className="w-2 h-4 rounded-sm"
                    style={{ backgroundColor: choice.color || '#e5e7eb' }}
                    title={`${count} ${choice.label}`}
                  />
                ));
              })}
            </div>
          )
        };
      }

      case 'date': {
        const dates = values.filter(v => v).map(d => new Date(d));
        if (dates.length === 0) return { type: 'empty', content: '-' };
        
        const earliestDate = min(dates);
        const latestDate = max(dates);
        
        return {
          type: 'date_range',
          content: (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {dates.length === 1 
                ? format(earliestDate, 'MMM d')
                : `${format(earliestDate, 'MMM d')} - ${format(latestDate, 'MMM d')}`
              }
            </div>
          )
        };
      }

      case 'number': {
        const numbers = values.map(v => parseFloat(v)).filter(n => !isNaN(n));
        if (numbers.length === 0) return { type: 'empty', content: '-' };
        
        const sum = numbers.reduce((a, b) => a + b, 0);
        const avg = sum / numbers.length;
        
        return {
          type: 'number_summary',
          content: (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Hash className="w-3 h-3" />
              <span>Σ {sum.toLocaleString()}</span>
              <span className="text-muted-foreground">|</span>
              <span>⌀ {avg.toFixed(1)}</span>
            </div>
          )
        };
      }

      case 'budget': {
        const amounts = values.map(v => parseFloat(v)).filter(n => !isNaN(n));
        if (amounts.length === 0) return { type: 'empty', content: '-' };
        
        const total = amounts.reduce((a, b) => a + b, 0);
        const currency = column.options?.currency || 'USD';
        
        return {
          type: 'budget_summary',
          content: (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <DollarSign className="w-3 h-3" />
              <span>{currency} {total.toLocaleString()}</span>
            </div>
          )
        };
      }

      case 'people': {
        const people = [...new Set(values)];
        return {
          type: 'people_summary',
          content: (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="w-3 h-3" />
              <span>{people.length} people</span>
            </div>
          )
        };
      }

      case 'checkbox': {
        const checkedCount = values.filter(v => v === true).length;
        const totalCount = values.length;
        const percentage = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;
        
        return {
          type: 'checkbox_summary',
          content: (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CheckCircle2 className="w-3 h-3" />
              <span>{checkedCount}/{totalCount} ({percentage}%)</span>
            </div>
          )
        };
      }

      case 'dropdown': {
        const optionCounts = {};
        values.forEach(option => {
          optionCounts[option] = (optionCounts[option] || 0) + 1;
        });
        
        return {
          type: 'dropdown_summary',
          content: (
            <div className="flex gap-1 flex-wrap">
              {Object.entries(optionCounts).slice(0, 3).map(([option, count]) => (
                <Badge key={option} variant="outline" className="text-xs px-1.5 py-0.5">
                  {count} {option}
                </Badge>
              ))}
              {Object.keys(optionCounts).length > 3 && (
                <span className="text-xs text-muted-foreground">+{Object.keys(optionCounts).length - 3}</span>
              )}
            </div>
          )
        };
      }

      case 'text':
      default: {
        return {
          type: 'text_summary',
          content: (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>{values.length} items</span>
            </div>
          )
        };
      }
    }
  };

  return (
    <div 
      className="flex items-stretch bg-muted border-b border-border min-h-[40px] text-xs"
      style={{ minWidth: `${totalMinWidth}px` }}
    >
      {/* Sticky Left: Drag Handle */}
      <div
        className="flex-shrink-0 bg-muted flex items-center justify-center"
        style={{
          width: dragHandleWidth,
          position: 'sticky',
          left: 0,
          zIndex: 1
        }}
      >
        {/* Intentionally empty or add a very subtle indicator if needed */}
      </div>

      {/* Sticky Left: Checkbox */}
      <div 
        className="flex-shrink-0 bg-muted flex items-center justify-center"
        style={{
          width: checkboxWidth,
          position: 'sticky',
          left: dragHandleWidth,
          zIndex: 1
        }}
      >
         {/* Intentionally empty or add a very subtle indicator if needed */}
      </div>

      {/* Summary Cells */}
      {columns.map((column) => {
        let cellStyle = {
          width: column.width || 150,
          minWidth: column.width || 150,
        };
        
        // Make Task column sticky
        if (column.id === 'task') {
          cellStyle = {
            ...cellStyle,
            width: taskColumnWidth,
            minWidth: taskColumnWidth,
            position: 'sticky',
            left: dragHandleWidth + checkboxWidth,
            zIndex: 1,
          };
        }
        // Make Priority column sticky next to Task
        else if (column.type === 'priority') {
          cellStyle = {
            ...cellStyle,
            width: priorityColumnWidth,
            minWidth: priorityColumnWidth,
            position: 'sticky',
            left: dragHandleWidth + checkboxWidth + taskColumnWidth,
            zIndex: 1,
          };
        }

        const summary = getSummaryForColumn(column);
        
        return (
          <div
            key={column.id}
            className="px-3 py-2 border-l border-border flex items-center"
            style={cellStyle}
          >
            {summary.content}
          </div>
        );
      })}

      {/* Flexible spacer */}
      <div className="flex-1 min-w-0 bg-muted" />

      {/* Sticky Right: Action Column Space */}
      <div 
        className="flex-shrink-0 bg-muted"
        style={{ 
          width: actionColumnWidth, 
          position: 'sticky', 
          right: 0, 
          zIndex: 1 
        }}
      />
    </div>
  );
}
