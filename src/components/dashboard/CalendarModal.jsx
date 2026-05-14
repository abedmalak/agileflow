import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, AlertCircle, MapPin, Users } from "lucide-react";
import { Item } from "@/api/entities/Item";
import { Board } from "@/api/entities/Board";
import { CalendarEvent } from "@/api/entities/CalendarEvent";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, isPast } from 'date-fns';
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function CalendarModal({ isOpen, onClose }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [items, setItems] = useState([]);
  const [boards, setBoards] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadCalendarData();
    }
  }, [isOpen]);

  const loadCalendarData = async () => {
    setIsLoading(true);
    try {
      const [itemsData, boardsData, eventsData] = await Promise.all([
        Item.list("-updated_date"),
        Board.list("-updated_date"),
        CalendarEvent.list("-start_date")
      ]);
      setItems(itemsData);
      setBoards(boardsData);
      setCalendarEvents(eventsData);
    } catch (error) {
      console.error("Error loading calendar data:", error);
    }
    setIsLoading(false);
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get items with due dates
  const getItemsForDate = (date) => {
    return items.filter(item => {
      const board = boards.find(b => b.id === item.board_id);
      const dueDateColumn = board?.columns?.find(col => col.type === 'date');
      const dueDate = item.data?.[dueDateColumn?.id];
      
      if (!dueDate) return false;
      return isSameDay(new Date(dueDate), date);
    });
  };

  // Get calendar events for date
  const getEventsForDate = (date) => {
    return calendarEvents.filter(event => {
      const eventStart = new Date(event.start_date);
      const eventEnd = new Date(event.end_date);
      return isSameDay(eventStart, date) || 
             (date >= eventStart && date <= eventEnd);
    });
  };

  const getItemStatus = (item) => {
    const board = boards.find(b => b.id === item.board_id);
    const statusColumn = board?.columns?.find(col => col.type === 'status');
    return item.data?.[statusColumn?.id] || 'Not Started';
  };

  const isOverdue = (item, date) => {
    const status = getItemStatus(item);
    return isPast(date) && status !== 'Done' && !isToday(date);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const selectedDateItems = selectedDate ? getItemsForDate(selectedDate) : [];
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-primary" />
              Calendar Overview
            </DialogTitle>
            <Link to={createPageUrl("Calendar")}>
              <Button 
                variant="outline" 
                className="text-sm"
                onClick={onClose}
              >
                Open Full Calendar →
              </Button>
            </Link>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-foreground">
              {format(currentDate, 'MMMM yyyy')}
            </h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={previousMonth}
                className="h-8 w-8 rounded-lg"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextMonth}
                className="h-8 w-8 rounded-lg"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {/* Calendar Grid */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
            
            {monthDays.map((date, index) => {
              const dayItems = getItemsForDate(date);
              const dayEvents = getEventsForDate(date);
              const hasOverdue = dayItems.some(item => isOverdue(item, date));
              const isSelected = selectedDate && isSameDay(date, selectedDate);
              const totalCount = dayItems.length + dayEvents.length;
              
              return (
                <motion.div
                  key={date.toISOString()}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.01 }}
                  className={`
                    relative p-2 min-h-[80px] border rounded-lg cursor-pointer transition-all hover:shadow-md
                    ${isSameMonth(date, currentDate) ? 'bg-card border-border' : 'bg-muted border-border'}
                    ${isToday(date) ? 'ring-2 ring-primary ring-opacity-50' : ''}
                    ${isSelected ? 'bg-primary text-primary-foreground' : ''}
                    ${hasOverdue ? 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950' : ''}
                  `}
                  onClick={() => setSelectedDate(date)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-sm font-semibold ${
                      isSelected ? 'text-primary-foreground' :
                      isToday(date) ? 'text-primary' :
                      !isSameMonth(date, currentDate) ? 'text-muted-foreground' :
                      'text-foreground'
                    }`}>
                      {format(date, 'd')}
                    </span>
                    {totalCount > 0 && (
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${isSelected ? 'bg-primary-foreground/20 text-primary-foreground' : ''}`}
                      >
                        {totalCount}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-1">
                    {/* Calendar Events */}
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={`event-${event.id}`}
                        className={`text-xs p-1 rounded truncate ${
                          isSelected
                            ? 'bg-primary-foreground/20 text-primary-foreground'
                            : 'text-white'
                        }`}
                        style={{ 
                          backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : event.color
                        }}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    
                    {/* Task Items */}
                    {dayItems.slice(0, 2 - dayEvents.length).map((item) => {
                      const isItemOverdue = isOverdue(item, date);
                      
                      return (
                        <div
                          key={`item-${item.id}`}
                          className={`text-xs p-1 rounded truncate ${
                            isSelected
                              ? 'bg-primary-foreground/20 text-primary-foreground'
                              : isItemOverdue
                              ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                              : 'bg-muted text-foreground'
                          }`}
                          title={item.title}
                        >
                          {item.title}
                        </div>
                      );
                    })}
                    
                    {totalCount > 2 && (
                      <div className={`text-xs ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        +{totalCount - 2} more
                      </div>
                    )}
                  </div>
                  
                  {hasOverdue && (
                    <AlertCircle className="absolute top-1 right-1 w-3 h-3 text-red-500" />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Selected Date Details */}
          {selectedDate && (selectedDateItems.length > 0 || selectedDateEvents.length > 0) && (
            <div className="mt-6 p-4 bg-muted rounded-xl max-h-64 overflow-y-auto">
              <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {format(selectedDate, 'EEEE, MMMM d, yyyy')} ({selectedDateItems.length + selectedDateEvents.length} items)
              </h4>
              
              <div className="space-y-2">
                {/* Calendar Events */}
                {selectedDateEvents.map(event => (
                  <div key={`event-${event.id}`} className="flex items-center justify-between p-3 bg-card rounded-lg border-l-4" style={{ borderColor: event.color }}>
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="w-5 h-5" style={{ color: event.color }} />
                      <div>
                        <p className="font-medium text-foreground">{event.title}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {event.all_day ? 'All day' : format(new Date(event.start_date), 'h:mm a')}
                          </p>
                          {event.location && (
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.location.length > 20 ? event.location.substring(0, 20) + '...' : event.location}
                            </p>
                          )}
                          {event.attendees?.length > 0 && (
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {event.attendees.length}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge style={{ backgroundColor: event.color + '20', color: event.color }}>
                      {event.event_type}
                    </Badge>
                  </div>
                ))}
                
                {/* Task Items */}
                {selectedDateItems.map(item => {
                  const status = getItemStatus(item);
                  const board = boards.find(b => b.id === item.board_id);
                  const isItemOverdue = isOverdue(item, selectedDate);
                  
                  return (
                    <div key={`item-${item.id}`} className="flex items-center justify-between p-3 bg-card rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: board?.color || 'hsl(var(--primary))' }}
                        />
                        <div>
                          <p className="font-medium text-foreground">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{board?.title}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isItemOverdue && (
                          <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Overdue
                          </Badge>
                        )}
                        <Badge variant="outline">
                          {status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4 border-t">
          <Link to={createPageUrl("Calendar")}>
            <Button
              variant="outline"
              onClick={onClose}
              className="rounded-xl h-10 px-4"
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Open Full Calendar
            </Button>
          </Link>
          <Button
            onClick={onClose}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-10 px-6"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}