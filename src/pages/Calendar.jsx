import React, { useState, useEffect } from "react";
import { usePermissions } from "@/hooks/usePermissions";
import { CalendarEvent } from "@/api/entities/CalendarEvent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { showErrorToast } from "@/lib/error-utils";
import { cn } from "@/lib/utils";
import {
  Calendar as CalendarIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  Users,
  MapPin,
  Clock,
  X,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday
} from 'date-fns';
import { motion } from "framer-motion";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CreateEventModal from "../components/calendar/CreateEventModal";
import InfoTooltip from "@/components/common/InfoTooltip";
import ModuleHelp from "@/components/common/ModuleHelp";
import { AIExplainButton } from "@/components/ai/AIExplainButton";

// Semantic Tailwind color classes for event types — no hex values
const eventTypeConfig = {
  meeting:       { dot: 'bg-blue-500',   border: 'border-l-blue-500',   text: 'text-blue-700 dark:text-blue-400',   bg: 'bg-blue-50 dark:bg-blue-950/40'   },
  milestone:     { dot: 'bg-green-500',  border: 'border-l-green-500',  text: 'text-green-700 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950/40' },
  deadline:      { dot: 'bg-red-500',    border: 'border-l-red-500',    text: 'text-red-700 dark:text-red-400',     bg: 'bg-red-50 dark:bg-red-950/40'     },
  review:        { dot: 'bg-purple-500', border: 'border-l-purple-500', text: 'text-purple-700 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/40' },
  retrospective: { dot: 'bg-yellow-500', border: 'border-l-yellow-500', text: 'text-yellow-700 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-950/40' },
  planning:      { dot: 'bg-sky-500',    border: 'border-l-sky-500',    text: 'text-sky-700 dark:text-sky-400',     bg: 'bg-sky-50 dark:bg-sky-950/40'     },
  holiday:       { dot: 'bg-orange-500', border: 'border-l-orange-500', text: 'text-orange-700 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/40' },
  other:         { dot: 'bg-muted-foreground', border: 'border-l-muted-foreground', text: 'text-muted-foreground', bg: 'bg-muted' },
};

function getEventConfig(eventType) {
  return eventTypeConfig[eventType] || eventTypeConfig.other;
}

export default function CalendarPage() {
  const { toast } = useToast();
  const { canCreateEvent, canEditEvent } = usePermissions();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setIsLoading(true);
    setLoadError(false);
    try {
      const eventsData = await CalendarEvent.list('-start_date');
      setEvents(eventsData);
    } catch (error) {
      console.error("Error loading events:", error);
      setLoadError(true);
    }
    setIsLoading(false);
  };

  const handleCreateEvent = async (eventData) => {
    try {
      await CalendarEvent.create(eventData);
      await loadEvents();
      setShowCreateModal(false);
      setSelectedDate(null);
    } catch (error) {
      console.error('Error creating event:', error);
      showErrorToast(toast, "Creation failed", error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await CalendarEvent.delete(eventId);
      await loadEvents();
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error deleting event:', error);
      showErrorToast(toast, "Delete failed", error);
    }
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">Previous month</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <h2 className="text-2xl font-bold text-foreground">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">Next month</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => setCurrentMonth(new Date())}
                >
                  Today
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">Jump back to the current month and highlight today</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex gap-2">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">Filter events by type (meeting, deadline, milestone, etc.)</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {canCreateEvent && (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => {
                    setSelectedDate(new Date());
                    setShowCreateModal(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Event
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">Schedule a new event — meeting, deadline, milestone, or any other type</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          )}
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return (
      <div className="grid grid-cols-7 text-center text-sm font-medium text-muted-foreground mb-2 bg-muted rounded-lg p-2">
        {daysOfWeek.map(day => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="grid grid-cols-7 gap-2">
        {days.map(day => {
          const dayEvents = events.filter(event =>
            isSameDay(new Date(event.start_date), day)
          );
          const todayDay = isToday(day);
          const sameMonth = isSameMonth(day, currentMonth);

          return (
            <div
              key={day.toString()}
              className={cn(
                "min-h-[120px] p-3 rounded-lg border border-border transition-colors cursor-pointer hover:bg-muted/50 group/cell",
                !sameMonth && "bg-muted/30 opacity-60",
                sameMonth && "bg-card",
                todayDay && "ring-2 ring-foreground"
              )}
              title={`Click to create an event on ${format(day, 'MMM d')}`}
              onClick={() => {
                setSelectedDate(day);
                setShowCreateModal(true);
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={cn(
                  "text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full",
                  todayDay
                    ? "bg-foreground text-background"
                    : !sameMonth
                    ? "text-muted-foreground"
                    : "text-foreground"
                )}>
                  {format(day, 'd')}
                </span>
                {dayEvents.length > 0 && (
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="secondary" className="text-xs">
                          {dayEvents.length}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        {dayEvents.length} {dayEvents.length === 1 ? 'event' : 'events'} on this day
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>

              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => {
                  const cfg = getEventConfig(event.event_type);
                  const eventTime = !event.all_day
                    ? format(new Date(event.start_date), 'h:mm a')
                    : 'All day';
                  return (
                    <TooltipProvider key={event.id} delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "text-xs p-1.5 rounded-md cursor-pointer transition-colors border-l-2",
                              cfg.bg,
                              cfg.border,
                              "hover:opacity-80"
                            )}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(event);
                            }}
                          >
                            <div className={cn("font-medium truncate", cfg.text)}>
                              {event.title}
                            </div>
                            {!event.all_day && (
                              <div className="text-muted-foreground text-[10px]">
                                {eventTime}
                              </div>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs max-w-[200px]">
                          <p className="font-medium">{event.title}</p>
                          <p className="text-muted-foreground capitalize">{event.event_type} · {eventTime}</p>
                          {event.location && <p className="text-muted-foreground truncate">{event.location}</p>}
                          <p className="text-muted-foreground mt-0.5">Click to view details</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-muted-foreground pl-1">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
          <p className="text-sm text-muted-foreground">Loading calendar...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-6 bg-background min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="w-10 h-10 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Failed to load calendar</h2>
          <p className="text-sm text-muted-foreground">There was a problem fetching your events.</p>
          <Button variant="outline" onClick={loadEvents}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-foreground" />
            Team Calendar
            <ModuleHelp moduleKey="calendar" />
          </h1>
          <p className="text-muted-foreground mt-2">Manage meetings, milestones, and important dates</p>
          <AIExplainButton
            widgetTitle="Calendar Overview"
            widgetData={{
              totalEvents: events.length,
              upcomingCount: events.filter(e => new Date(e.start_date) >= new Date()).length,
              eventTypes: Object.fromEntries(
                Object.keys(eventTypeConfig).map(t => [t, events.filter(e => e.event_type === t).length])
              )
            }}
            className="mt-2"
          />
        </div>

        {/* Event Type Legend */}
        <Card className="mb-6 border border-border bg-card">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              {Object.entries(eventTypeConfig).map(([type, cfg]) => {
                const tooltipMap = {
                  meeting: "Use for standups, 1-on-1s, syncs, and any team gathering with a set time",
                  milestone: "Use to mark major deliverables, launches, or key project checkpoints",
                  deadline: "Use for hard due dates — submissions, approvals, or go/no-go cutoffs",
                  review: "Use for code reviews, design critiques, sprint reviews, and demo sessions",
                  retrospective: "Use for end-of-sprint retros to discuss wins, blockers, and improvements",
                  planning: "Use for sprint planning, roadmap sessions, and backlog grooming",
                  holiday: "Use for team holidays, PTO, and company-wide days off",
                  other: "Use for events that don't fit the categories above",
                };
                return (
                  <div key={type} className="flex items-center gap-2">
                    <div className={cn("w-2.5 h-2.5 rounded-full", cfg.dot)} />
                    <span className="text-sm capitalize text-muted-foreground">{type}</span>
                    <InfoTooltip text={tooltipMap[type] || tooltipMap.other} />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card className="border border-border bg-card">
          <CardContent className="p-6">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="mt-6 border border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold text-foreground">Upcoming Events</h3>
              <InfoTooltip text="Your next 5 upcoming events, sorted by date. Click any event to view its full details — time, location, attendees, and description." />
              <AIExplainButton
                widgetTitle="Upcoming Events"
                widgetData={{
                  upcomingCount: events.filter(e => new Date(e.start_date) >= new Date()).length,
                  nextEvents: events
                    .filter(e => new Date(e.start_date) >= new Date())
                    .slice(0, 5)
                    .map(e => ({ title: e.title, date: e.start_date, type: e.event_type }))
                }}
              />
            </div>
            <div className="space-y-3">
              {events
                .filter(e => new Date(e.start_date) >= new Date())
                .slice(0, 5)
                .map(event => {
                  const cfg = getEventConfig(event.event_type);
                  return (
                    <div
                      key={event.id}
                      className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn("w-1 self-stretch rounded-full flex-shrink-0", cfg.dot)} />
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{event.title}</h4>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="w-3 h-3" />
                              {format(new Date(event.start_date), 'MMM d, yyyy')}
                            </span>
                            {!event.all_day && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {format(new Date(event.start_date), 'h:mm a')}
                              </span>
                            )}
                            {event.attendees?.length > 0 && (
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {event.attendees.length}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              {events.filter(e => new Date(e.start_date) >= new Date()).length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CalendarIcon className="h-10 w-10 text-muted-foreground/50 mb-3" />
                  <h3 className="text-sm font-medium text-foreground mb-1">No upcoming events</h3>
                  <p className="text-xs text-muted-foreground max-w-sm">
                    Click any date on the calendar or use the "New Event" button to schedule one.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Create Event Modal */}
        <CreateEventModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedDate(null);
          }}
          onSubmit={handleCreateEvent}
          preselectedDate={selectedDate}
        />

        {/* Event Detail Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-lg shadow-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className={cn("w-3 h-3 rounded-full flex-shrink-0", getEventConfig(selectedEvent.event_type).dot)} />
                      <h2 className="text-2xl font-bold text-foreground">{selectedEvent.title}</h2>
                    </div>
                    <TooltipProvider delayDuration={200}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="secondary" className="mt-2 capitalize cursor-default">
                            {selectedEvent.event_type}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="text-xs">The category of this event</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-start gap-3 text-sm">
                  <CalendarIcon className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">
                      {format(new Date(selectedEvent.start_date), 'EEEE, MMMM d, yyyy')}
                    </p>
                    {!selectedEvent.all_day && (
                      <p className="text-muted-foreground">
                        {format(new Date(selectedEvent.start_date), 'h:mm a')} - {format(new Date(selectedEvent.end_date), 'h:mm a')}
                      </p>
                    )}
                  </div>
                </div>

                {selectedEvent.location && (
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground mb-1">Location</p>
                      <a
                        href={selectedEvent.location.startsWith('http') ? selectedEvent.location : `https://${selectedEvent.location}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground underline break-all hover:opacity-70"
                      >
                        {selectedEvent.location}
                      </a>
                    </div>
                  </div>
                )}

                {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                  <div className="flex items-start gap-3 text-sm">
                    <Users className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground mb-2 flex items-center gap-1.5">
                        Attendees ({selectedEvent.attendees.length})
                        <InfoTooltip text="People invited to this event" size="xs" />
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedEvent.attendees.map((email, index) => (
                          <Badge key={index} variant="secondary">
                            {email}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedEvent.description && (
                  <div className="space-y-2">
                    <p className="font-medium text-foreground">Description / Agenda</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted p-4 rounded-lg">
                      {selectedEvent.description}
                    </p>
                  </div>
                )}

                <div className="flex justify-between pt-4 border-t border-border">
                  {canEditEvent ? (
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            if (window.confirm('Delete this event?')) {
                              handleDeleteEvent(selectedEvent.id);
                            }
                          }}
                        >
                          Delete Event
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">Permanently delete this event</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  ) : <div />}
                  <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
