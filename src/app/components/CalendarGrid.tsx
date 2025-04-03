"use client";

import { motion } from "framer-motion";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";

interface CalendarGridProps {
  currentDate: Date;
  isMobile: boolean;
}

export default function CalendarGrid({
  currentDate,
  isMobile,
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

  return (
    <div className="flex-1 bg-white overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-7 h-full divide-y md:divide-y-0 md:divide-x divide-gray-200">
        {days.map((day, index) => (
          <motion.div
            key={day.date.toString()}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`calendar-day min-h-[calc(100vh-4rem)] relative flex flex-col ${
              day.isToday ? "bg-blue-50" : ""
            }`}
          >
            {/* Day Header */}
            <div className="sticky top-16 bg-white/90 backdrop-blur-sm border-b border-gray-200 p-4 z-10">
              <div className="flex items-center justify-center md:justify-start gap-2">
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
            <div className="flex-1 p-4 space-y-2 overflow-y-auto">
              {/* Events will be rendered here */}
              <div className="h-full flex items-center justify-center text-gray-400">
                <p className="text-sm">No events scheduled</p>
              </div>
            </div>

            {/* Add Event Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute bottom-4 right-4 rounded-full bg-indigo-600 p-2 text-white shadow-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
          </motion.div>
        ))}
      </div>
    </div>
  );
}
