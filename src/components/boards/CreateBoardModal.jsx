
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock, Globe } from "lucide-react";

const colorOptions = [
  { name: 'Ocean Blue', value: '#0073EA' },
  { name: 'Success Green', value: '#00C875' },
  { name: 'Warning Orange', value: '#FFCB00' },
  { name: 'Danger Red', value: '#E2445C' },
  { name: 'Purple', value: '#A25DDC' },
  { name: 'Teal', value: '#00D9FF' }
];

export default function CreateBoardModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    color: '#0073EA',
    visibility: 'private'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [titleError, setTitleError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setTitleError('');

    if (!formData.title.trim()) {
      setTitleError('Board title is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const boardData = {
        ...formData,
        columns: [
          {
            id: 'task',
            title: 'Task',
            type: 'text',
            width: 250
          },
          {
            id: 'status',
            title: 'Status',
            type: 'status',
            width: 150,
            options: {
              choices: [
                { label: 'Not Started', color: '#C4C4C4' },
                { label: 'Working on it', color: '#FFCB00' },
                { label: 'Done', color: '#00C875' },
                { label: 'Stuck', color: '#E2445C' }
              ]
            }
          },
          {
            id: 'owner',
            title: 'Owner',
            type: 'people',
            width: 150
          },
          {
            id: 'priority',
            title: 'Priority',
            type: 'priority',
            width: 120,
            options: {
              choices: [
                { value: 'low', label: 'Low', color: '#787D80' },
                { value: 'medium', label: 'Medium', color: '#FFCB00' },
                { value: 'high', label: 'High', color: '#FDAB3D' },
                { value: 'critical', label: 'Critical', color: '#E2445C' }
              ]
            }
          },
          {
            id: 'due_date',
            title: 'Due Date',
            type: 'date',
            width: 150
          },
          {
            id: 'notes',
            title: 'Notes',
            type: 'text',
            width: 200
          }
        ],
        groups: [
          {
            id: 'group_todo',
            title: 'To Do',
            color: '#0073EA',
            collapsed: false
          },
          {
            id: 'group_in_progress',
            title: 'In Progress',
            color: '#FFCB00',
            collapsed: false
          },
          {
            id: 'group_done',
            title: 'Done',
            color: '#00C875',
            collapsed: false
          }
        ]
      };

      await onSubmit(boardData);
      setFormData({ title: '', description: '', color: '#0073EA', visibility: 'private' });
      setError('');
    } catch (err) {
      console.error('Error creating board:', err);
      setError(err?.message || 'Failed to create board. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Create New Board
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground font-medium">
              Board Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, title: e.target.value }));
                if (titleError) setTitleError('');
              }}
              placeholder="Enter board title..."
              className={`rounded-xl h-12 ${titleError ? 'border-red-500' : ''}`}
              required
            />
            {titleError && <p className="text-sm text-red-500 mt-1">{titleError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="What's this board about?"
              className="rounded-xl min-h-20"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground font-medium">Board Color</Label>
            <div className="flex gap-2 flex-wrap">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                  className={`w-8 h-8 rounded-lg border-2 transition-colors duration-150 ${
                    formData.color === color.value
                      ? 'border-foreground'
                      : 'border-transparent hover:border-muted-foreground'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground font-medium">Visibility</Label>
            <Select
              value={formData.visibility}
              onValueChange={(value) => setFormData(prev => ({ ...prev, visibility: value }))}
            >
              <SelectTrigger className="rounded-xl h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    <span>Private</span>
                  </div>
                </SelectItem>
                <SelectItem value="shared">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>Shared</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl h-12 px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.title.trim() || isSubmitting}
              className="rounded-xl h-12 px-6 font-medium"
            >
              {isSubmitting ? 'Creating...' : 'Create Board'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
