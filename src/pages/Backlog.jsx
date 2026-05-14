import React, { useState } from "react";
import { Board } from "@/api/entities/Board";
import { UserStory } from "@/api/entities/UserStory";
import { Sprint } from "@/api/entities/Sprint";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { showErrorToast } from "@/lib/error-utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Plus,
  Search,
  ListOrdered,
  Target,
  ChevronRight,
  CalendarPlus,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  GripVertical
} from "lucide-react";
import { motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

import CreateStoryModal from "../components/backlog/CreateStoryModal";
import StoryDetailModal from "../components/backlog/StoryDetailModal";
import SprintPlanningModal from "../components/backlog/SprintPlanningModal";
import InfoTooltip from "@/components/common/InfoTooltip";
import ModuleHelp from "@/components/common/ModuleHelp";
import { AIExplainButton } from "@/components/ai/AIExplainButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function BacklogPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPlanningModal, setShowPlanningModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [filterPriority, setFilterPriority] = useState("all");

  const queryClient = useQueryClient();

  const { data: boards = [], isLoading: loadingBoards, isError: boardsError, refetch: refetchBoards } = useQuery({
    queryKey: ['boards'],
    queryFn: () => Board.list('-updated_date', 50),
  });

  const { data: stories = [], isLoading: loadingStories, isError: storiesError, refetch: refetchStories } = useQuery({
    queryKey: ['userStories'],
    queryFn: () => UserStory.list('-created_date', 100),
  });

  const { data: sprints = [] } = useQuery({
    queryKey: ['sprints'],
    queryFn: () => Sprint.list('-start_date', 20),
  });

  const createStoryMutation = useMutation({
    mutationFn: (data) => UserStory.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userStories'] });
      setShowCreateModal(false);
    },
    onError: (error) => {
      console.error("Error creating story:", error);
      showErrorToast(toast, "Creation failed", error);
    },
  });

  const updateStoryMutation = useMutation({
    mutationFn: ({ id, data }) => UserStory.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userStories'] });
    },
    onError: (error) => {
      console.error("Error updating story:", error);
      showErrorToast(toast, "Update failed", error);
    },
  });

  const deleteStoryMutation = useMutation({
    mutationFn: (id) => UserStory.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userStories'] });
      setSelectedStory(null);
    },
    onError: (error) => {
      console.error("Error deleting story:", error);
      showErrorToast(toast, "Delete failed", error);
    },
  });

  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         story.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === "all" || story.priority === filterPriority;
    const isBacklog = story.status === 'backlog' || !story.sprint_id;

    return matchesSearch && matchesPriority && isBacklog;
  });

  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const sortedStories = [...filteredStories].sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const backlogStats = {
    total: sortedStories.length,
    totalPoints: sortedStories.reduce((sum, s) => sum + (s.story_points || 0), 0),
    critical: sortedStories.filter(s => s.priority === 'critical').length,
    ready: sortedStories.filter(s => s.status === 'ready').length
  };

  const activeSprints = sprints.filter(s => s.status === 'active');

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(sortedStories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update priorities based on new order
    items.forEach((story, index) => {
      if (story.id === reorderedItem.id) {
        updateStoryMutation.mutate({
          id: story.id,
          data: { ...story, priority: index < 5 ? 'critical' : index < 15 ? 'high' : 'medium' }
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg border border-border bg-muted flex items-center justify-center">
                <ListOrdered className="w-5 h-5 text-muted-foreground" />
              </div>
              Product Backlog
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Prioritize and manage user stories</p>
          </div>

          <div className="flex gap-3 items-center">
            <AIExplainButton
              widgetTitle="Product Backlog Overview"
              widgetData={{
                totalStories: backlogStats.total,
                totalPoints: backlogStats.totalPoints,
                criticalCount: backlogStats.critical,
                readyForSprint: backlogStats.ready
              }}
            />
            <ModuleHelp moduleKey="backlog" />
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setShowPlanningModal(true)}
                    variant="outline"
                  >
                    <CalendarPlus className="w-4 h-4 mr-2" />
                    Plan Sprint
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs text-xs">
                  Open sprint planning to select stories for your next sprint and set sprint dates
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setShowCreateModal(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New User Story
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs text-xs">
                  Create a new user story to add to the backlog
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                  Total Stories
                  <InfoTooltip text="User stories in the backlog waiting to be assigned to a sprint" />
                </p>
                <p className="text-2xl font-semibold text-foreground">{backlogStats.total}</p>
              </div>
              <Target className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                  Story Points
                  <InfoTooltip text="Total estimated effort. Teams use Fibonacci numbers (1, 2, 3, 5, 8, 13) where higher = more complex" />
                </p>
                <p className="text-2xl font-semibold text-foreground">{backlogStats.totalPoints}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                  Critical Priority
                  <InfoTooltip text="Stories needing immediate attention — should be in the very next sprint" />
                </p>
                <p className="text-2xl font-semibold text-foreground">{backlogStats.critical}</p>
              </div>
              <Target className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                  Ready for Sprint
                  <InfoTooltip text="Fully defined stories with acceptance criteria — ready to be pulled into a sprint" />
                </p>
                <p className="text-2xl font-semibold text-foreground">{backlogStats.ready}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Active Sprints Alert */}
        {activeSprints.length > 0 && (
          <Card className="mb-6 border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold text-foreground flex items-center gap-1">
                    {activeSprints.length} Active Sprint{activeSprints.length > 1 ? 's' : ''}
                    <InfoTooltip text="These sprints are currently running. You can move backlog stories into active sprints during planning." />
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activeSprints.map(s => s.name).join(', ')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4 items-center">
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search user stories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs text-xs">
                    Search stories by title or description
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="flex gap-2 items-center">
                <InfoTooltip text="Filter by urgency. Critical items need immediate action. Low items can wait." />
                {['all', 'critical', 'high', 'medium', 'low'].map(priority => {
                  const priorityTooltips = {
                    all: "Show all stories regardless of priority",
                    critical: "Urgent — needs immediate action, must be in the next sprint",
                    high: "Important — should be addressed soon",
                    medium: "Standard priority — plan for an upcoming sprint",
                    low: "Nice-to-have — can wait until higher priorities are handled"
                  };
                  return (
                    <TooltipProvider key={priority} delayDuration={150}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={filterPriority === priority ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilterPriority(priority)}
                            className="capitalize"
                          >
                            {priority}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-xs text-xs">
                          {priorityTooltips[priority]}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Backlog List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListOrdered className="w-5 h-5" />
              Prioritized Backlog
              <Badge variant="secondary" className="ml-2">
                {sortedStories.length} stories
              </Badge>
              <AIExplainButton
                widgetTitle="Prioritized Backlog"
                widgetData={{
                  totalStories: backlogStats.total,
                  totalPoints: backlogStats.totalPoints,
                  criticalCount: backlogStats.critical,
                  readyForSprint: backlogStats.ready,
                  filteredCount: filteredStories.length,
                  activeFilter: filterPriority,
                  priorityBreakdown: {
                    critical: filteredStories.filter(s => s.priority === 'critical').length,
                    high: filteredStories.filter(s => s.priority === 'high').length,
                    medium: filteredStories.filter(s => s.priority === 'medium').length,
                    low: filteredStories.filter(s => s.priority === 'low').length
                  }
                }}
                className="ml-auto"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingStories ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-4">Loading backlog...</p>
              </div>
            ) : storiesError || boardsError ? (
              <div className="flex flex-col items-center gap-4 py-12 text-center">
                <AlertCircle className="w-10 h-10 text-muted-foreground" />
                <h3 className="text-base font-semibold text-foreground">Failed to load backlog</h3>
                <p className="text-sm text-muted-foreground">There was a problem fetching your stories.</p>
                <Button variant="outline" onClick={() => { refetchStories(); refetchBoards(); }}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try again
                </Button>
              </div>
            ) : sortedStories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Target className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-1">No user stories yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm mb-6">
                  {searchQuery || filterPriority !== 'all'
                    ? "No stories match your current filters. Try adjusting your search or priority filter."
                    : "Create your first story to get started."}
                </p>
                {!searchQuery && filterPriority === 'all' && (
                  <Button onClick={() => setShowCreateModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create User Story
                  </Button>
                )}
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="backlog">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                      {sortedStories.map((story, index) => (
                        <Draggable key={story.id} draggableId={story.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <StoryCard
                                story={story}
                                onClick={() => setSelectedStory(story)}
                                isDragging={snapshot.isDragging}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </CardContent>
        </Card>

        {/* Modals */}
        <CreateStoryModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={(data) => createStoryMutation.mutate(data)}
          boards={boards}
        />

        {selectedStory && (
          <StoryDetailModal
            isOpen={!!selectedStory}
            onClose={() => setSelectedStory(null)}
            story={selectedStory}
            onUpdate={(data) => updateStoryMutation.mutate({ id: selectedStory.id, data })}
            onDelete={() => deleteStoryMutation.mutate(selectedStory.id)}
          />
        )}

        <SprintPlanningModal
          isOpen={showPlanningModal}
          onClose={() => setShowPlanningModal(false)}
          stories={sortedStories}
          boards={boards}
        />
      </div>
    </div>
  );
}

const StoryCard = ({ story, onClick, isDragging }) => {
  const priorityClasses = {
    critical: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400',
    high: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
    medium: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
    low: 'bg-muted text-muted-foreground'
  };

  const statusClasses = {
    backlog: 'bg-muted text-muted-foreground',
    ready: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400',
    in_progress: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
  };

  return (
    <motion.div
      className={cn(
        "border border-border bg-card rounded-md p-4 cursor-pointer transition-colors duration-150",
        isDragging
          ? "border-primary shadow-md"
          : "hover:bg-accent/50"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center self-center text-muted-foreground/40 hover:text-muted-foreground transition-colors mr-1">
                <GripVertical className="w-4 h-4" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-xs text-xs">
              Drag to reorder priority
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Badge className={cn("border-0", priorityClasses[story.priority])}>
                      {story.priority}
                    </Badge>
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs text-xs">
                  This story&apos;s urgency level
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {story.story_points && (
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-medium">
                      {story.story_points} SP
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-xs">
                    Estimated effort for this story (Fibonacci scale)
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {story.status !== 'backlog' && (
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Badge className={cn("border-0", statusClasses[story.status])}>
                        {story.status.replace('_', ' ')}
                      </Badge>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-xs">
                    Current workflow status
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          <h3 className="font-semibold text-foreground mb-1">{story.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{story.description}</p>

          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            {story.acceptance_criteria && Array.isArray(story.acceptance_criteria) && story.acceptance_criteria.length > 0 && (
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {story.acceptance_criteria.filter(c => c && c.completed).length}/{story.acceptance_criteria.length} criteria
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-xs">
                    How many acceptance criteria are completed out of total
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {story.assigned_to && (
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex items-center gap-1">
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs">
                        {story.assigned_to.charAt(0).toUpperCase()}
                      </div>
                      {story.assigned_to.split('@')[0]}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-xs">
                    Team member assigned to this story
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </div>
    </motion.div>
  );
};
