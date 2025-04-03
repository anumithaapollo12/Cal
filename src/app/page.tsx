"use client";

import { useState, useEffect } from "react";
import CalendarHeader from "./components/CalendarHeader";
import CalendarGrid from "./components/CalendarGrid";

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    let timeoutId: NodeJS.Timeout | null = null;
    const handleResize = () => {
      // Debounce the resize event
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 150);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleWeekChange = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  return (
    <main className="flex flex-col h-screen bg-gray-50">
      <CalendarHeader
        currentDate={currentDate}
        onWeekChange={handleWeekChange}
        isMobile={isMobile}
      />
      <div className="flex-1 overflow-hidden">
        <CalendarGrid currentDate={currentDate} isMobile={isMobile} />
      </div>
    </main>
  );
}
