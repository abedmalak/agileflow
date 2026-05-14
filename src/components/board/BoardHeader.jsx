import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { TeamMember } from "@/api/entities/TeamMember";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/AuthContext";
import { showErrorToast } from "@/lib/error-utils";
import InviteTeamModal from "@/components/dashboard/InviteTeamModal";
import {
  ArrowLeft,
  Star,
  Table2,
  ChevronDown,
  TrendingUp,
  Edit3,
  Save,
  UserPlus,
  UserMinus,
  Loader2,
  Users
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AVATAR_COLORS = [
  'bg-blue-600 text-white',
  'bg-emerald-600 text-white',
  'bg-violet-600 text-white',
  'bg-amber-600 text-white',
  'bg-rose-600 text-white',
  'bg-cyan-600 text-white',
  'bg-indigo-600 text-white',
  'bg-pink-600 text-white',
  'bg-teal-600 text-white',
  'bg-orange-600 text-white',
];

function getAvatarColor(name) {
  if (!name) return 'bg-muted text-muted-foreground';
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function BoardHeader({
  board,
  _items,
  itemsCount,
  _selectedCount,
  currentView,
  onViewChange,
  onShowAnalytics,
  onUpdateBoard
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(board?.title || '');
  const [lastSaved, setLastSaved] = useState(new Date());
  const [collaborators, setCollaborators] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [isRemovingMember, setIsRemovingMember] = useState(false);
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const isBoardOwner = board?.user_id === currentUser?.id;

  const loadCollaborators = async () => {
    if (!board?.id) {
      setCollaborators([]);
      return;
    }

    try {
      const members = await TeamMember.listByBoard(board.id);
      setCollaborators(
        members.map((m) => ({
          id: m.id,
          name: m.profile?.full_name || m.profile?.email || 'Unknown',
          email: m.profile?.email || '',
          avatar: (m.profile?.full_name || m.profile?.email || '??')
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2),
          role: m.role || 'editor',
        }))
      );
    } catch {
      setCollaborators([]);
    }
  };

  useEffect(() => {
    loadCollaborators();
  }, [board?.id]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastSaved(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (board?.title) {
      setEditedTitle(board.title);
    }
  }, [board?.title]);

  // board.color is data-driven and used only for the color indicator strip
  const boardColor = board?.color || null;

  const handleSaveTitle = async () => {
    setIsEditing(false);
    if (editedTitle.trim() && editedTitle !== board?.title && onUpdateBoard) {
      try {
        await onUpdateBoard({ title: editedTitle.trim() });
      } catch (error) {
        console.error('Error saving title:', error);
        setEditedTitle(board?.title || '');
      }
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const handleRemoveCollaborator = async () => {
    if (!memberToRemove) return;

    setIsRemovingMember(true);
    try {
      await TeamMember.remove(memberToRemove.id);
      toast({
        title: 'Team member removed',
        description: `${memberToRemove.name} no longer has access to this board.`,
      });
      setMemberToRemove(null);
      await loadCollaborators();
    } catch (error) {
      showErrorToast(toast, 'Failed to remove team member', error);
    } finally {
      setIsRemovingMember(false);
    }
  };

  const showTeamControls = isBoardOwner || collaborators.length > 0;

  return (
    <TooltipProvider>
      <>
      <div className="bg-card sticky top-16 z-40 shadow-sm border-b border-border">
        {/* Data-driven color strip — keep as inline style since it comes from user data */}
        {boardColor && isScrolled && (
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ backgroundColor: boardColor }}
          />
        )}

        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to={createPageUrl("Boards")}>
                    <Button variant="ghost" size="icon" className="rounded-lg h-9 w-9 transition-colors duration-150">
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Back to Boards</TooltipContent>
              </Tooltip>

              <div className="flex items-center gap-3">
                {/* Board icon — data-driven color kept as inline style */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center bg-muted"
                  style={boardColor ? { backgroundColor: boardColor } : undefined}
                >
                  <Table2 className={`w-5 h-5 ${boardColor ? 'text-white' : 'text-muted-foreground'}`} />
                </div>

                <div className="space-y-1">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveTitle();
                          if (e.key === 'Escape') setIsEditing(false);
                        }}
                        className="text-xl font-bold h-8 w-64"
                        autoFocus
                      />
                      <Button size="sm" onClick={handleSaveTitle} className="h-8">
                        <Save className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <h1
                          className="text-lg font-semibold text-foreground cursor-pointer hover:text-primary transition-colors flex items-center gap-2 group"
                          onClick={() => setIsEditing(true)}
                        >
                          {board?.title}
                          <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h1>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">Click to rename this board</TooltipContent>
                    </Tooltip>
                  )}

                  <div className="flex items-center gap-3 text-xs">
                    <DropdownMenu>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-muted-foreground hover:bg-muted rounded-md">
                              <Table2 className="w-3 h-3 mr-1" />
                              {currentView === 'table' ? 'Main table' :
                               currentView === 'kanban' ? 'Kanban' :
                               currentView === 'calendar' ? 'Calendar' :
                               currentView === 'timeline' ? 'Timeline' :
                               currentView === 'unassigned' ? 'Unassigned Tasks' : 'Main table'}
                              <ChevronDown className="w-3 h-3 ml-1" />
                            </Button>
                          </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">Switch between Table, Kanban, Calendar, Timeline, and Unassigned views</TooltipContent>
                      </Tooltip>
                      <DropdownMenuContent>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DropdownMenuItem onClick={() => onViewChange('table')}>
                              <Table2 className="w-4 h-4 mr-2" />
                              Main Table
                            </DropdownMenuItem>
                          </TooltipTrigger>
                          <TooltipContent side="right">Spreadsheet-style rows and columns — best for detailed editing and bulk updates</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DropdownMenuItem onClick={() => onViewChange('kanban')}>
                              <Table2 className="w-4 h-4 mr-2" />
                              Kanban Board
                            </DropdownMenuItem>
                          </TooltipTrigger>
                          <TooltipContent side="right">Drag-and-drop cards organized by status — great for visualizing workflow</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DropdownMenuItem onClick={() => onViewChange('calendar')}>
                              <Table2 className="w-4 h-4 mr-2" />
                              Calendar View
                            </DropdownMenuItem>
                          </TooltipTrigger>
                          <TooltipContent side="right">Tasks plotted on a monthly calendar by due date — spot deadline clusters</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DropdownMenuItem onClick={() => onViewChange('timeline')}>
                              <Table2 className="w-4 h-4 mr-2" />
                              Timeline
                            </DropdownMenuItem>
                          </TooltipTrigger>
                          <TooltipContent side="right">Gantt-style bars showing task duration — ideal for scheduling and dependencies</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DropdownMenuItem onClick={() => onViewChange('unassigned')}>
                              <UserMinus className="w-4 h-4 mr-2" />
                              Unassigned Tasks
                            </DropdownMenuItem>
                          </TooltipTrigger>
                          <TooltipContent side="right">Show tasks that have no owner yet — useful for sprint planning and workload balancing</TooltipContent>
                        </Tooltip>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <span className="text-muted-foreground">|</span>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-6 px-2 text-xs transition-colors duration-150 ${isFavorited ? 'text-yellow-500 hover:text-yellow-600' : 'text-muted-foreground hover:text-yellow-500'}`}
                          onClick={handleToggleFavorite}
                        >
                          <Star className={`w-3 h-3 mr-1 ${isFavorited ? 'fill-current' : ''}`} />
                          {isFavorited ? 'Favorited' : 'Add to favorites'}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                      </TooltipContent>
                    </Tooltip>

                    <span className="text-muted-foreground">|</span>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>{itemsCount} items</span>
                      <span>▪</span>
                      <span>
                        Saved {lastSaved.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs"
                    onClick={onShowAnalytics}
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Analytics
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">View completion rates, status breakdown, team workload, and priority distribution for this board</TooltipContent>
              </Tooltip>

              {showTeamControls && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 px-2.5 rounded-full">
                      {collaborators.length > 0 ? (
                        <div className="flex items-center -space-x-2">
                          {collaborators.slice(0, 3).map((user) => (
                            <Tooltip key={user.id}>
                              <TooltipTrigger asChild>
                                <div
                                  className={cn("w-7 h-7 rounded-full border-2 border-background flex items-center justify-center text-[11px] font-medium", getAvatarColor(user.name))}
                                >
                                  {user.avatar}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>{user.name} ({user.role})</TooltipContent>
                            </Tooltip>
                          ))}
                          {collaborators.length > 3 && (
                            <div className="w-7 h-7 rounded-full bg-muted border-2 border-background flex items-center justify-center text-muted-foreground text-[11px]">
                              +{collaborators.length - 3}
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          <Users className="w-3.5 h-3.5" />
                          Team
                        </>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="end">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-medium text-foreground">Team ({collaborators.length})</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {isBoardOwner
                              ? 'Invite collaborators or remove people who no longer need access.'
                              : 'People who currently have access to this board.'}
                          </p>
                        </div>
                        {isBoardOwner && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowInviteModal(true)}
                          >
                            <UserPlus className="w-3 h-3 mr-1" />
                            Invite
                          </Button>
                        )}
                      </div>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {collaborators.length === 0 ? (
                          <div className="rounded-lg border border-dashed border-border px-3 py-5 text-center text-sm text-muted-foreground">
                            No team members yet. Invite people to collaborate on this board.
                          </div>
                        ) : (
                          collaborators.map((user) => (
                            <div key={user.id} className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-accent transition-colors duration-150">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0", getAvatarColor(user.name))}>
                                  {user.avatar}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                                  <p className="text-xs text-muted-foreground capitalize truncate">
                                    {user.role}
                                    {user.email ? ` - ${user.email}` : ''}
                                  </p>
                                </div>
                              </div>
                              {isBoardOwner && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                      onClick={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        setMemberToRemove(user);
                                      }}
                                      aria-label={`Remove ${user.name} from board`}
                                    >
                                      <UserMinus className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent side="left">Remove from board</TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
        </div>
      </div>
      <InviteTeamModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        boardId={board?.id}
        lockBoardSelection
        onInvitesSent={() => loadCollaborators()}
      />
      <AlertDialog
        open={!!memberToRemove}
        onOpenChange={(open) => {
          if (!open && !isRemovingMember) {
            setMemberToRemove(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove team member?</AlertDialogTitle>
            <AlertDialogDescription>
              {memberToRemove
                ? `${memberToRemove.name} will lose access to this board immediately.`
                : 'This person will lose access to this board immediately.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemovingMember}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleRemoveCollaborator}
              disabled={isRemovingMember}
            >
              {isRemovingMember ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Removing...
                </>
              ) : (
                'Remove from board'
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </>
    </TooltipProvider>
  );
}
