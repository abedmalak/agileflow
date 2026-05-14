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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus } from "lucide-react";

const columnTypes = [
  { value: "text", label: "Text" },
  { value: "status", label: "Status" },
  { value: "date", label: "Date" },
  { value: "people", label: "People" },
  { value: "number", label: "Number" },
  { value: "budget", label: "Budget" },
  { value: "priority", label: "Priority" }, // Changed from "tags" to "priority"
  { value: "checkbox", label: "Checkbox" },
  { value: "dropdown", label: "Dropdown" },
  { value: "timeline", label: "Timeline" },
];

export default function NewColumnModal({ isOpen, onClose, onSubmit }) {
  const [columnData, setColumnData] = useState({
    title: '',
    type: 'text',
  });
  const [dropdownOptions, setDropdownOptions] = useState([
    { value: 'option1', label: 'Option 1', color: '#787D80' },
    { value: 'option2', label: 'Option 2', color: '#0073EA' },
  ]);
  const [newOptionLabel, setNewOptionLabel] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const colorOptions = [
    '#787D80', '#0073EA', '#00C875', '#FFCB00', '#E2445C', '#A25DDC', '#00D9FF'
  ];

  const handleAddOption = () => {
    if (newOptionLabel.trim()) {
      const newOption = {
        value: newOptionLabel.toLowerCase().replace(/\s+/g, '_'),
        label: newOptionLabel.trim(),
        color: colorOptions[dropdownOptions.length % colorOptions.length]
      };
      setDropdownOptions([...dropdownOptions, newOption]);
      setNewOptionLabel('');
    }
  };

  const handleRemoveOption = (indexToRemove) => {
    setDropdownOptions(dropdownOptions.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!columnData.title.trim()) return;

    setIsSubmitting(true);
    try {
      const dataToSubmit = {
        title: columnData.title,
        type: columnData.type,
      };

      // Add default options based on column type
      if (columnData.type === 'status') {
        dataToSubmit.options = {
          choices: [
            { label: 'Not Started', color: '#C4C4C4' },
            { label: 'Working on it', color: '#FFCB00' },
            { label: 'Done', color: '#00C875' },
            { label: 'Stuck', color: '#E2445C' }
          ]
        };
      } else if (columnData.type === 'dropdown') {
        dataToSubmit.options = {
          choices: dropdownOptions
        };
      } else if (columnData.type === 'budget') {
        dataToSubmit.options = {
          currency: 'USD'
        };
      } else if (columnData.type === 'priority') {
        dataToSubmit.options = {
          choices: [
            { value: 'low', label: 'Low', color: '#787D80' },
            { value: 'medium', label: 'Medium', color: '#FFCB00' },
            { value: 'high', label: 'High', color: '#FDAB3D' },
            { value: 'critical', label: 'Critical', color: '#E2445C' }
          ]
        };
      }

      await onSubmit(dataToSubmit);
      // Reset form
      setColumnData({ title: '', type: 'text' });
      setDropdownOptions([
        { value: 'option1', label: 'Option 1', color: '#787D80' },
        { value: 'option2', label: 'Option 2', color: '#0073EA' },
      ]);
      setNewOptionLabel('');
    } catch (error) {
      console.error('Error creating column:', error);
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Add New Column
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="column-title" className="text-foreground font-medium">
              Column Title *
            </Label>
            <Input
              id="column-title"
              value={columnData.title}
              onChange={(e) => setColumnData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Priority, Budget"
              className="rounded-xl border-border h-12"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="column-type" className="text-foreground font-medium">Column Type</Label>
            <Select
              value={columnData.type}
              onValueChange={(value) => setColumnData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger id="column-type" className="rounded-xl border-border h-12">
                <SelectValue placeholder="Select column type" />
              </SelectTrigger>
              <SelectContent>
                {columnTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dropdown Options Configuration */}
          {columnData.type === 'dropdown' && (
            <div className="space-y-3">
              <Label className="text-foreground font-medium">Dropdown Options</Label>
              
              {/* Existing Options */}
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {dropdownOptions.map((option, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: option.color }}
                    />
                    <span className="flex-1 text-sm">{option.label}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveOption(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Add New Option */}
              <div className="flex gap-2">
                <Input
                  value={newOptionLabel}
                  onChange={(e) => setNewOptionLabel(e.target.value)}
                  placeholder="Add option..."
                  className="flex-1 h-9 rounded-lg border-border"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddOption();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-lg border-border"
                  onClick={handleAddOption}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          <DialogFooter className="pt-6">
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
              disabled={!columnData.title.trim() || isSubmitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 px-6 font-medium"
            >
              {isSubmitting ? 'Adding...' : 'Add Column'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}