import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Folder, Lock, Globe, MoreHorizontal, Calendar, Trash2, Edit3 } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function BoardCard({ board, viewMode, index, onDelete, onEdit }) {
  const handleDelete = (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    if (window.confirm(`Are you sure you want to delete the board "${board.title}"? This cannot be undone.`)) {
      onDelete(board.id);
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(board);
  };

  const boardColor = board.color || '#0073EA';

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Card className="border border-border hover:shadow-sm transition-all duration-200 group rounded-lg overflow-hidden cursor-pointer">
          <div className="flex items-center">
            <div
              className="w-1.5 h-16 flex-shrink-0"
              style={{ backgroundColor: boardColor }}
            />
            <CardContent className="p-3 flex-1">
              <div className="flex items-center justify-between">
                <Link to={createPageUrl(`Board?id=${board.id}`)} className="flex items-center gap-3 flex-grow min-w-0">
                  <div 
                    className="w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${boardColor}20` }} // Lighter shade for icon background
                  >
                    <Folder 
                      className="w-4 h-4"
                      style={{ color: boardColor }}
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-semibold text-foreground group-hover:text-[${boardColor}] transition-colors text-sm truncate">
                      {board.title}
                    </h3>
                    <p className="text-muted-foreground text-xs mt-0.5 truncate">
                      {board.description || 'No description'}
                    </p>
                  </div>
                </Link>
                <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                  <Badge
                    variant="outline"
                    className={`border-none text-xs px-2 py-0.5 rounded-full ${
                      board.visibility === 'private'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {board.visibility === 'private' ? (
                      <Lock className="w-2.5 h-2.5 mr-1" />
                    ) : (
                      <Globe className="w-2.5 h-2.5 mr-1" />
                    )}
                    {board.visibility}
                  </Badge>
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(board.updated_date), { addSuffix: true })}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:bg-muted rounded-md" onClick={(e) => {e.preventDefault(); e.stopPropagation();}}>
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleEdit}>
                        <Edit3 className="w-3.5 h-3.5 mr-2" />
                        Edit Board
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                        <Trash2 className="w-3.5 h-3.5 mr-2" />
                        Delete Board
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Grid View
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="h-full"
    >
      <Card
        className="border border-border hover:shadow-sm transition-all duration-300 group h-full flex flex-col rounded-xl overflow-hidden"
      >
        <div 
            className="h-2 w-full" // Top color bar
            style={{backgroundColor: boardColor}}
        />
        <Link to={createPageUrl(`Board?id=${board.id}`)} className="flex-grow block p-5">
          <div className="flex items-start justify-between mb-4">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${boardColor}20` }} // Lighter shade for icon background
            >
              <Folder 
                className="w-5 h-5"
                style={{ color: boardColor }}
              />
            </div>
            <Badge 
              variant="outline" 
              className={`border-none text-xs px-2.5 py-1 rounded-full ${
                board.visibility === 'private' 
                  ? 'bg-rose-100 text-rose-700' 
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {board.visibility === 'private' ? (
                <Lock className="w-3 h-3 mr-1.5" />
              ) : (
                <Globe className="w-3 h-3 mr-1.5" />
              )}
              {board.visibility}
            </Badge>
          </div>
          
          <h3 className="font-semibold text-foreground text-lg mb-2 group-hover:text-[${boardColor}] transition-colors">
            {board.title}
          </h3>

          <p className="text-muted-foreground text-sm mb-5 line-clamp-2 flex-grow">
            {board.description || 'No description provided.'}
          </p>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-4 border-t border-border">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDistanceToNow(new Date(board.updated_date), { addSuffix: true })}</span>
            </div>
            {/* <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>1 member</span> 
            </div> */}
          </div>
        </Link>
        <div className="p-2 border-t border-border bg-muted/50">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-center text-xs text-muted-foreground hover:bg-muted hover:text-foreground">
                  <MoreHorizontal className="w-4 h-4 mr-1.5" /> Options
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 shadow-sm rounded-md">
                <DropdownMenuItem onClick={handleEdit} className="text-foreground hover:bg-muted">
                  <Edit3 className="w-3.5 h-3.5 mr-2" />
                  Edit Board
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-red-600 hover:text-red-700 hover:bg-red-50 focus:text-red-600 focus:bg-red-50">
                  <Trash2 className="w-3.5 h-3.5 mr-2" />
                  Delete Board
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </Card>
    </motion.div>
  );
}