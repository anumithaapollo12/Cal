"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { format, addDays, addWeeks, startOfWeek, endOfWeek } from "date-fns";
import { motion } from "framer-motion";

interface CalendarHeaderProps {
  currentDate: Date;
  onWeekChange: (date: Date) => void;
  isMobile?: boolean;
}

export default function CalendarHeader({
  currentDate,
  onWeekChange,
  isMobile = false,
}: CalendarHeaderProps) {
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);

  const handlePrevious = () => {
    if (isMobile) {
      onWeekChange(addDays(currentDate, -1));
    } else {
      onWeekChange(addWeeks(currentDate, -1));
    }
  };

  const handleNext = () => {
    if (isMobile) {
      onWeekChange(addDays(currentDate, 1));
    } else {
      onWeekChange(addWeeks(currentDate, 1));
    }
  };

  const handleToday = () => {
    onWeekChange(new Date());
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Navigation Controls */}
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrevious}
              className="rounded-full p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label={isMobile ? "Previous day" : "Previous week"}
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="rounded-full p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label={isMobile ? "Next day" : "Next week"}
            >
              <ChevronRightIcon className="h-5 w-5" />
            </motion.button>
          </div>

          {/* Date Range Display */}
          <motion.h1
            className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 truncate"
            layout
          >
            {isMobile ? (
              <span>{format(currentDate, "MMMM d, yyyy")}</span>
            ) : (
              <>
                <span className="hidden sm:inline">
                  {format(weekStart, "MMMM d")} -{" "}
                  {format(weekEnd, "MMMM d, yyyy")}
                </span>
                <span className="sm:hidden">
                  {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d")}
                </span>
              </>
            )}
          </motion.h1>

          {/* Today Button */}
          <div className="flex items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToday}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Today
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
}
