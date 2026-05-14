import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Calendar, Target, AlertTriangle, Loader2 } from "lucide-react";
import { Sprint } from "@/api/entities/Sprint";
import { UserStory } from "@/api/entities/UserStory";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function SprintPlanningModal({ isOpen, onClose, stories, boards }) {
  const queryClient = useQueryClient();
  const [selectedStories, setSelectedStories] = useState(new Set());
  const [capacityOverridden, setCapacityOverridden] = useState(false);
  const [sprintData, setSprintData] = useState({
    board_id: String(boards?.[0]?.id || ''),
    name: '',
    goal: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    capacity: 40,
    status: 'planning'
  });

  const createSprintMutation = useMutation({
    mutationFn: async (data) => {
      const sprint = await Sprint.create(data);

      const updatePromises = Array.from(selectedStories).map(storyId => {
        const story = stories.find(s => s.id === storyId);
        return UserStory.update(storyId, {
          ...story,
          sprint_id: sprint.id,
          status: 'ready'
        });
      });

      await Promise.all(updatePromises);
      return sprint;
    },
    onSuccess: (sprint) => {
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
      queryClient.invalidateQueries({ queryKey: ['userStories'] });
      toast.success(`Sprint "${sprint.name}" created with ${selectedStories.size} stories`);
      resetAndClose();
    },
    onError: (error) => {
      toast.error(`Failed to create sprint: ${error.message}`);
    },
  });

  const toggleStory = (storyId) => {
    const newSelected = new Set(selectedStories);
    if (newSelected.has(storyId)) {
      newSelected.delete(storyId);
    } else {
      newSelected.add(storyId);
    }
    setSelectedStories(newSelected);
    setCapacityOverridden(false);
  };

  const totalPoints = Array.from(selectedStories).reduce((sum, id) => {
    const story = stories.find(s => s.id === id);
    return sum + (story?.story_points || 0);
  }, 0);

  const isOverCapacity = totalPoints > sprintData.capacity;
  const capacityPercent = sprintData.capacity > 0 ? Math.round((totalPoints / sprintData.capacity) * 100) : 0;
  const isNearCapacity = !isOverCapacity && capacityPercent > 80;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Business rule: warn on overcapacity
    if (isOverCapacity && !capacityOverridden) {
      toast.warning(
        `Sprint is overcommitted by ${totalPoints - sprintData.capacity} points. Click "Create Sprint" again to override.`,
        { duration: 5000 }
      );
      setCapacityOverridden(true);
      return;
    }

    createSprintMutation.mutate({
      ...sprintData,
      committed_points: totalPoints,
      completed_points: 0,
      velocity: 0
    });
  };

  const resetAndClose = () => {
    setSelectedStories(new Set());
    setCapacityOverridden(false);
    setSprintData(prev => ({ ...prev, name: '', goal: '' }));
    onClose();
  };

  // Filter out stories already assigned to an active/completed sprint
  const availableStories = stories.filter(s => !s.sprint_id || s.status === 'backlog');

  const capacityBarColor = isOverCapacity
    ? 'bg-red-500'
    : isNearCapacity
    ? 'bg-amber-500'
    : 'bg-green-500';

  const priorityBadgeClasses = {
    critical: 'border-red-300 text-red-700 dark:border-red-700 dark:text-red-400',
    high: 'border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400',
    medium: 'border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-400',
    low: 'border-border text-muted-foreground'
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary" />
            Plan New Sprint
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Board *</Label>
              {!boards || boards.length === 0 ? (
                <div className="flex items-center gap-2 h-10 px-3 border border-border rounded-md text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading boards...
                </div>
              ) : (
              <Select
                value={sprintData.board_id}
                onValueChange={(value) => setSprintData(prev => ({ ...prev, board_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {boards.map(board => (
                    <SelectItem key={board.id} value={String(board.id)}>{board.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label>Sprint Name *</Label>
              <Input
                value={sprintData.name}
                onChange={(e) => setSprintData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Sprint 1"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Sprint Goal</Label>
            <Textarea
              value={sprintData.goal}
              onChange={(e) => setSprintData(prev => ({ ...prev, goal: e.target.value }))}
              placeholder="What do you want to achieve in this sprint?"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Start Date *</Label>
              <Input
                type="date"
                value={sprintData.start_date}
                onChange={(e) => setSprintData(prev => ({ ...prev, start_date: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>End Date *</Label>
              <Input
                type="date"
                value={sprintData.end_date}
                onChange={(e) => setSprintData(prev => ({ ...prev, end_date: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Team Capacity (SP)</Label>
              <Input
                type="number"
                value={sprintData.capacity}
                onChange={(e) => {
                  setSprintData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }));
                  setCapacityOverridden(false);
                }}
                min="0"
              />
            </div>
          </div>

          {/* Sprint Capacity Indicator */}
          <Card className={cn(
            "border-2",
            isOverCapacity
              ? 'border-red-300 dark:border-red-700'
              : isNearCapacity
              ? 'border-amber-300 dark:border-amber-700'
              : 'border-green-300 dark:border-green-700'
          )}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isOverCapacity ? (
                    <AlertTriangle className="text-red-600 dark:text-red-400 w-5 h-5" />
                  ) : (
                    <Target className={cn(
                      "w-5 h-5",
                      isNearCapacity ? "text-amber-600 dark:text-amber-400" : "text-green-600 dark:text-green-400"
                    )} />
                  )}
                  <div>
                    <p className="font-semibold text-foreground">
                      {totalPoints} / {sprintData.capacity} Story Points
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isOverCapacity
                        ? `Overcommitted by ${totalPoints - sprintData.capacity} points — team may not deliver`
                        : `${sprintData.capacity - totalPoints} points remaining`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "text-2xl font-bold",
                    isOverCapacity
                      ? "text-red-600 dark:text-red-400"
                      : isNearCapacity
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-green-600 dark:text-green-400"
                  )}>
                    {capacityPercent}%
                  </p>
                  <p className="text-xs text-muted-foreground">capacity</p>
                </div>
              </div>
              {/* Visual capacity bar */}
              <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn("h-full transition-all duration-300 rounded-full", capacityBarColor)}
                  style={{ width: `${Math.min(100, capacityPercent)}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Overcapacity warning */}
          {isOverCapacity && capacityOverridden && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-300 dark:border-amber-700 rounded-lg text-sm text-amber-800 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              Capacity override active. Sprint will be created overcommitted.
            </div>
          )}

          {/* Story Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Select Stories for Sprint</Label>
              <Badge variant="secondary">{selectedStories.size} selected</Badge>
            </div>
            <div className="max-h-96 overflow-y-auto space-y-2 border border-border rounded-lg p-4">
              {!stories ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Loader2 className="h-8 w-8 text-muted-foreground animate-spin mb-3" />
                  <p className="text-sm text-muted-foreground">Loading stories...</p>
                </div>
              ) : availableStories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Target className="h-10 w-10 text-muted-foreground/50 mb-3" />
                  <h3 className="text-sm font-medium text-foreground mb-1">No stories available</h3>
                  <p className="text-xs text-muted-foreground">All stories are already assigned to sprints, or the backlog is empty.</p>
                </div>
              ) : (
                availableStories.map(story => (
                  <div
                    key={story.id}
                    className={cn(
                      "flex items-center gap-3 p-3 border rounded-lg transition-colors cursor-pointer",
                      selectedStories.has(story.id)
                        ? 'bg-accent border-primary/40'
                        : 'bg-card border-border hover:bg-accent/50'
                    )}
                    onClick={() => toggleStory(story.id)}
                  >
                    <Checkbox
                      checked={selectedStories.has(story.id)}
                      onCheckedChange={() => toggleStory(story.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{story.title}</span>
                        {story.story_points > 0 && (
                          <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-medium">
                            {story.story_points} SP
                          </span>
                        )}
                        <Badge variant="outline" className={cn(
                          "capitalize",
                          priorityBadgeClasses[story.priority] ?? priorityBadgeClasses.low
                        )}>
                          {story.priority}
                        </Badge>
                      </div>
                      {story.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {typeof story.description === 'string' ? story.description : String(story.description)}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={resetAndClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant={isOverCapacity && !capacityOverridden ? "outline" : "default"}
              disabled={selectedStories.size === 0 || !sprintData.name || createSprintMutation.isPending}
            >
              {createSprintMutation.isPending ? 'Creating...' :
               isOverCapacity && !capacityOverridden ? `Override & Create (${selectedStories.size} stories)` :
               `Create Sprint (${selectedStories.size} stories)`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
