"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { format, addWeeks, startOfWeek, endOfWeek } from "date-fns";
import { motion } from "framer-motion";

interface CalendarHeaderProps {
  currentDate: Date;
  onWeekChange: (date: Date) => void;
}

export default function CalendarHeader({
  currentDate,
  onWeekChange,
}: CalendarHeaderProps) {
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);

  const handlePreviousWeek = () => {
    onWeekChange(addWeeks(currentDate, -1));
  };

  const handleNextWeek = () => {
    onWeekChange(addWeeks(currentDate, 1));
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePreviousWeek}
              className="rounded-full p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNextWeek}
              className="rounded-full p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </motion.button>
          </div>

          <motion.h1 className="text-2xl font-semibold text-gray-900" layout>
            {format(weekStart, "MMMM d")} - {format(weekEnd, "MMMM d, yyyy")}
          </motion.h1>

          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Today
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
}
