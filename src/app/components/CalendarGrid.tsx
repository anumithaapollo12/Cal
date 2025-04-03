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
  const weekStart = startOfWeek(currentDate);

  // Generate days of the week
  const days = Array.from({ length: isMobile ? 1 : 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    return {
      date,
      dayName: format(date, "EEE"),
      dayNumber: format(date, "d"),
      isToday: isSameDay(date, new Date()),
    };
  });

  return (
    <div className="flex-1 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-7 h-full">
        {days.map((day, index) => (
          <motion.div
            key={day.date.toString()}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`calendar-day min-h-[600px] border-r border-b border-gray-200 p-4 ${
              day.isToday ? "bg-blue-50" : ""
            }`}
          >
            <div className="flex items-center justify-center md:justify-start">
              <div className="flex flex-col items-center md:items-start">
                <span className="text-sm font-medium text-gray-500">
                  {day.dayName}
                </span>
                <span
                  className={`mt-1 text-2xl ${
                    day.isToday
                      ? "rounded-full bg-blue-600 text-white w-10 h-10 flex items-center justify-center"
                      : "text-gray-900"
                  }`}
                >
                  {day.dayNumber}
                </span>
              </div>
            </div>

            {/* Event placeholder - we'll add events here later */}
            <div className="mt-8">{/* Events will be rendered here */}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
