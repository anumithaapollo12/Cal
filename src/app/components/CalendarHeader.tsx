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
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Navigation Controls */}
          <div className="flex items-center space-x-1.5">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrevious}
              className="rounded-xl p-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 
                focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200"
              aria-label={isMobile ? "Previous day" : "Previous week"}
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="rounded-xl p-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50
                focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200"
              aria-label={isMobile ? "Next day" : "Next week"}
            >
              <ChevronRightIcon className="h-5 w-5" />
            </motion.button>
          </div>

          {/* Date Range Display */}
          <motion.h1
            className="text-lg sm:text-xl font-medium text-gray-900 tracking-[-0.01em]"
            layout
          >
            {isMobile ? (
              <span>{format(currentDate, "MMMM d, yyyy")}</span>
            ) : (
              <>
                <span className="hidden sm:inline">
                  {format(weekStart, "MMMM d")}
                  <span className="mx-2 text-gray-300">—</span>
                  {format(weekEnd, "MMMM d, yyyy")}
                </span>
                <span className="sm:hidden">
                  {format(weekStart, "MMM d")}
                  <span className="mx-1.5 text-gray-300">—</span>
                  {format(weekEnd, "MMM d")}
                </span>
              </>
            )}
          </motion.h1>

          {/* Today Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleToday}
            className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm 
              hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2
              transition-all duration-200"
          >
            Today
          </motion.button>
        </div>
      </div>
    </header>
  );
}
