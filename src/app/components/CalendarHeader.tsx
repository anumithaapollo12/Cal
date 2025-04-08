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
    <header className="bg-white border-b border-gray-200 py-2 px-3 md:py-4 md:px-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <h1 className="text-lg md:text-xl font-semibold text-gray-900">
              Calendar
            </h1>
            <span className="text-base md:text-lg font-medium text-gray-600">
              {format(
                currentDate,
                currentView === "year"
                  ? "yyyy"
                  : currentView === "month"
                  ? "MMMM yyyy"
                  : isMobile
                  ? "MMM yyyy"
                  : "MMMM yyyy"
              )}
            </span>
          </div>

          {isMobile ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-lg hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              ) : (
                <Bars3Icon className="w-6 h-6 text-gray-600" />
              )}
            </motion.button>
          ) : (
            <div className="flex items-center gap-2 md:gap-3">
              <div className="flex rounded-lg border border-gray-200 p-0.5">
                {["week", "month", "year"].map((view) => (
                  <motion.button
                    key={view}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      onViewChange(view as "week" | "month" | "year")
                    }
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onAddNote}
                  className="inline-flex items-center justify-center gap-2 px-3 py-1.5 md:py-2 
                          text-sm font-medium text-yellow-700 bg-yellow-50 rounded-lg 
                          hover:bg-yellow-100 transition-colors"
                >
                  <LightBulbIcon className="w-4 h-4" />
                  <span>Add Note</span>
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onInsightsClick}
                className="inline-flex items-center justify-center gap-2 px-3 py-1.5 md:py-2 
                        text-sm font-medium text-blue-700 bg-blue-50 rounded-lg 
                        hover:bg-blue-100 transition-colors"
              >
                <CalendarDaysIcon className="w-4 h-4" />
                <span>Insights</span>
              </motion.button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
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

          {isMobile && (
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onAddNote}
                className="p-1.5 rounded-lg hover:bg-yellow-50 text-yellow-700"
              >
                <LightBulbIcon className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onInsightsClick}
                className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-700"
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
              className="overflow-hidden"
            >
              <div className="py-2 space-y-2">
                <div className="flex rounded-lg border border-gray-200 p-0.5">
                  {["week", "month", "year"].map((view) => (
                    <motion.button
                      key={view}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onViewChange(view as "week" | "month" | "year");
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                        currentView === view
                          ? "bg-gray-900 text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {view.charAt(0).toUpperCase() + view.slice(1)}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
