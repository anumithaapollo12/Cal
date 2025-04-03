"use client";

import { motion } from "framer-motion";
import {
  format,
  addDays,
  startOfWeek,
  isSameDay,
  isWithinInterval,
} from "date-fns";
import { Event } from "../types/Event";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";

interface CalendarGridProps {
  currentDate: Date;
  isMobile: boolean;
  events: Event[];
  onAddEvent: (date: Date) => void;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
}

export default function CalendarGrid({
  currentDate,
  isMobile,
  events,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
}: CalendarGridProps) {
  // For desktop view, start from the beginning of the week
  // For mobile view, use the current selected date
  const startDate = isMobile ? currentDate : startOfWeek(currentDate);

  // Generate days to display
  const days = Array.from({ length: isMobile ? 1 : 7 }, (_, i) => {
    const date = addDays(startDate, i);
    return {
      date,
      dayName: format(date, "EEE"),
      dayNumber: format(date, "d"),
      monthName: format(date, "MMM"),
      isToday: isSameDay(date, new Date()),
    };
  });

  // Get events for a specific day
  const getEventsForDay = (date: Date) => {
    return events.filter((event) => {
      const eventStart = new Date(event.startTime);
      const eventEnd = new Date(event.endTime);

      // Check if the day contains any part of the event
      return (
        isSameDay(date, eventStart) ||
        isSameDay(date, eventEnd) ||
        (date >= eventStart && date <= eventEnd)
      );
    });
  };

  return (
    <div className="flex-1 bg-white overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-7 h-[calc(100vh-4rem)] divide-y md:divide-y-0 md:divide-x divide-gray-200">
        {days.map((day, index) => (
          <motion.div
            key={day.date.toString()}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative flex flex-col ${
              day.isToday ? "bg-blue-50" : ""
            }`}
          >
            {/* Day Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 z-20">
              <div className="flex items-center justify-center md:justify-start gap-2 p-4">
                <div className="flex flex-col items-center md:items-start">
                  <span className="text-sm font-medium text-gray-500">
                    {day.dayName}
                  </span>
                  <span className="text-xs text-gray-400 md:hidden">
                    {day.monthName}
                  </span>
                </div>
                <span
                  className={`flex items-center justify-center w-8 h-8 text-xl ${
                    day.isToday
                      ? "rounded-full bg-blue-600 text-white"
                      : "text-gray-900"
                  }`}
                >
                  {day.dayNumber}
                </span>
              </div>
            </div>

            {/* Events Container */}
            <div className="flex-1 p-4 relative">
              <div className="space-y-2">
                {getEventsForDay(day.date).map((event) => (
                  <div
                    key={event.id}
                    className="group relative rounded-lg p-3 hover:shadow-md transition-shadow bg-white"
                    style={{ backgroundColor: `${event.color}15` }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {format(new Date(event.startTime), "h:mm a")} -{" "}
                          {format(new Date(event.endTime), "h:mm a")}
                        </p>
                        {event.description && (
                          <p className="mt-1 text-sm text-gray-600">
                            {event.description}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEditEvent(event)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDeleteEvent(event.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div
                      className="absolute left-0 top-0 w-1 h-full rounded-l-lg"
                      style={{ backgroundColor: event.color }}
                    />
                  </div>
                ))}
              </div>

              {getEventsForDay(day.date).length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-sm text-gray-400">No events scheduled</p>
                </div>
              )}

              {/* Add Event Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onAddEvent(day.date)}
                className="absolute bottom-4 right-4 rounded-full bg-indigo-600 p-2 text-white shadow-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 z-10"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
