import React, { useState } from 'react';
import { ChevronDown, Settings, Edit3, EyeOff, Check, X } from "lucide-react"; // Changed Trash2 to EyeOff
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ColumnHeader({ column, onUpdateColumn, onDeleteColumn, style, groupId }) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(column.title);

  const handleRename = () => {
    if (newTitle.trim() && newTitle !== column.title) {
      onUpdateColumn(column.id, { title: newTitle.trim() });
    }
    setIsRenaming(false);
  };

  const handleHideFromGroup = () => {
    if (window.confirm(`Hide the column "${column.title}" from this group? You can show it again later.`)) {
      onDeleteColumn(column.id); // This will now hide instead of delete
    }
  };

  if (isRenaming) {
    return (
      <div
        className="flex items-center justify-between px-3 py-2 border-l border-border bg-card"
        style={{ width: column.width || 150, minWidth: column.width || 150, ...style }}
      >
        <Input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleRename();
            if (e.key === 'Escape') setIsRenaming(false);
          }}
          className="h-full p-0 border-none focus:ring-0 text-sm font-medium flex-1"
          autoFocus
        />
        <div className="flex">
          <Button variant="ghost" size="icon" onClick={handleRename} className="h-6 w-6">
            <Check className="w-3 h-3 text-green-500" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsRenaming(false)} className="h-6 w-6">
            <X className="w-3 h-3 text-red-500" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div 
          className="flex items-center justify-between px-3 py-3 border-l border-border group hover:bg-card transition-colors cursor-pointer"
          style={{ width: column.width || 150, minWidth: column.width || 150, ...style }}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="font-medium text-foreground text-sm truncate">
              {column.title}
            </span>
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Settings className="w-3 h-3 text-gray-500 hover:text-gray-700" />
            <ChevronDown className="w-3 h-3 text-gray-500 hover:text-gray-700" />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => setIsRenaming(true)}>
          <Edit3 className="w-3 h-3 mr-2" />
          Rename Column
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          Change Column Type
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          Configure Column
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleHideFromGroup}
          className="text-orange-600 focus:text-orange-600 focus:bg-orange-50"
        >
          <EyeOff className="w-3 h-3 mr-2" />
          Hide from Group
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}