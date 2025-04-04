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
    <motion.header
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[var(--color-gray-200)]"
      initial={false}
      animate={{
        boxShadow: "var(--shadow-subtle)",
        transition: { duration: 0.3, ease: "easeInOut" },
      }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex h-16 items-center justify-between px-6">
          {/* Navigation Controls */}
          <div className="flex items-center gap-1.5">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrevious}
              className="relative p-2.5 rounded-xl bg-[var(--color-gray-100)]
                       hover:bg-[var(--color-gray-200)] active:bg-[var(--color-gray-300)]
                       transition-colors group"
              aria-label={isMobile ? "Previous day" : "Previous week"}
            >
              <ChevronLeftIcon
                className="h-5 w-5 text-[var(--color-gray-500)]
                                       group-hover:text-[var(--color-gray-900)]
                                       transition-colors"
              />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="relative p-2.5 rounded-xl bg-[var(--color-gray-100)]
                       hover:bg-[var(--color-gray-200)] active:bg-[var(--color-gray-300)]
                       transition-colors group"
              aria-label={isMobile ? "Next day" : "Next week"}
            >
              <ChevronRightIcon
                className="h-5 w-5 text-[var(--color-gray-500)]
                                        group-hover:text-[var(--color-gray-900)]
                                        transition-colors"
              />
            </motion.button>
          </div>

          {/* Date Range Display */}
          <motion.div className="flex flex-col items-center" layout>
            <h1 className="text-lg font-semibold tracking-[-0.01em] text-[var(--color-gray-900)]">
              {isMobile ? (
                <span>{format(currentDate, "MMMM d, yyyy")}</span>
              ) : (
                <>
                  <span className="hidden sm:inline">
                    {format(weekStart, "MMMM d")}
                    <span className="mx-2 text-[var(--color-gray-400)]">—</span>
                    {format(weekEnd, "MMMM d, yyyy")}
                  </span>
                  <span className="sm:hidden">
                    {format(weekStart, "MMM d")}
                    <span className="mx-1.5 text-[var(--color-gray-400)]">
                      —
                    </span>
                    {format(weekEnd, "MMM d")}
                  </span>
                </>
              )}
            </h1>
          </motion.div>

          {/* Today Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleToday}
            className="relative px-5 py-2 rounded-xl bg-[var(--color-primary)]
                     text-sm font-medium text-white tracking-[-0.01em]
                     hover:bg-[var(--color-primary-light)]
                     active:bg-[var(--color-primary-dark)]
                     transition-colors"
          >
            Today
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
