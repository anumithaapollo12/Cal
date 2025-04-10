"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import dynamic from "next/dynamic";
import CalendarHeader from "./components/CalendarHeader";
import Modal from "./components/Modal";
import EventForm from "./components/EventForm";
import EventDetail from "./components/EventDetail";
import SidePanel from "./components/SidePanel";
import YearProgressBar from "./components/YearProgressBar";
import MobileDatePicker from "./components/MobileDatePicker";
import { Event } from "./types/Event";
import { LifeEvent } from "./types";
import { Goal } from "./types/Goal";
import { CalendarNote } from "./components/CalendarNote";
import { useLocalStorage } from "./hooks/useLocalStorage";
import MonthView from "./components/MonthView";
import YearView from "./components/YearView";
import { mockEvents, mockLifeEvents, mockNotes, mockGoals } from "./mockData";

// Dynamically import CalendarGrid with no SSR
const CalendarGrid = dynamic(() => import("./components/CalendarGrid"), {
  ssr: false,
});

type CalendarView = "week" | "month" | "year";

export default function Home() {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [currentView, setCurrentView] = useState<CalendarView>("week");
  const [isMobile, setIsMobile] = useState(false);
  const [events, setEvents] = useLocalStorage<Event[]>(
    "calendar-events",
    mockEvents
  );
  const [lifeEvents, setLifeEvents] = useLocalStorage<LifeEvent[]>(
    "calendar-life-events",
    mockLifeEvents
  );
  const [notes, setNotes] = useLocalStorage<CalendarNote[]>(
    "calendar-notes",
    mockNotes
  );
  const [goals, setGoals] = useLocalStorage<Goal[]>(
    "calendar-goals",
    mockGoals
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | LifeEvent | null>(
    null
  );
  const [cardPosition, setCardPosition] = useState<
    | {
        top: number;
        left: number;
        width: number;
        height: number;
      }
    | undefined
  >(undefined);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Convert life events to calendar events
  const convertedLifeEvents = lifeEvents.map(
    (lifeEvent): Event => ({
      id: lifeEvent.id,
      title: lifeEvent.title,
      description: lifeEvent.note,
      startTime: new Date(lifeEvent.date),
      endTime: new Date(lifeEvent.date),
      color: lifeEvent.color || "bg-gray-100",
      type: lifeEvent.type,
      isLifeEvent: true,
    })
  );

  // Combine regular events and converted life events
  const allEvents = [...events, ...convertedLifeEvents];

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    let timeoutId: NodeJS.Timeout | null = null;
    const handleResize = () => {
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

  const handleAddEvent = (date: Date) => {
    setSelectedDate(date);
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  // Add handler for deleting life events
  const handleDeleteLifeEvent = (eventId: string) => {
    setLifeEvents((prev) => {
      const updatedEvents = prev.filter((event) => event.id !== eventId);
      // Update localStorage immediately after state change
      localStorage.setItem(
        "calendar-life-events",
        JSON.stringify(updatedEvents)
      );
      return updatedEvents;
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    // Check if it's a life event first
    const lifeEvent = lifeEvents.find((event) => event.id === eventId);
    if (lifeEvent) {
      handleDeleteLifeEvent(eventId);
    } else {
      setEvents(events.filter((event) => event.id !== eventId));
    }
  };

  const handleEventSubmit = (eventData: Omit<Event, "id">) => {
    if (editingEvent) {
      setEvents(
        events.map((event) =>
          event.id === editingEvent.id ? { ...eventData, id: event.id } : event
        )
      );
    } else {
      setEvents([...events, { ...eventData, id: uuidv4() }]);
    }
    setIsModalOpen(false);
    setEditingEvent(null);
    setSelectedDate(null);
  };

  const handleEventMove = (eventId: string, newDate: Date) => {
    setEvents(
      events.map((event) => {
        if (event.id === eventId) {
          const startDate = new Date(event.startTime);
          const endDate = new Date(event.endTime);
          const duration = endDate.getTime() - startDate.getTime();

          const newStartDate = new Date(newDate);
          newStartDate.setHours(startDate.getHours());
          newStartDate.setMinutes(startDate.getMinutes());

          const newEndDate = new Date(newStartDate.getTime() + duration);

          return {
            ...event,
            startTime: newStartDate,
            endTime: newEndDate,
          };
        }
        return event;
      })
    );
  };

  const handleOpenDetail = (
    event: Event | LifeEvent,
    position?: { top: number; left: number; width: number; height: number }
  ) => {
    console.log("Opening detail for event:", event);
    setSelectedEvent(event);
    setCardPosition(position);
  };

  const handleUpdateNote = (note: CalendarNote) => {
    setNotes((prevNotes: CalendarNote[]) => {
      const existingNoteIndex = prevNotes.findIndex((n) => n.id === note.id);
      if (existingNoteIndex >= 0) {
        const updatedNotes = [...prevNotes];
        updatedNotes[existingNoteIndex] = note;
        return updatedNotes;
      } else {
        return [...prevNotes, note];
      }
    });
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes((prevNotes: CalendarNote[]) =>
      prevNotes.filter((note) => note.id !== noteId)
    );
  };

  const handleQuickAddNote = () => {
    const newNote: CalendarNote = {
      id: uuidv4(),
      content: "",
      color: "bg-yellow-100 border-yellow-200",
      date: currentDate,
      createdAt: new Date(),
      isPinned: false,
    };
    handleUpdateNote(newNote);
  };

  // Add handler for life events
  const handleAddLifeEvent = (lifeEvent: LifeEvent) => {
    setLifeEvents((prev) => [...prev, lifeEvent]);
  };

  if (!isClient) {
    return <div className="flex flex-col h-screen bg-gray-50" />;
  }

  return (
    <main className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <CalendarHeader
        currentDate={currentDate}
        onWeekChange={handleWeekChange}
        isMobile={isMobile}
        onInsightsClick={() => setIsSidePanelOpen(true)}
        onAddNote={handleQuickAddNote}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      <MobileDatePicker
        currentDate={currentDate}
        onDateChange={setCurrentDate}
      />
      <div className="flex-1 overflow-y-auto">
        {currentView === "week" && (
          <CalendarGrid
            currentDate={currentDate}
            isMobile={isMobile}
            events={allEvents}
            notes={notes}
            onAddEvent={handleAddEvent}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
            onEventMove={handleEventMove}
            onOpenDetail={handleOpenDetail}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
          />
        )}
        {currentView === "month" && (
          <MonthView
            currentDate={currentDate}
            events={allEvents}
            notes={notes}
            isMobile={isMobile}
            onAddEvent={handleAddEvent}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
            onOpenDetail={handleOpenDetail}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
            onMonthChange={setCurrentDate}
          />
        )}
        {currentView === "year" && (
          <YearView
            currentDate={currentDate}
            events={allEvents}
            notes={notes}
            isMobile={isMobile}
            onMonthClick={handleWeekChange}
          />
        )}
      </div>

      <YearProgressBar isBlurred={isSidePanelOpen || !!selectedEvent} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEvent(null);
          setSelectedDate(null);
        }}
        title={editingEvent ? "Edit Event" : "Create Event"}
      >
        <EventForm
          initialEvent={editingEvent || undefined}
          selectedDate={selectedDate || undefined}
          onSubmit={handleEventSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingEvent(null);
            setSelectedDate(null);
          }}
        />
      </Modal>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[99999] overflow-hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setSelectedEvent(null);
              setCardPosition(undefined);
            }}
          />
          <div className="relative z-[99999] flex items-center justify-center min-h-screen p-4">
            <EventDetail
              event={selectedEvent}
              onClose={() => {
                console.log("Closing event detail");
                setSelectedEvent(null);
                setCardPosition(undefined);
              }}
            />
          </div>
        </div>
      )}

      <SidePanel
        isOpen={isSidePanelOpen}
        onClose={() => setIsSidePanelOpen(false)}
        onAddLifeEvent={handleAddLifeEvent}
        lifeEvents={lifeEvents}
        onDeleteLifeEvent={handleDeleteLifeEvent}
      />
    </main>
  );
}
