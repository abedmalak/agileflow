import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { X as XIcon, Plus } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// A predefined list of tag suggestions, could come from board settings in future
const tagSuggestions = [
  { value: 'urgent', label: 'Urgent', color: '#E2445C' },
  { value: 'bug', label: 'Bug', color: '#FFCB00' },
  { value: 'feature', label: 'Feature', color: '#00C875' },
  { value: 'marketing', label: 'Marketing', color: '#A25DDC' },
  { value: 'design', label: 'Design', color: '#0073EA' },
];

export default function TagsCell({ value, onUpdate, options }) {
  const currentTags = Array.isArray(value) ? value : []; // value is an array of tag objects like { value: 'urgent', label: 'Urgent', color: '#E2445C' }
  const [newTagInput, setNewTagInput] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleAddTag = (tag) => {
    if (tag && !currentTags.find(t => t.value === tag.value)) {
      onUpdate([...currentTags, tag]);
    }
    setNewTagInput(''); // Clear input after adding
  };

  const handleRemoveTag = (tagValueToRemove) => {
    onUpdate(currentTags.filter(tag => tag.value !== tagValueToRemove));
  };
  
  const handleCreateNewTag = () => {
    if (newTagInput.trim() && !currentTags.find(t => t.label.toLowerCase() === newTagInput.trim().toLowerCase())) {
        // For simplicity, new tags get a default color or generate one
        const newTag = {
            value: newTagInput.trim().toLowerCase().replace(/\s+/g, '-'), // create a value from label
            label: newTagInput.trim(),
            color: `#${Math.floor(Math.random()*16777215).toString(16)}` // Random color for new tag
        };
        handleAddTag(newTag);
    }
  };

  const filteredSuggestions = tagSuggestions.filter(
    suggestion => !currentTags.find(t => t.value === suggestion.value) &&
                  suggestion.label.toLowerCase().includes(newTagInput.toLowerCase())
  );

  return (
    <div className="flex flex-wrap gap-1 items-center h-full w-full py-1">
      {currentTags.map((tag) => (
        <Badge
          key={tag.value}
          style={{ backgroundColor: tag.color ? `${tag.color}20` : '#e5e7eb', color: tag.color || '#374151' }}
          className="font-normal px-1.5 py-0.5 text-xs"
        >
          {tag.label}
          <button onClick={() => handleRemoveTag(tag.value)} className="ml-1 opacity-70 hover:opacity-100">
            <XIcon size={10} />
          </button>
        </Badge>
      ))}
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-5 w-5 p-0 ml-auto">
            <Plus size={14} className="text-gray-500 hover:text-gray-700" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2 space-y-2">
          <Input 
            placeholder="Add or find tag..."
            value={newTagInput}
            onChange={(e) => setNewTagInput(e.target.value)}
            className="h-8 text-sm"
          />
          {filteredSuggestions.length > 0 && (
            <div className="max-h-32 overflow-y-auto space-y-1">
              {filteredSuggestions.map(suggestion => (
                <Button 
                  key={suggestion.value} 
                  variant="ghost" 
                  className="w-full justify-start h-8 text-sm p-2"
                  onClick={() => handleAddTag(suggestion)}
                >
                   <div className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: suggestion.color}}/>
                  {suggestion.label}
                </Button>
              ))}
            </div>
          )}
           {(newTagInput.trim() && !filteredSuggestions.find(s => s.label.toLowerCase() === newTagInput.toLowerCase())) && (
             <Button variant="outline" className="w-full h-8 text-sm" onClick={handleCreateNewTag}>
                Create "{newTagInput.trim()}"
            </Button>
           )}
        </PopoverContent>
      </Popover>
    </div>
  );
}