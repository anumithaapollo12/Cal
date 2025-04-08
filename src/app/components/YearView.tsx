import { motion } from "framer-motion";
import {
  format,
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
  isSameMonth,
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns";
import { Event } from "../types/Event";
import { CalendarNote } from "./CalendarNote";

interface YearViewProps {
  currentDate: Date;
  events: Event[];
  notes: CalendarNote[];
  onMonthClick: (date: Date) => void;
  isMobile: boolean;
}

export default function YearView({
  currentDate,
  events,
  notes,
  onMonthClick,
  isMobile,
}: YearViewProps) {
  const yearStart = startOfYear(currentDate);
  const yearEnd = endOfYear(currentDate);
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

  const getEventsForDay = (date: Date) => {
    return events.filter((event) => isSameDay(new Date(event.startTime), date));
  };

  const getNotesForDay = (date: Date) => {
    return notes.filter((note) => isSameDay(note.date, date));
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white p-2 md:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
        {months.map((month) => {
          const monthStart = startOfMonth(month);
          const monthEnd = endOfMonth(month);
          const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

          const monthEvents = days.reduce(
            (acc, day) => acc + getEventsForDay(day).length,
            0
          );
          const monthNotes = days.reduce(
            (acc, day) => acc + getNotesForDay(day).length,
            0
          );

          return (
            <motion.div
              key={month.toString()}
              className="border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors active:bg-gray-50"
              whileHover={{ scale: isMobile ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onMonthClick(month)}
            >
              <div className="bg-gray-50 p-2 md:p-3 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">
                  {format(month, "MMMM")}
                </h3>
              </div>
              <div className="p-2 md:p-3">
                <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                    <div key={day} className="text-gray-400 font-medium">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {Array.from({
                    length: new Date(
                      month.getFullYear(),
                      month.getMonth(),
                      1
                    ).getDay(),
                  }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {days.map((day) => (
                    <div
                      key={day.toString()}
                      className={`w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full ${
                        isSameDay(day, new Date())
                          ? "bg-rose-600 text-white font-medium"
                          : getEventsForDay(day).length > 0
                          ? "bg-rose-50 text-rose-600"
                          : ""
                      }`}
                    >
                      {format(day, "d")}
                    </div>
                  ))}
                </div>
                {(monthEvents > 0 || monthNotes > 0) && (
                  <div className="mt-2 text-xs font-medium flex flex-wrap gap-1">
                    {monthEvents > 0 && (
                      <span className="text-rose-600">
                        {monthEvents} event{monthEvents > 1 ? "s" : ""}
                      </span>
                    )}
                    {monthNotes > 0 && monthEvents > 0 && (
                      <span className="text-gray-300">•</span>
                    )}
                    {monthNotes > 0 && (
                      <span className="text-yellow-600">
                        {monthNotes} note{monthNotes > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
