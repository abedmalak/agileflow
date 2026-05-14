import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Folder, Lock, Globe, ArrowRight, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import CreateBoardModal from '@/components/boards/CreateBoardModal';
import InfoTooltip from "@/components/common/InfoTooltip";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function RecentBoards({ boards, isLoading, onCreateBoard }) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateBoard = async (boardData) => {
    if (onCreateBoard) {
      await onCreateBoard(boardData);
    }
    setShowCreateModal(false);
  };

  return (
    <>
      <Card className="border border-border bg-card">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Folder className="h-4 w-4 text-muted-foreground" />
              <div>
                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-1">
                  Recent Boards
                  <InfoTooltip text="Your most recently updated project boards. Click any board to open it." />
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">Your latest project boards</p>
              </div>
            </div>
            <Link to={createPageUrl("Boards")} className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="text-sm font-medium">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <InfoTooltip text="See all your boards in a searchable list" size="xs" />
            </Link>
          </div>
        </CardHeader>

        <CardContent className="space-y-1">
          {isLoading ? (
            <div className="space-y-3">
              {Array(Math.min(3, boards?.length || 3)).fill(0).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg">
                  <Skeleton className="w-8 h-8 rounded-md" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-48 mb-1.5" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              ))}
            </div>
          ) : boards.length === 0 ? (
            <div className="text-center py-10">
              <Folder className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-sm font-medium text-foreground mb-1">No boards yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Create your first board to get started</p>
              <Button variant="outline" onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Board
              </Button>
            </div>
          ) : (
            <TooltipProvider delayDuration={150}>
              <div>
                {boards.slice(0, 10).map((board, index) => (
                  <motion.div
                    key={board.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link to={createPageUrl(`Board?id=${board.id}`)}>
                          <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent transition-colors duration-150">
                            <div
                              className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: board.color || '#0073EA' }}
                            >
                              <Folder className="w-4 h-4 text-white" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {board.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Updated {format(new Date(board.updated_date), 'MMM d, yyyy')}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div>
                                    <Badge variant="secondary" className="text-xs capitalize">
                                      {board.visibility === 'private' ? (
                                        <Lock className="w-3 h-3 mr-1" />
                                      ) : (
                                        <Globe className="w-3 h-3 mr-1" />
                                      )}
                                      {board.visibility}
                                    </Badge>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="left" className="text-xs">
                                  {board.visibility === 'private'
                                    ? 'Private — only you can see this board'
                                    : 'Public — visible to your team'}
                                </TooltipContent>
                              </Tooltip>
                              <ArrowRight className="w-4 h-4 text-muted-foreground" />
                            </div>
                          </div>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="text-xs">
                        Click to open this board
                      </TooltipContent>
                    </Tooltip>
                  </motion.div>
                ))}
              </div>
            </TooltipProvider>
          )}
        </CardContent>
      </Card>

      <CreateBoardModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateBoard}
      />
    </>
  );
}
