"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import CalendarHeader from "./components/CalendarHeader";
import CalendarGrid from "./components/CalendarGrid";
import Modal from "./components/Modal";
import EventForm from "./components/EventForm";
import EventDetail from "./components/EventDetail";
import SidePanel from "./components/SidePanel";
import YearProgressBar from "./components/YearProgressBar";
import { Event } from "./types/Event";
import { CalendarNote } from "./components/CalendarNote";

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [notes, setNotes] = useState<CalendarNote[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
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

  const handleAddEvent = (date: Date) => {
    setSelectedDate(date);
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter((event) => event.id !== eventId));
  };

  const handleEventSubmit = (eventData: Omit<Event, "id">) => {
    if (editingEvent) {
      // Update existing event
      setEvents(
        events.map((event) =>
          event.id === editingEvent.id ? { ...eventData, id: event.id } : event
        )
      );
    } else {
      // Create new event
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
    event: Event,
    position?: { top: number; left: number; width: number; height: number }
  ) => {
    setSelectedEvent(event);
    setCardPosition(position);
  };

  const handleUpdateNote = (note: CalendarNote) => {
    setNotes((prevNotes) => {
      const existingNoteIndex = prevNotes.findIndex((n) => n.id === note.id);
      if (existingNoteIndex >= 0) {
        // Update existing note
        const updatedNotes = [...prevNotes];
        updatedNotes[existingNoteIndex] = note;
        return updatedNotes;
      } else {
        // Add new note
        return [...prevNotes, note];
      }
    });
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
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

  return (
    <main className="flex flex-col h-screen bg-gray-50">
      <CalendarHeader
        currentDate={currentDate}
        onWeekChange={handleWeekChange}
        isMobile={isMobile}
        onInsightsClick={() => setIsSidePanelOpen(true)}
        onAddNote={handleQuickAddNote}
      />
      <div className="flex-1 overflow-hidden">
        <CalendarGrid
          currentDate={currentDate}
          isMobile={isMobile}
          events={events}
          notes={notes}
          onAddEvent={handleAddEvent}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
          onEventMove={handleEventMove}
          onOpenDetail={handleOpenDetail}
          onUpdateNote={handleUpdateNote}
          onDeleteNote={handleDeleteNote}
        />
      </div>

      <YearProgressBar isBlurred={isSidePanelOpen} />

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

      <EventDetail
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => {
          setSelectedEvent(null);
          setCardPosition(undefined);
        }}
      />

      <SidePanel
        isOpen={isSidePanelOpen}
        onClose={() => setIsSidePanelOpen(false)}
      />
    </main>
  );
}
