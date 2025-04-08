"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
  LightBulbIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { format, addWeeks, subWeeks } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface CalendarHeaderProps {
  currentDate: Date;
  onWeekChange: (newDate: Date) => void;
  isMobile: boolean;
  onInsightsClick: () => void;
  onAddNote: () => void;
  currentView: "week" | "month" | "year";
  onViewChange: (view: "week" | "month" | "year") => void;
}

export default function CalendarHeader({
  currentDate,
  onWeekChange,
  isMobile,
  onInsightsClick,
  onAddNote,
  currentView,
  onViewChange,
}: CalendarHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
            {format(currentDate, "MMMM yyyy")}
          </h1>

          {isMobile ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -m-2 text-gray-400 hover:text-gray-500 transition-colors touch-none"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </motion.button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex rounded-xl border border-gray-200 p-0.5">
                {["week", "month", "year"].map((view) => (
                  <motion.button
                    key={view}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      onViewChange(view as "week" | "month" | "year")
                    }
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      currentView === view
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {view.charAt(0).toUpperCase() + view.slice(1)}
                  </motion.button>
                ))}
              </div>

              {onAddNote && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onAddNote}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium 
                    text-yellow-700 bg-yellow-50 rounded-lg hover:bg-yellow-100 
                    transition-colors touch-none"
                >
                  <LightBulbIcon className="w-5 h-5" />
                  <span>Add Note</span>
                </motion.button>
              )}

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onInsightsClick}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium 
                  text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 
                  transition-colors touch-none"
              >
                <ChartBarIcon className="w-5 h-5" />
                <span>My Time</span>
              </motion.button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onWeekChange(subWeeks(currentDate, 1))}
              className="p-2 -m-2 text-gray-400 hover:text-gray-500 
                transition-colors touch-none rounded-full"
              aria-label="Previous week"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onWeekChange(new Date())}
              className="px-3 py-1 text-sm font-medium text-gray-600 
                hover:bg-gray-100 rounded-lg transition-colors touch-none"
            >
              Today
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onWeekChange(addWeeks(currentDate, 1))}
              className="p-2 -m-2 text-gray-400 hover:text-gray-500 
                transition-colors touch-none rounded-full"
              aria-label="Next week"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </motion.button>
          </div>

          {isMobile && (
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onAddNote}
                className="p-2 -m-2 text-yellow-600 hover:text-yellow-700 
                  transition-colors touch-none rounded-full"
                aria-label="Add note"
              >
                <LightBulbIcon className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onInsightsClick}
                className="p-2 -m-2 text-blue-600 hover:text-blue-700 
                  transition-colors touch-none rounded-full"
                aria-label="View my time"
              >
                <ChartBarIcon className="w-5 h-5" />
              </motion.button>
            </div>
          )}
        </div>

        <AnimatePresence>
          {isMobile && isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 pb-2 overflow-hidden"
            >
              <div className="flex rounded-xl border border-gray-200 p-0.5">
                {["week", "month", "year"].map((view) => (
                  <motion.button
                    key={view}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onViewChange(view as "week" | "month" | "year");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      currentView === view
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {view.charAt(0).toUpperCase() + view.slice(1)}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
