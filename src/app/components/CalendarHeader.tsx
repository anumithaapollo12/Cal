"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";
import { format, addWeeks, subWeeks } from "date-fns";
import { motion } from "framer-motion";

interface CalendarHeaderProps {
  currentDate: Date;
  onWeekChange: (date: Date) => void;
  isMobile: boolean;
  onInsightsClick: () => void;
  onAddNote?: () => void;
}

export default function CalendarHeader({
  currentDate,
  onWeekChange,
  isMobile,
  onInsightsClick,
  onAddNote,
}: CalendarHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4 md:py-4 md:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0">
        <div className="flex items-center gap-3 md:gap-4">
          <h1 className="text-lg md:text-xl font-semibold text-gray-900">
            Calendar
          </h1>
          <div className="flex items-center gap-1 md:gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onWeekChange(subWeeks(currentDate, 1))}
              className="p-1.5 rounded-lg hover:bg-gray-100"
            >
              <ChevronLeftIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onWeekChange(new Date())}
              className="px-2.5 py-1 md:px-3 md:py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Today
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onWeekChange(addWeeks(currentDate, 1))}
              className="p-1.5 rounded-lg hover:bg-gray-100"
            >
              <ChevronRightIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
            </motion.button>
          </div>
          <span className="text-base md:text-lg font-medium text-gray-600">
            {format(currentDate, isMobile ? "MMM yyyy" : "MMMM yyyy")}
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {onAddNote && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAddNote}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-3 py-1.5 md:py-2 
                       text-sm font-medium text-yellow-700 bg-yellow-50 rounded-lg 
                       hover:bg-yellow-100 transition-colors"
            >
              <LightBulbIcon className="w-4 h-4" />
              <span className="md:inline">Add Note</span>
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onInsightsClick}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-3 py-1.5 md:py-2 
                     text-sm font-medium text-blue-700 bg-blue-50 rounded-lg 
                     hover:bg-blue-100 transition-colors"
          >
            <CalendarDaysIcon className="w-4 h-4" />
            <span className="md:inline">Insights</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
}
