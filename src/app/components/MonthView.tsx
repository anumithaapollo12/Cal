import { motion } from "framer-motion";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { Event } from "../types/Event";
import { CalendarNote } from "./CalendarNote";
import EventCardWrapper from "./EventCardWrapper";

interface MonthViewProps {
  currentDate: Date;
  events: Event[];
  notes: CalendarNote[];
  onAddEvent: (date: Date) => void;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
  onOpenDetail: (
    event: Event,
    position?: { top: number; left: number; width: number; height: number }
  ) => void;
  onUpdateNote: (note: CalendarNote) => void;
  onDeleteNote: (noteId: string) => void;
  isMobile: boolean;
}

export default function MonthView({
  currentDate,
  events,
  notes,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  onOpenDetail,
  onUpdateNote,
  onDeleteNote,
  isMobile,
}: MonthViewProps) {
  // Get all days in the month, including padding days for complete weeks
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Group events by date
  const getEventsForDay = (date: Date) => {
    return events.filter((event) => isSameDay(new Date(event.startTime), date));
  };

  const getNotesForDay = (date: Date) => {
    return notes.filter((note) => isSameDay(note.date, date));
  };

  return (
    <div className="flex-1 overflow-hidden bg-white">
      <div className="grid grid-cols-7 text-sm leading-6 text-gray-500 border-b border-gray-200 sticky top-0 bg-white z-10">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="font-medium text-center py-2">
            {isMobile ? day.charAt(0) : day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 text-sm h-[calc(100vh-12rem)] md:h-[calc(100vh-8rem)] overflow-y-auto">
        {days.map((day, dayIdx) => {
          const dayEvents = getEventsForDay(day);
          const dayNotes = getNotesForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isToday = isSameDay(day, new Date());

          return (
            <motion.div
              key={day.toString()}
              className={`min-h-[100px] md:min-h-[120px] p-1 md:p-2 border-b border-r relative ${
                !isCurrentMonth ? "bg-gray-50" : ""
              }`}
              onClick={() => onAddEvent(day)}
              whileHover={{ backgroundColor: "rgb(249, 250, 251)" }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className={`flex items-center justify-end ${
                  !isCurrentMonth ? "text-gray-400" : "text-gray-900"
                }`}
              >
                <span
                  className={`flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-full text-sm ${
                    isToday
                      ? "bg-rose-600 text-white font-medium"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {format(day, "d")}
                </span>
              </div>
              <div className="space-y-1 mt-1">
                {dayEvents.slice(0, isMobile ? 2 : 3).map((event) => (
                  <div key={event.id} className="text-xs">
                    <EventCardWrapper
                      event={event}
                      onEdit={onEditEvent}
                      onDelete={onDeleteEvent}
                      onOpenDetail={onOpenDetail}
                      isCompact
                    />
                  </div>
                ))}
                {dayEvents.length > (isMobile ? 2 : 3) && (
                  <motion.div
                    className="text-xs text-rose-600 font-medium cursor-pointer active:scale-95 transition-transform"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    +{dayEvents.length - (isMobile ? 2 : 3)} more
                  </motion.div>
                )}
                {dayNotes.length > 0 && (
                  <motion.div
                    className="text-xs text-yellow-600 font-medium active:scale-95 transition-transform"
                    whileHover={{ scale: 1.05 }}
                  >
                    {dayNotes.length} note{dayNotes.length > 1 ? "s" : ""}
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
