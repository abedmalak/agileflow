import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock, MapPin, Users, X, Video } from "lucide-react";
import { format } from "date-fns";

// Semantic dot colors — no hex values
const eventTypes = [
  { value: 'meeting',       label: 'Team Meeting',    dot: 'bg-blue-500'   },
  { value: 'milestone',     label: 'Milestone',       dot: 'bg-green-500'  },
  { value: 'deadline',      label: 'Deadline',        dot: 'bg-red-500'    },
  { value: 'review',        label: 'Sprint Review',   dot: 'bg-purple-500' },
  { value: 'retrospective', label: 'Retrospective',   dot: 'bg-yellow-500' },
  { value: 'planning',      label: 'Sprint Planning', dot: 'bg-sky-500'    },
  { value: 'holiday',       label: 'Holiday',         dot: 'bg-orange-500' },
  { value: 'other',         label: 'Other',           dot: 'bg-muted-foreground' },
];

const DEFAULT_EVENT_TYPE = 'meeting';

export default function CreateEventModal({ isOpen, onClose, onSubmit, preselectedDate }) {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    event_type: DEFAULT_EVENT_TYPE,
    start_date: preselectedDate || new Date(),
    end_date: preselectedDate || new Date(),
    all_day: false,
    location: '',
    attendees: [],
    reminder_minutes: 15
  });
  const [newAttendee, setNewAttendee] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');

  const handleAddAttendee = () => {
    if (newAttendee.trim() && !eventData.attendees.includes(newAttendee.trim())) {
      setEventData(prev => ({
        ...prev,
        attendees: [...prev.attendees, newAttendee.trim()]
      }));
      setNewAttendee('');
    }
  };

  const handleRemoveAttendee = (email) => {
    setEventData(prev => ({
      ...prev,
      attendees: prev.attendees.filter(e => e !== email)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const startDateTime = new Date(eventData.start_date);
    const endDateTime = new Date(eventData.end_date);

    if (!eventData.all_day) {
      const [startHour, startMin] = startTime.split(':');
      const [endHour, endMin] = endTime.split(':');
      startDateTime.setHours(parseInt(startHour), parseInt(startMin));
      endDateTime.setHours(parseInt(endHour), parseInt(endMin));
    }

    const { reminder_minutes, ...payload } = eventData;
    await onSubmit({
      ...payload,
      start_date: startDateTime.toISOString(),
      end_date: endDateTime.toISOString()
    });

    // Reset form
    setEventData({
      title: '',
      description: '',
      event_type: DEFAULT_EVENT_TYPE,
      start_date: new Date(),
      end_date: new Date(),
      all_day: false,
      location: '',
      attendees: [],
      reminder_minutes: 15
    });
    setStartTime('09:00');
    setEndTime('10:00');
  };

  const selectedType = eventTypes.find(t => t.value === eventData.event_type) || eventTypes[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-foreground" />
            Create Calendar Event
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Event Type */}
          <div className="space-y-2">
            <Label className="text-foreground font-medium">Event Type *</Label>
            <Select
              value={eventData.event_type}
              onValueChange={(value) => {
                setEventData(prev => ({ ...prev, event_type: value }));
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", type.dot)} />
                      <span>{type.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label className="text-foreground font-medium">Event Title *</Label>
            <Input
              value={eventData.title}
              onChange={(e) => setEventData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Daily Standup, Sprint Planning..."
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-foreground font-medium">Description / Agenda</Label>
            <Textarea
              value={eventData.description}
              onChange={(e) => setEventData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Add meeting agenda or event details..."
              className="min-h-[100px]"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(new Date(eventData.start_date), 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={new Date(eventData.start_date)}
                    onSelect={(date) => setEventData(prev => ({ ...prev, start_date: date }))}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground font-medium">End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(new Date(eventData.end_date), 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={new Date(eventData.end_date)}
                    onSelect={(date) => setEventData(prev => ({ ...prev, end_date: date }))}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* All Day Toggle */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="all-day"
              checked={eventData.all_day}
              onCheckedChange={(checked) => setEventData(prev => ({ ...prev, all_day: checked }))}
            />
            <label
              htmlFor="all-day"
              className="text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              All day event
            </label>
          </div>

          {/* Time Pickers */}
          {!eventData.all_day && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Start Time
                </Label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  End Time
                </Label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Location */}
          <div className="space-y-2">
            <Label className="text-foreground font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location / Meeting Link
            </Label>
            <div className="flex gap-2">
              <Input
                value={eventData.location}
                onChange={(e) => setEventData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Meeting room or video call link..."
              />
              <Button
                type="button"
                variant="outline"
                className="px-4"
                onClick={() => setEventData(prev => ({
                  ...prev,
                  location: 'https://meet.google.com/new'
                }))}
              >
                <Video className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Attendees */}
          <div className="space-y-2">
            <Label className="text-foreground font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              Attendees
            </Label>

            {eventData.attendees.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-lg">
                {eventData.attendees.map((email) => (
                  <Badge key={email} variant="secondary" className="flex items-center gap-1">
                    {email}
                    <button
                      type="button"
                      onClick={() => handleRemoveAttendee(email)}
                      className="ml-1 hover:text-destructive transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Input
                value={newAttendee}
                onChange={(e) => setNewAttendee(e.target.value)}
                placeholder="Enter email address..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddAttendee();
                  }
                }}
              />
              <Button type="button" onClick={handleAddAttendee} variant="outline">
                Add
              </Button>
            </div>
          </div>

          {/* Reminder */}
          <div className="space-y-2">
            <Label className="text-foreground font-medium">Reminder</Label>
            <Select
              value={eventData.reminder_minutes?.toString()}
              onValueChange={(value) => setEventData(prev => ({
                ...prev,
                reminder_minutes: parseInt(value)
              }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">No reminder</SelectItem>
                <SelectItem value="5">5 minutes before</SelectItem>
                <SelectItem value="15">15 minutes before</SelectItem>
                <SelectItem value="30">30 minutes before</SelectItem>
                <SelectItem value="60">1 hour before</SelectItem>
                <SelectItem value="1440">1 day before</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!eventData.title}>
              <div className={cn("w-2.5 h-2.5 rounded-full mr-2", selectedType.dot)} />
              Create Event
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
