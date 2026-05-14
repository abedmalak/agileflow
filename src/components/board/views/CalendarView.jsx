import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIconLucide, Users, MapPin, Clock } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { CalendarEvent as CalendarEventService } from "@/api/entities/CalendarEvent";
import { motion } from "framer-motion";

import TaskEditModal from "../TaskEditModal";
import CreateEventModal from "../../calendar/CreateEventModal";
import InfoTooltip from "../../common/InfoTooltip";
import ModuleHelp from "../../common/ModuleHelp";

const CalendarEvent = ({ item, board, onEdit, isTask }) => {
  const priorityColumn = board?.columns?.find(col => col.type === 'priority');
  const priorityValue = item.data?.[priorityColumn?.id];
  const priorityOption = priorityColumn?.options?.choices?.find(c => c.value === priorityValue);
  
  return (
    <div 
      className="p-1.5 mb-1 bg-card rounded-md shadow-sm border border-border hover:bg-muted cursor-pointer transition-all duration-200 hover:scale-105"
      title={item.title}
      onClick={(e) => {
        e.stopPropagation();
        onEdit(item);
      }}
    >
      <div className="flex items-center gap-1.5">
        {isTask && priorityOption && (
          <div 
            className="w-2 h-2 rounded-full flex-shrink-0" 
            style={{ backgroundColor: priorityOption.color || '#ccc' }}
          />
        )}
        {!isTask && (
          <div 
            className="w-2 h-2 rounded-full flex-shrink-0" 
            style={{ backgroundColor: item.color || '#0073EA' }}
          />
        )}
        <p className="text-xs font-medium text-foreground truncate">{item.title}</p>
      </div>
      {!isTask && item.start_date && !item.all_day && (
        <p className="text-[10px] text-gray-500 truncate">
          {format(new Date(item.start_date), 'h:mm a')}
        </p>
      )}
    </div>
  );
};

const EventDetailModal = ({ event, onClose, onDelete }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-2xl shadow-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: event.color || '#0073EA' }}
                />
                <h2 className="text-2xl font-bold text-foreground">{event.title}</h2>
              </div>
              <Badge className="mt-2" style={{ backgroundColor: event.color + '20', color: event.color }}>
                {event.event_type}
              </Badge>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Date & Time */}
          <div className="flex items-start gap-3 text-sm">
            <CalendarIconLucide className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">
                {format(new Date(event.start_date), 'EEEE, MMMM d, yyyy')}
              </p>
              {!event.all_day && (
                <p className="text-gray-600">
                  {format(new Date(event.start_date), 'h:mm a')} - {format(new Date(event.end_date), 'h:mm a')}
                </p>
              )}
              {event.all_day && (
                <p className="text-gray-600">All day</p>
              )}
            </div>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium text-foreground mb-1">Location</p>
                <a
                  href={event.location.startsWith('http') ? event.location : `https://${event.location}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline break-all"
                >
                  {event.location}
                </a>
              </div>
            </div>
          )}

          {/* Attendees */}
          {event.attendees && event.attendees.length > 0 && (
            <div className="flex items-start gap-3 text-sm">
              <Users className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-foreground mb-2">
                  Attendees ({event.attendees.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {event.attendees.map((email, index) => (
                    <Badge key={index} variant="secondary">
                      {email}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <div className="space-y-2">
              <p className="font-medium text-foreground">Description / Agenda</p>
              <p className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                {event.description}
              </p>
            </div>
          )}

          {/* Reminder */}
          {event.reminder_minutes > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              <Clock className="w-4 h-4" />
              <span>Reminder set for {event.reminder_minutes} minutes before</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="destructive"
              onClick={() => {
                if (window.confirm('Delete this event?')) {
                  onDelete(event.id);
                  onClose();
                }
              }}
            >
              Delete Event
            </Button>
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function CalendarView({ board, items, onUpdateItem, onDeleteItem }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dateColumnId, setDateColumnId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const dateCol = board?.columns?.find(col => col.type === 'date');
    if (dateCol) {
      setDateColumnId(dateCol.id);
    } else {
      const dueDateCol = board?.columns?.find(col => col.id === 'due_date');
      if (dueDateCol && dueDateCol.type === 'date') {
        setDateColumnId(dueDateCol.id);
      }
    }
  }, [board]);

  useEffect(() => {
    loadCalendarEvents();
  }, []);

  const loadCalendarEvents = async () => {
    try {
      const events = await CalendarEventService.list('-start_date');
      setCalendarEvents(events);
    } catch (error) {
      console.error('Error loading calendar events:', error);
      setCalendarEvents([]);
    }
  };

  const handleCreateEvent = async (eventData) => {
    try {
      await CalendarEventService.create(eventData);
      await loadCalendarEvents();
      setShowCreateEventModal(false);
      setSelectedDate(null);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await CalendarEventService.delete(eventId);
      await loadCalendarEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowEditModal(true);
  };

  const handleUpdateTask = (taskId, updates) => {
    onUpdateItem(taskId, updates);
    setShowEditModal(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId) => {
    onDeleteItem(taskId);
    setShowEditModal(false);
    setEditingTask(null);
  };

  const handleDayClick = (day) => {
    setSelectedDate(day);
    setShowCreateEventModal(true);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4 px-2">
        <Button variant="outline" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} title="Navigate to the previous month">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-foreground">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <InfoTooltip text="This calendar shows board tasks by due date and any team events. Click a day to add an event, or click an existing item to view details." side="bottom" />
          <ModuleHelp moduleKey="calendarView" />
          <Button
            onClick={() => {
              setSelectedDate(new Date());
              setShowCreateEventModal(true);
            }}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-9 px-4 text-sm"
            title="Create a new calendar event for today"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>
        <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} title="Navigate to the next month">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  const renderDays = () => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="grid grid-cols-7 text-center text-xs font-medium text-muted-foreground mb-2">
        {daysOfWeek.map(day => <div key={day} className="py-2 border-b">{day}</div>)}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const today = new Date();

    return (
      <div className="grid grid-cols-7 grid-rows-5 gap-px">
        {days.map(day => {
          const tasksForDay = dateColumnId 
            ? items.filter(item => item.data?.[dateColumnId] && isSameDay(new Date(item.data[dateColumnId]), day))
            : [];
          
          const eventsForDay = calendarEvents.filter(event => {
            const eventStart = new Date(event.start_date);
            const eventEnd = new Date(event.end_date);
            return isSameDay(eventStart, day) || 
                   (day >= eventStart && day <= eventEnd);
          });

          return (
            <div
              key={day.toString()}
              className={`p-2 border border-border min-h-[100px] relative transition-colors hover:bg-muted cursor-pointer
                ${!isSameMonth(day, monthStart) ? 'bg-muted text-muted-foreground' : 'bg-card'}
                ${isSameDay(day, today) ? 'ring-2 ring-primary ring-inset' : ''}
              `}
              onClick={() => handleDayClick(day)}
              title={`${format(day, 'EEEE, MMMM d')} — click to add an event`}
            >
              <span className={`text-xs font-medium ${isSameDay(day, today) ? 'text-primary' : ''}`}>
                {format(day, 'd')}
              </span>
              <div className="mt-1 space-y-1 overflow-y-auto max-h-[70px]">
                {eventsForDay.map(event => (
                  <CalendarEvent 
                    key={`event-${event.id}`} 
                    item={event} 
                    board={null}
                    onEdit={(e) => {
                      setSelectedEvent(e);
                    }}
                    isTask={false}
                  />
                ))}
                {tasksForDay.map(item => (
                  <CalendarEvent 
                    key={`task-${item.id}`} 
                    item={item} 
                    board={board} 
                    onEdit={handleEditTask}
                    isTask={true}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (!board) return <div className="p-4 text-center text-gray-500">Board data not available.</div>;

  return (
    <>
      <Card className="shadow-sm border-border">
        <CardContent className="p-4">
          {renderHeader()}
          {renderDays()}
          {renderCells()}
        </CardContent>
      </Card>

      {/* Task Edit Modal */}
      <TaskEditModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingTask(null);
        }}
        task={editingTask}
        board={board}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
      />

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={showCreateEventModal}
        onClose={() => {
          setShowCreateEventModal(false);
          setSelectedDate(null);
        }}
        onSubmit={handleCreateEvent}
        preselectedDate={selectedDate}
      />

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onDelete={handleDeleteEvent}
        />
      )}
    </>
  );
}