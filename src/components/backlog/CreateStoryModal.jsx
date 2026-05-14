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
import { Plus, X } from "lucide-react";

export default function CreateStoryModal({ isOpen, onClose, onSubmit, boards }) {
  const [formData, setFormData] = useState({
    board_id: boards[0]?.id || '',
    title: '',
    description: '',
    story_points: 0,
    priority: 'medium',
    status: 'backlog',
    acceptance_criteria: []
  });

  const [newCriteria, setNewCriteria] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      board_id: boards[0]?.id || '',
      title: '',
      description: '',
      story_points: 0,
      priority: 'medium',
      status: 'backlog',
      acceptance_criteria: []
    });
  };

  const addCriteria = () => {
    if (newCriteria.trim()) {
      setFormData(prev => ({
        ...prev,
        acceptance_criteria: [
          ...prev.acceptance_criteria,
          { id: Date.now().toString(), description: newCriteria, completed: false }
        ]
      }));
      setNewCriteria('');
    }
  };

  const removeCriteria = (id) => {
    setFormData(prev => ({
      ...prev,
      acceptance_criteria: prev.acceptance_criteria.filter(c => c.id !== id)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create User Story</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="board">Board *</Label>
            <Select
              value={formData.board_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, board_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select board" />
              </SelectTrigger>
              <SelectContent>
                {boards.map(board => (
                  <SelectItem key={board.id} value={board.id}>
                    {board.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Story Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="As a user, I want to..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="As a [type of user], I want [goal], so that [benefit]"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="story_points">Story Points</Label>
              <Select
                value={formData.story_points.toString()}
                onValueChange={(value) => setFormData(prev => ({ ...prev, story_points: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3, 5, 8, 13, 21].map(points => (
                    <SelectItem key={points} value={points.toString()}>
                      {points} {points === 0 ? '(Not estimated)' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Acceptance Criteria</Label>
            <div className="space-y-2">
              {formData.acceptance_criteria.map((criteria) => (
                <div key={criteria.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span className="flex-1 text-sm">{criteria.description}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCriteria(criteria.id)}
                    className="h-6 w-6"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newCriteria}
                onChange={(e) => setNewCriteria(e.target.value)}
                placeholder="Add acceptance criteria..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCriteria();
                  }
                }}
              />
              <Button type="button" onClick={addCriteria} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Create Story
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}