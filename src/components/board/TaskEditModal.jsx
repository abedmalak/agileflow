import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X, User as UserIcon, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { User as UserApi } from "@/api/entities/User";
import { cn } from "@/lib/utils";
import AssignmentSuggestion from "./AssignmentSuggestion";

export default function TaskEditModal({ isOpen, onClose, task, board, onUpdate, onDelete }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (task && board) {
      // Initialize form data with current task values
      const initialData = {
        title: task.title,
        ...task.data
      };
      setFormData(initialData);
    }
  }, [task, board]);

  if (!task || !board) return null;

  const handleSave = () => {
    const { title, ...data } = formData;
    onUpdate(task.id, {
      title,
      data
    });
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
      onClose();
    }
  };

  const renderField = (column) => {
    const value = formData[column.id];
    
    switch (column.type) {
      case 'text':
        return (
          <Input
            value={value || ''}
            onChange={(e) => setFormData({...formData, [column.id]: e.target.value})}
            placeholder={`Enter ${column.title.toLowerCase()}...`}
          />
        );

      case 'status':
        return (
          <Select
            value={value || ''}
            onValueChange={(newValue) => setFormData({...formData, [column.id]: newValue})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {column.options?.choices?.map((choice) => (
                <SelectItem key={choice.label} value={choice.label}>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: choice.color }}
                    />
                    <span>{choice.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'priority':
        return (
          <Select
            value={value || ''}
            onValueChange={(newValue) => setFormData({...formData, [column.id]: newValue})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {column.options?.choices?.map((choice) => (
                <SelectItem key={choice.value} value={choice.value}>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: choice.color }}
                    />
                    <span>{choice.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'people':
      case 'person':
        return (
          <PersonSelect
            value={value || ''}
            onChange={(name) => setFormData({...formData, [column.id]: name})}
          />
        );

      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(new Date(value), 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => setFormData({...formData, [column.id]: date})}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => setFormData({...formData, [column.id]: parseFloat(e.target.value) || 0})}
            placeholder="Enter number..."
          />
        );

      default:
        return (
          <Input
            value={value || ''}
            onChange={(e) => setFormData({...formData, [column.id]: e.target.value})}
            placeholder={`Enter ${column.title.toLowerCase()}...`}
          />
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center justify-between">
            Edit Task
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Task Title */}
          <div className="space-y-2">
            <Label className="text-foreground font-medium text-base">Task Title</Label>
            <Input
              value={formData.title || ''}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Enter task title..."
              className="text-lg font-medium"
            />
          </div>

          {/* Dynamic Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {board.columns?.filter(col => col.id !== 'task').map((column) => (
              <div key={column.id} className="space-y-2">
                <Label className="text-foreground font-medium">{column.title}</Label>
                {renderField(column)}
              </div>
            ))}
          </div>

          {/* Assignment Suggestions */}
          <AssignmentSuggestion
            task={{ title: formData.title, data: formData }}
            board={board}
            onSelectAssignee={(memberId, memberName) => {
              const personCol = board.columns?.find(c => c.type === "person" || c.type === "people");
              if (personCol) {
                setFormData(prev => ({ ...prev, [personCol.id]: memberName || memberId }));
              }
            }}
          />

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete Task
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PersonSelect({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || members.length > 0) return;
    setLoading(true);
    UserApi.listAll()
      .then(data => setMembers(data || []))
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }, [isOpen, members.length]);

  const avatarColors = [
    'bg-violet-500', 'bg-pink-500', 'bg-sky-500', 'bg-emerald-500',
    'bg-orange-500', 'bg-indigo-500', 'bg-rose-500', 'bg-teal-500',
  ];
  const getColor = (name) => avatarColors[((name || '').charCodeAt(0) || 0) % avatarColors.length];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between font-normal">
          {value ? (
            <div className="flex items-center gap-2">
              <div className={cn('w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-medium', getColor(value))}>
                {value.charAt(0).toUpperCase()}
              </div>
              <span>{value}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">Select person...</span>
          )}
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-1 w-[260px] max-h-[240px] overflow-y-auto" align="start">
        {loading ? (
          <div className="px-3 py-4 text-xs text-muted-foreground text-center">Loading...</div>
        ) : members.length === 0 ? (
          <div className="px-3 py-4 text-xs text-muted-foreground text-center">No team members</div>
        ) : (
          <>
            {members.map(m => {
              const name = m.full_name || m.email || 'Unnamed';
              return (
                <button
                  key={m.id}
                  type="button"
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-accent transition-colors text-left"
                  onClick={() => { onChange(name); setIsOpen(false); }}
                >
                  <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0', getColor(name))}>
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm text-foreground truncate">{m.full_name || 'Unnamed'}</div>
                    {m.email && <div className="text-[11px] text-muted-foreground truncate">{m.email}</div>}
                  </div>
                </button>
              );
            })}
            {value && (
              <>
                <div className="border-t border-border my-1" />
                <button
                  type="button"
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md hover:bg-accent transition-colors text-left text-sm text-muted-foreground"
                  onClick={() => { onChange(''); setIsOpen(false); }}
                >
                  <UserIcon className="w-4 h-4" />
                  Unassign
                </button>
              </>
            )}
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}