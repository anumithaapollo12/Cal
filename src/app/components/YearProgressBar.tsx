"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { differenceInDays, format } from "date-fns";

interface YearProgressBarProps {
  startYear?: number;
  endYear?: number;
}

export default function YearProgressBar({
  startYear = new Date().getFullYear(),
  endYear = startYear + 1,
}: YearProgressBarProps) {
  const [progress, setProgress] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    const calculateProgress = () => {
      const now = new Date();
      const start = new Date(startYear, 0, 1); // January 1st of start year
      const end = new Date(startYear, 11, 31, 23, 59, 59, 999); // December 31st of start year
      const total = end.getTime() - start.getTime();
      const current = now.getTime() - start.getTime();
      const percentage = (current / total) * 100;

      // Calculate days left in the year
      const daysRemaining = differenceInDays(end, now);
      setDaysLeft(daysRemaining);

      return Math.max(0, Math.min(100, percentage));
    };

    // Initial calculation
    setProgress(calculateProgress());

    // Update progress every minute
    const interval = setInterval(() => {
      setProgress(calculateProgress());
    }, 60000);

    return () => clearInterval(interval);
  }, [startYear]);

  // Smooth animation for progress
  const smoothProgress = useSpring(progress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Transform progress to a gradient position
  const gradientProgress = useTransform(
    smoothProgress,
    [0, 100],
    ["0%", "100%"]
  );

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 h-10 bg-white border-t border-gray-200
                 flex items-center justify-center z-[60]"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center gap-4 max-w-2xl w-full px-4">
        <span className="text-sm font-medium text-gray-900">{startYear}</span>

        {/* Progress Bar Container */}
        <div className="flex-1 relative">
          {/* Background Bar */}
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gray-900 rounded-full"
              style={{ width: gradientProgress }}
            />
          </div>

          {/* Month Markers */}
          <div className="absolute inset-x-0 top-2 flex justify-between">
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className={`w-px h-1 ${
                  (progress / 100) * 12 > i ? "bg-gray-400" : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          {/* Days Left Indicator */}
          <motion.div
            className="absolute -top-5 -translate-x-1/2 whitespace-nowrap"
            style={{ left: gradientProgress }}
          >
            <span className="text-[10px] font-medium text-gray-500">
              {daysLeft} days left
            </span>
          </motion.div>
        </div>

        <span className="text-sm font-medium text-gray-400">{endYear}</span>
      </div>
    </motion.div>
  );
}
