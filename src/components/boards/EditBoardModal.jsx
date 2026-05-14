import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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

export default function EditBoardModal({ isOpen, onClose, onSubmit, board }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    color: '#0073EA',
    visibility: 'private'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (board) {
      setFormData({
        title: board.title || '',
        description: board.description || '',
        color: board.color || '#0073EA',
        visibility: board.visibility || 'private'
      });
    }
  }, [board]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !board) return;

    setIsSubmitting(true);
    try {
      await onSubmit(board.id, formData); // Pass board.id and formData
      onClose(); // Close modal on successful submission
    } catch (error) {
      console.error('Error updating board:', error);
      // Optionally, show an error message to the user
    }
    setIsSubmitting(false);
  };

  if (!board) return null; // Don't render if no board is provided for editing

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Edit Board: {board.title}
          </DialogTitle>
          <DialogDescription>
            Update the details for your board.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground font-medium">
              Board Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter board title..."
              className="rounded-xl border-border h-12 focus:ring-2 focus:ring-primary/20"
              required
            />
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
              className="rounded-xl border-border min-h-20 focus:ring-2 focus:ring-primary/20"
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
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${
                    formData.color === color.value
                      ? 'border-foreground scale-110'
                      : 'border-transparent hover:scale-105'
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
              <SelectTrigger className="rounded-xl border-border h-12">
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

          <DialogFooter className="pt-4">
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
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 px-6 font-medium"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}