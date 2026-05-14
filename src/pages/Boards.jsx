import React, { useState, useEffect } from "react";
import { Board } from "@/api/entities/Board";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { showErrorToast } from "@/lib/error-utils";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Plus,
  Search,
  Filter,
  Grid3X3,
  LayoutList,
  Folder,
  BarChart,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import CreateBoardModal from "../components/boards/CreateBoardModal";
import EditBoardModal from "../components/boards/EditBoardModal";
import BoardCard from "../components/boards/BoardCard";
import { usePermissions } from "@/hooks/usePermissions";

export default function Boards() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { canCreateBoard, canEditBoard, canDeleteBoard } = usePermissions();
  const [boards, setBoards] = useState([]);
  const [filteredBoards, setFilteredBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBoard, setEditingBoard] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    loadBoards();
  }, []);

  useEffect(() => {
    filterBoards();
  }, [searchQuery, boards]);

  const loadBoards = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await Board.list("-updated_date");
      setBoards(data || []);
    } catch (error) {
      console.error("Error loading boards:", error);
      setLoadError(error?.message || String(error));
    }
    setIsLoading(false);
  };

  const filterBoards = () => {
    if (!searchQuery) {
      setFilteredBoards(boards);
      return;
    }

    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = boards.filter(board =>
      board.title.toLowerCase().includes(lowercasedQuery) ||
      board.description?.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredBoards(filtered);
  };

  const handleCreateBoard = async (boardData) => {
    try {
      const newBoard = await Board.create(boardData);
      setBoards(prev => [newBoard, ...prev].sort((a,b) => new Date(b.updated_date) - new Date(a.updated_date)));
      setShowCreateModal(false);
      toast({
        title: "Board created",
        description: `"${boardData.title}" has been created successfully.`,
      });
      navigate(createPageUrl(`Board?id=${newBoard.id}`));
    } catch (error) {
      console.error("Error creating board:", error);
      showErrorToast(toast, "Creation failed", error);
      throw error; // Re-throw so CreateBoardModal knows the operation failed
    }
  };

  const handleOpenEditModal = (board) => {
    setEditingBoard(board);
    setShowEditModal(true);
  };

  const handleUpdateBoard = async (boardId, updatedData) => {
    try {
      await Board.update(boardId, updatedData);
      setBoards(prevBoards => 
        prevBoards.map(b => 
          b.id === boardId ? { ...b, ...updatedData, updated_date: new Date().toISOString() } : b
        ).sort((a,b) => new Date(b.updated_date) - new Date(a.updated_date))
      );
      setShowEditModal(false);
      setEditingBoard(null);
    } catch (error) {
      console.error("Error updating board:", error);
      showErrorToast(toast, "Update failed", error);
      loadBoards();
    }
  };

  const handleDeleteBoard = async (boardId) => {
    try {
      await Board.delete(boardId);
      setBoards(prev => prev.filter(board => board.id !== boardId));
    } catch (error) {
      console.error("Error deleting board:", error);
      showErrorToast(toast, "Delete failed", error);
    }
  };

  if (loadError) {
    return (
      <div className="p-4 md:p-6 bg-background min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="w-10 h-10 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Failed to load boards</h2>
          <p className="text-sm text-muted-foreground">There was a problem fetching your boards.</p>
          {loadError && (
            <p className="text-xs text-muted-foreground bg-muted p-2 rounded-md font-mono break-all max-w-md">
              {loadError}
            </p>
          )}
          <Button variant="outline" onClick={loadBoards}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              My Boards
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage your projects and workflows
            </p>
          </div>
          {canCreateBoard && (
            <Button
              onClick={() => setShowCreateModal(true)}
              className="rounded-lg h-10 px-5 font-medium text-sm transition-colors duration-150"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Board
            </Button>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search boards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-lg h-10 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              onClick={() => setViewMode("grid")}
              className="rounded-lg h-10 px-3"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              onClick={() => setViewMode("list")}
              className="rounded-lg h-10 px-3"
            >
              <LayoutList className="w-4 h-4" />
            </Button>
            <Link to={createPageUrl("Analytics")}>
              <Button variant="outline" className="rounded-lg h-10 px-3 text-sm">
                <BarChart className="w-4 h-4 mr-1.5" />
                Analytics
              </Button>
            </Link>
            <Button variant="outline" className="rounded-lg h-10 px-3 text-sm">
              <Filter className="w-4 h-4 mr-1.5" />
              Filter
            </Button>
          </div>
        </div>

        {/* Boards Display */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className={`gap-6 ${viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "space-y-3"}`}>
              {Array(viewMode === "grid" ? 3 : 3).fill(0).map((_, i) => (
                 viewMode === "grid" ? (
                    <Card key={i} className="animate-pulse bg-card rounded-xl border border-border h-[220px]">
                      <CardContent className="p-5 space-y-3 h-full flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                              <div className="w-10 h-10 bg-muted rounded-lg"></div>
                              <div className="w-14 h-5 bg-muted rounded-full"></div>
                          </div>
                          <div className="h-5 bg-muted rounded w-3/4 mt-3"></div>
                          <div className="h-3 bg-muted rounded w-full mt-1.5"></div>
                          <div className="h-3 bg-muted rounded w-2/3 mt-1"></div>
                        </div>
                        <div className="flex justify-between items-center pt-2.5 border-t border-border mt-2.5">
                            <div className="h-3 bg-muted rounded w-1/3"></div>
                            <div className="h-3 bg-muted rounded w-1/4"></div>
                        </div>
                      </CardContent>
                    </Card>
                 ) : (
                    <Card key={i} className="animate-pulse bg-card rounded-lg border border-border h-[60px]">
                        <CardContent className="p-3 flex items-center justify-between h-full">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-full bg-muted rounded-l-lg"></div>
                                <div className="w-8 h-8 bg-muted rounded-md"></div>
                                <div>
                                    <div className="h-3.5 bg-muted rounded w-28 mb-1"></div>
                                    <div className="h-2.5 bg-muted rounded w-20"></div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-12 bg-muted rounded-full"></div>
                                <div className="h-3 w-20 bg-muted rounded-md hidden sm:block"></div>
                                <div className="h-7 w-7 bg-muted rounded-md"></div>
                            </div>
                        </CardContent>
                    </Card>
                 )
              ))}
            </div>
          ) : filteredBoards.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Folder className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">
                {searchQuery ? "No boards match your search" : "No boards yet"}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-6">
                {searchQuery
                  ? "Try adjusting your search query or clearing filters."
                  : "Create your first board to get started."}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="rounded-xl h-12 px-6 font-medium transition-colors duration-150"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Board
                </Button>
              )}
            </motion.div>
          ) : (
            <div className={viewMode === "grid" 
              ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
              : "space-y-3"
            }>
              {filteredBoards.map((board, index) => (
                <BoardCard
                  key={board.id}
                  board={board}
                  viewMode={viewMode}
                  index={index}
                  onDelete={canDeleteBoard ? handleDeleteBoard : undefined}
                  onEdit={canEditBoard ? handleOpenEditModal : undefined}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        <CreateBoardModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateBoard}
        />
        {editingBoard && (
          <EditBoardModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setEditingBoard(null);
            }}
            onSubmit={handleUpdateBoard}
            board={editingBoard}
          />
        )}
      </div>
    </div>
  );
}