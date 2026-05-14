
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronRight, Plus, Trash2, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

import ItemRow from "./ItemRow";
import ColumnHeader from "./ColumnHeader";
import GroupSummary from "./GroupSummary";
import GroupSummaryRow from "./GroupSummaryRow"; // Assuming this new component exists

const DRAG_HANDLE_WIDTH = 24; // w-6
const CHECKBOX_WIDTH = 32; // w-8
const TASK_COLUMN_DEFAULT_WIDTH = 250; // Example width for Task column
const PRIORITY_COLUMN_DEFAULT_WIDTH = 120; // Width for Priority column
const DELETE_BUTTON_WIDTH = 50; // Changed to match ADD_COLUMN_WIDTH
const ADD_COLUMN_WIDTH = 50; // Add column button width

export default function GroupSection({
  group,
  items,
  columns, // These are all possible columns from the board
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onReorderItems,
  onUpdateColumn,
  onDeleteColumn, // This is still relevant for true column deletion (board-level)
  onAddColumn,
  isLoading,
  onDeleteGroup,
  onHideColumnFromGroup // New prop for hiding column from specific group
}) {
  const [isCollapsed, setIsCollapsed] = useState(group.collapsed || false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState("");
  const addRowRef = useRef(null);

  const handleAddItemLocal = async () => {
    if (newItemTitle.trim()) {
      await onAddItem(group.id, newItemTitle.trim());
      setNewItemTitle("");
      setIsAddingItem(false);
    }
  };

  const handleCancelAdd = () => {
    setIsAddingItem(false);
    setNewItemTitle("");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddItemLocal();
    } else if (e.key === 'Escape') {
      handleCancelAdd();
    }
  };

  const handleInputBlur = (e) => {
    // Don't dismiss if clicking within the add row (e.g. confirm/cancel buttons)
    if (addRowRef.current && addRowRef.current.contains(e.relatedTarget)) {
      return;
    }
    if (!newItemTitle.trim()) {
      setIsAddingItem(false);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    onReorderItems(group.id, sourceIndex, destinationIndex);
  };

  const handleDeleteGroupClick = (e) => {
    e.stopPropagation(); // Prevent group from collapsing/expanding
    if (window.confirm(`Are you sure you want to delete the group "${group.title}" and all its tasks? This cannot be undone.`)) {
      onDeleteGroup(group.id);
    }
  };

  // Get effective columns for this group (board columns filtered by visible_columns + custom columns)
  const getEffectiveColumns = () => {
    // If group.visible_columns is defined, filter columns based on it
    // BUT if it's undefined or empty, show ALL board columns by default
    const visibleBoardColumns = (group.visible_columns && group.visible_columns.length > 0)
      ? columns.filter(col => group.visible_columns.includes(col.id))
      : columns; // Show all board columns if visible_columns is not set or empty

    // Merge with group-specific custom columns
    const customColumns = group.custom_columns || [];
    
    // Combine visible board columns and custom columns, ensuring uniqueness by ID
    const combinedColumns = [...visibleBoardColumns, ...customColumns];
    const uniqueColumnIds = new Set();
    const effectiveCols = [];
    for (const col of combinedColumns) {
      if (!uniqueColumnIds.has(col.id)) {
        uniqueColumnIds.add(col.id);
        effectiveCols.push(col);
      }
    }
    return effectiveCols;
  };

  const rawEffectiveColumns = getEffectiveColumns();
  // Ensure the task column always exists at the front so titles are visible
  const hasTaskCol = rawEffectiveColumns.some(col => col.id === 'task');
  const effectiveColumns = hasTaskCol
    ? rawEffectiveColumns
    : [{ id: 'task', title: 'Task', type: 'task', width: TASK_COLUMN_DEFAULT_WIDTH }, ...rawEffectiveColumns];
  const taskColumn = effectiveColumns.find(col => col.id === 'task');
  const taskColumnWidth = taskColumn?.width || TASK_COLUMN_DEFAULT_WIDTH;
  
  const priorityColumn = effectiveColumns.find(col => col.type === 'priority');
  const priorityColumnWidth = priorityColumn?.width || PRIORITY_COLUMN_DEFAULT_WIDTH;
  
  // Calculate minimum width needed for all effective columns
  const columnsWidth = effectiveColumns.reduce((total, col) => total + (col.width || 150), 0);
  const totalMinWidth = DRAG_HANDLE_WIDTH + CHECKBOX_WIDTH + columnsWidth + ADD_COLUMN_WIDTH; // Removed DELETE_BUTTON_WIDTH from here as it's part of the "add column" space now.

  const handleHideColumn = (columnId) => {
    // Hide column from this specific group
    onHideColumnFromGroup(group.id, columnId);
  };

  return (
    <div className="border-b border-border last:border-b-0">
      {/* Group Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted transition-colors relative"
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{ borderLeft: `4px solid ${group.color}` }}
      >
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-muted">
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
          <h3 className="font-bold text-foreground text-lg">{group.title}</h3>
          <span className="text-sm text-muted-foreground">
            {isCollapsed && items.length === 0 ? '(empty)' : `(${items.length})`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <GroupSummary items={items} columns={columns} /> {/* Still uses original columns for overall summary */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-red-100 text-red-500 hover:text-red-600 opacity-50 hover:opacity-100 transition-opacity"
            onClick={handleDeleteGroupClick}
            title="Delete group"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Table Area */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="overflow-x-auto relative"> {/* Horizontal scroll container */}
              {/* Column Headers */}
              <div 
                className="flex bg-muted border-b border-border sticky top-0 z-10" 
                style={{ minWidth: `${totalMinWidth}px` }} // Ensure minimum width
              > 
                {/* Sticky Left: Drag Handle */}
                <div
                  className="flex-shrink-0 bg-muted" // Sticky background for drag handle
                  style={{ width: DRAG_HANDLE_WIDTH, position: 'sticky', left: 0, zIndex: 2 }}
                />

                {/* Sticky Left: Checkbox */}
                <div
                  className="flex-shrink-0 bg-muted" // Sticky background for checkbox
                  style={{ width: CHECKBOX_WIDTH, position: 'sticky', left: DRAG_HANDLE_WIDTH, zIndex: 2 }}
                />

                {/* Column Headers */}
                {effectiveColumns.map((column) => {
                  let stickyProps = {};
                  if (column.id === 'task') {
                    stickyProps = {
                      position: 'sticky',
                      left: DRAG_HANDLE_WIDTH + CHECKBOX_WIDTH,
                      zIndex: 2,
                      width: taskColumnWidth,
                      minWidth: taskColumnWidth
                    };
                  } else if (column.type === 'priority') {
                    stickyProps = {
                      position: 'sticky',
                      left: DRAG_HANDLE_WIDTH + CHECKBOX_WIDTH + taskColumnWidth,
                      zIndex: 2,
                      width: priorityColumnWidth,
                      minWidth: priorityColumnWidth
                    };
                  }
                  return (
                    <ColumnHeader
                      key={column.id}
                      column={column}
                      onUpdateColumn={onUpdateColumn}
                      onDeleteColumn={handleHideColumn} // Changed to hide instead of delete
                      style={stickyProps} // Pass style for sticky positioning
                      groupId={group.id} // Pass groupId for specific column actions
                    />
                  );
                })}
                
                {/* Add Column Button - sits right after the last column header */}
                <div
                  className="flex items-center justify-center px-3 py-3 border-l border-border hover:bg-primary/10 transition-colors cursor-pointer bg-muted flex-shrink-0 group/addcol"
                  style={{
                    width: ADD_COLUMN_WIDTH,
                    minWidth: ADD_COLUMN_WIDTH,
                  }}
                  onClick={(e) => { e.stopPropagation(); onAddColumn?.(); }}
                  title="Add new column"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onAddColumn?.(); } }}
                >
                  <Plus className="w-4 h-4 text-muted-foreground group-hover/addcol:text-primary transition-colors" />
                </div>

                {/* Flexible spacer after add-column button */}
                <div className="flex-1 min-w-0 bg-muted" />
              </div>

              {/* Items */}
              <div>
                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
                    <p className="text-sm text-muted-foreground">Loading items...</p>
                  </div>
                ) : items.length === 0 && !isAddingItem ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-sm text-muted-foreground mb-3">No items in this group. Click + to add one.</p>
                    <Button
                      onClick={() => setIsAddingItem(true)}
                      variant="outline"
                      size="sm"
                      className="border-border rounded-lg"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                ) : (
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId={group.id}>
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                          {items.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                              {(providedDraggable, snapshot) => (
                                <ItemRow
                                  item={item}
                                  columns={effectiveColumns} // Use effective columns
                                  onUpdate={onUpdateItem}
                                  onDelete={onDeleteItem}
                                  index={index}
                                  isDragging={snapshot.isDragging}
                                  // Pass draggable props directly to ItemRow for it to handle
                                  draggableProvided={providedDraggable}
                                  // Define fixed widths for sticky calculations
                                  dragHandleWidth={DRAG_HANDLE_WIDTH}
                                  checkboxWidth={CHECKBOX_WIDTH}
                                  taskColumnWidth={taskColumnWidth}
                                  priorityColumnWidth={priorityColumnWidth} // Pass priority column width
                                  totalMinWidth={totalMinWidth} // Pass total width for consistent sizing
                                  actionColumnWidth={ADD_COLUMN_WIDTH} // Pass the width for the action column
                                />
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}

                          {/* Add Item Row */}
                          {isAddingItem ? (
                            <div
                              ref={addRowRef}
                              className="flex items-center border-b border-border hover:bg-muted min-h-[48px]"
                              style={{ minWidth: `${totalMinWidth}px` }}
                            >
                              {/* Sticky Left: Drag Handle */}
                              <div className="flex-shrink-0" style={{ width: DRAG_HANDLE_WIDTH, position: 'sticky', left: 0, zIndex: 1 }}></div>

                              {/* Sticky Left: Checkbox */}
                              <div className="flex-shrink-0" style={{ width: CHECKBOX_WIDTH, position: 'sticky', left: DRAG_HANDLE_WIDTH, zIndex: 1 }}></div>

                              {/* Sticky Left: Task Column */}
                              <div
                                className="flex-1 px-3 py-2"
                                style={{
                                  width: taskColumnWidth,
                                  minWidth: taskColumnWidth,
                                  position: 'sticky',
                                  left: DRAG_HANDLE_WIDTH + CHECKBOX_WIDTH,
                                  zIndex: 1,
                                }}
                              >
                                <div className="flex items-center gap-1">
                                  <Input
                                    value={newItemTitle}
                                    onChange={(e) => setNewItemTitle(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    onBlur={handleInputBlur}
                                    placeholder="Enter item name..."
                                    className="border-none bg-transparent p-0 h-auto focus:ring-0 text-foreground font-medium flex-1"
                                    autoFocus
                                  />
                                  <button
                                    type="button"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={handleAddItemLocal}
                                    disabled={!newItemTitle.trim()}
                                    className="p-1 rounded text-green-500 hover:text-green-600 hover:bg-green-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    title="Add task (Enter)"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={handleCancelAdd}
                                    className="p-1 rounded text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-500/10 transition-colors"
                                    title="Cancel (Esc)"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              {/* Regular Columns */}
                              {effectiveColumns.filter(c => c.id !== 'task').map((column) => (
                                <div
                                  key={column.id}
                                  className="px-3 py-2 border-l border-border"
                                  style={{ width: column.width || 150, minWidth: column.width || 150 }}
                                />
                              ))}

                              {/* Flexible spacer */}
                              <div className="flex-1 min-w-0" />

                              {/* Sticky Right: Action Column Space (for alignment) */}
                              <div
                                className="flex-shrink-0"
                                style={{
                                  width: ADD_COLUMN_WIDTH,
                                  position: 'sticky',
                                  right: 0,
                                  zIndex: 1,
                                }}
                              ></div>
                            </div>
                          ) : (
                            <div
                              className="flex items-center border-b border-border hover:bg-muted min-h-[48px] group"
                              style={{ minWidth: `${totalMinWidth}px` }}
                            >
                              {/* Sticky Left: Drag Handle */}
                              <div className="flex-shrink-0" style={{ width: DRAG_HANDLE_WIDTH, position: 'sticky', left: 0, zIndex: 1 }}></div>

                              {/* Sticky Left: Checkbox */}
                              <div className="flex-shrink-0" style={{ width: CHECKBOX_WIDTH, position: 'sticky', left: DRAG_HANDLE_WIDTH, zIndex: 1 }}></div>

                              {/* Sticky Left: Task Column */}
                              <div
                                className="flex-1 px-3 py-2"
                                style={{
                                  width: taskColumnWidth,
                                  minWidth: taskColumnWidth,
                                  position: 'sticky',
                                  left: DRAG_HANDLE_WIDTH + CHECKBOX_WIDTH,
                                  zIndex: 1,
                                }}
                              >
                                <Button
                                  onClick={() => setIsAddingItem(true)}
                                  variant="ghost"
                                  className="text-muted-foreground hover:text-primary h-auto p-0 font-normal opacity-60 hover:opacity-100 transition-opacity"
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add task
                                </Button>
                              </div>

                              {/* Regular Columns */}
                              {effectiveColumns.filter(c => c.id !== 'task').map((column) => (
                                <div
                                  key={column.id}
                                  className="px-3 py-2 border-l border-border"
                                  style={{ width: column.width || 150, minWidth: column.width || 150 }}
                                />
                              ))}

                              {/* Flexible spacer */}
                              <div className="flex-1 min-w-0" />

                              {/* Sticky Right: Action Column Space (for alignment) */}
                              <div
                                className="flex-shrink-0"
                                style={{
                                  width: ADD_COLUMN_WIDTH,
                                  position: 'sticky',
                                  right: 0,
                                  zIndex: 1,
                                }}
                              ></div>
                            </div>
                          )}

                          {/* Summary Row */}
                          <GroupSummaryRow 
                            items={items}
                            columns={effectiveColumns} // Use effective columns for summary row
                            groupId={group.id}
                            dragHandleWidth={DRAG_HANDLE_WIDTH}
                            checkboxWidth={CHECKBOX_WIDTH}
                            taskColumnWidth={taskColumnWidth}
                            priorityColumnWidth={priorityColumnWidth}
                            actionColumnWidth={ADD_COLUMN_WIDTH}
                            totalMinWidth={totalMinWidth}
                          />
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
