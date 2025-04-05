"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { getQuarter, getMonth, getDaysInMonth, getDate } from "date-fns";

interface YearProgressBarProps {
  startYear?: number;
  endYear?: number;
}

export default function YearProgressBar({
  startYear = new Date().getFullYear(),
  endYear = startYear + 1,
}: YearProgressBarProps) {
  const [progress, setProgress] = useState(0);
  const [currentQuarter, setCurrentQuarter] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const calculateProgress = () => {
      const now = new Date();
      const month = getMonth(now); // 0-11
      const quarter = getQuarter(now);
      const dayOfMonth = getDate(now);
      const daysInMonth = getDaysInMonth(now);

      // Calculate progress including the day of the month
      const monthProgress = month + dayOfMonth / daysInMonth;
      const yearProgress = (monthProgress / 12) * 100;

      setCurrentQuarter(quarter);
      return Math.max(0, Math.min(100, yearProgress));
    };

    setProgress(calculateProgress());
    const interval = setInterval(calculateProgress, 60000);
    return () => clearInterval(interval);
  }, [startYear]);

  const smoothProgress = useSpring(progress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const gradientProgress = useTransform(
    smoothProgress,
    [0, 100],
    ["0%", "100%"]
  );

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200
                 flex items-center justify-center z-[60] h-20 py-5"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="w-full px-8 relative">
        {/* Progress Info Overlay */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 flex items-center space-x-4">
          <span className="text-base font-semibold text-gray-900">
            {startYear}
          </span>
        </div>

        {/* Progress Bar Container */}
        <div
          className="relative mx-32"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Quarter Labels */}
          <div className="flex justify-between mb-2">
            {["Q1", "Q2", "Q3", "Q4"].map((quarter, i) => (
              <motion.div
                key={i}
                className={`text-sm font-medium transition-colors
                  ${
                    currentQuarter === i + 1 ? "text-gray-900" : "text-gray-400"
                  }`}
                animate={{
                  opacity: isHovered || currentQuarter === i + 1 ? 1 : 0.7,
                }}
              >
                {quarter}
              </motion.div>
            ))}
          </div>

          {/* Main Progress Bar */}
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden relative">
            {/* Quarter sections background */}
            <div className="absolute inset-y-0 left-0 w-1/4 bg-gray-50" />
            <div className="absolute inset-y-0 left-1/4 w-1/4 bg-gray-100" />
            <div className="absolute inset-y-0 left-2/4 w-1/4 bg-gray-50" />
            <div className="absolute inset-y-0 left-3/4 w-1/4 bg-gray-100" />

            {/* Progress fill */}
            <div
              className="h-full bg-gray-900 relative z-10"
              style={{ width: `${progress}%` }}
            />

            {/* Quarter dividers */}
            <div className="absolute inset-0 flex justify-between pointer-events-none">
              <div className="h-full w-[3px] bg-gray-400" />
              <div
                className={`h-full w-[3px] ${
                  progress >= 25 ? "bg-white" : "bg-gray-400"
                }`}
              />
              <div
                className={`h-full w-[3px] ${
                  progress >= 50 ? "bg-white" : "bg-gray-400"
                }`}
              />
              <div
                className={`h-full w-[3px] ${
                  progress >= 75 ? "bg-white" : "bg-gray-400"
                }`}
              />
              <div className="h-full w-[3px] bg-gray-400" />
            </div>
          </div>
        </div>

        {/* Year End */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2">
          <span className="text-base font-medium text-gray-400">{endYear}</span>
        </div>
      </div>
    </motion.div>
  );
}
