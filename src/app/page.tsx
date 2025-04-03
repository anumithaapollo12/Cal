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

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleWeekChange = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  return (
    <main className="flex flex-col h-screen">
      <CalendarHeader
        currentDate={currentDate}
        onWeekChange={handleWeekChange}
      />
      <CalendarGrid currentDate={currentDate} isMobile={isMobile} />
    </main>
  );
}
