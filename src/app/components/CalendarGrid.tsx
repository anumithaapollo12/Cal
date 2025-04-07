"use client";

import { motion } from "framer-motion";
import {
  format,
  addDays,
  startOfWeek,
  isSameDay,
  isWithinInterval,
  subDays,
} from "date-fns";
import { Event } from "../types/Event";
import {
  TrashIcon,
  PencilIcon,
  LightBulbIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import EventCard from "./EventCard";
import CalendarNote, { CalendarNote as ICalendarNote } from "./CalendarNote";
import {
  DndContext,
  DragOverlay,
  useSensors,
  useSensor,
  MouseSensor,
  TouchSensor,
  DragStartEvent,
  DragEndEvent,
  useDroppable,
  pointerWithin,
  DragMoveEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState, useMemo, useCallback, useEffect } from "react";
import SidePanel from "./SidePanel";
import { v4 as uuidv4 } from "uuid";

const COLORS = [
  "bg-yellow-100 border-yellow-200",
  "bg-blue-100 border-blue-200",
  "bg-green-100 border-green-200",
  "bg-pink-100 border-pink-200",
  "bg-purple-100 border-purple-200",
];

interface CalendarGridProps {
  currentDate: Date;
  isMobile: boolean;
  events: Event[];
  notes: ICalendarNote[];
  onAddEvent: (date: Date) => void;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
  onEventMove: (eventId: string, newDate: Date) => void;
  onOpenDetail: (
    event: Event,
    position?: { top: number; left: number; width: number; height: number }
  ) => void;
  onUpdateNote: (note: ICalendarNote) => void;
  onDeleteNote: (noteId: string) => void;
}

function DroppableDay({
  date,
  children,
}: {
  date: Date;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: date.toString(),
  });

  return (
    <motion.div
      ref={setNodeRef}
      initial={false}
      animate={{
        backgroundColor: isOver ? "rgb(239, 246, 255)" : "transparent",
        scale: isOver ? 1.02 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="flex-1 h-full"
    >
      {children}
    </motion.div>
  );
}

export default function CalendarGrid({
  currentDate,
  isMobile,
  events,
  notes,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  onEventMove,
  onOpenDetail,
  onUpdateNote,
  onDeleteNote,
}: CalendarGridProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [activeNote, setActiveNote] = useState<ICalendarNote | null>(null);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [lastMoveX, setLastMoveX] = useState<number | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  useEffect(() => {
    setViewDate(currentDate);
  }, [currentDate]);

  const [viewDate, setViewDate] = useState(currentDate);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 8,
      delay: 0,
      tolerance: 0,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 200,
      tolerance: 5,
      distance: 0,
    },
  });

  const sensors = useSensors(mouseSensor, isMobile ? touchSensor : null);

  const startDate = isMobile ? viewDate : startOfWeek(currentDate);

  // Memoize days calculation
  const days = useMemo(
    () =>
      Array.from({ length: isMobile ? 1 : 7 }, (_, i) => {
        const date = addDays(startDate, i);
        return {
          date,
          dayName: format(date, "EEE"),
          dayNumber: format(date, "d"),
          monthName: format(date, "MMM"),
          isToday: isSameDay(date, new Date()),
        };
      }),
    [startDate, isMobile]
  );

  // Pre-compute events per day for better performance
  const eventsPerDay = useMemo(() => {
    const eventMap = new Map<string, Event[]>();

    days.forEach(({ date }) => {
      const dayEvents = events
        .filter((event) => {
          const eventStart = new Date(event.startTime);
          return isSameDay(date, eventStart);
        })
        .sort((a, b) => {
          const aTime = new Date(a.startTime).getTime();
          const bTime = new Date(b.startTime).getTime();
          return aTime - bTime;
        });

      eventMap.set(date.toISOString(), dayEvents);
    });

    return eventMap;
  }, [days, events]);

  // Pre-compute notes per day for better performance
  const notesPerDay = useMemo(() => {
    const noteMap = new Map<string, ICalendarNote[]>();

    days.forEach(({ date }) => {
      const dayNotes = notes.filter((note) => isSameDay(date, note.date));
      noteMap.set(date.toISOString(), dayNotes);
    });

    return noteMap;
  }, [days, notes]);

  // Efficient lookup function
  const getEventsForDay = useCallback(
    (date: Date) => eventsPerDay.get(date.toISOString()) || [],
    [eventsPerDay]
  );

  const getNotesForDay = useCallback(
    (date: Date) => notesPerDay.get(date.toISOString()) || [],
    [notesPerDay]
  );

  const handleDragStart = (event: DragStartEvent) => {
    if (!event.active) return;

    const draggedEvent = events.find((e) => e.id === event.active.id);
    const draggedNote = notes.find((n) => n.id === event.active.id);

    if (draggedEvent) {
      setActiveId(event.active.id as string);
      setActiveEvent(draggedEvent);
    } else if (draggedNote) {
      setActiveId(event.active.id as string);
      setActiveNote(draggedNote);
    }

    if (isMobile && event.active.rect.current) {
      const rect = event.active.rect.current;
      const x = rect.translated?.left ?? rect.initial?.left ?? 0;
      setDragStartX(x);
      setLastUpdateTime(Date.now());
    }
    document.body.style.cursor = "grabbing";
  };

  const handleDragMove = useCallback(
    (event: DragMoveEvent) => {
      if (!isMobile || dragStartX === null || !event.active.rect.current)
        return;

      const rect = event.active.rect.current;
      const x = rect.translated?.left ?? rect.initial?.left ?? 0;
      const diff = x - dragStartX;
      const now = Date.now();

      if (Math.abs(diff) > 35 && now - lastUpdateTime > 150) {
        if (diff < 0) {
          setViewDate((prev) => {
            const newDate = subDays(prev, 1);
            // Animate the calendar when switching days
            return newDate;
          });
        } else {
          setViewDate((prev) => {
            const newDate = addDays(prev, 1);
            // Animate the calendar when switching days
            return newDate;
          });
        }
        setDragStartX(x);
        setLastUpdateTime(now);
      }
    },
    [isMobile, dragStartX, lastUpdateTime]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveEvent(null);
    setActiveNote(null);
    setDragStartX(null);
    setLastMoveX(null);
    setLastUpdateTime(0);
    document.body.style.cursor = "";

    if (over && active.id !== over.id) {
      const draggedNote = notes.find((n) => n.id === active.id);
      if (draggedNote) {
        onUpdateNote({ ...draggedNote, date: new Date(over.id) });
      } else {
        onEventMove(active.id as string, new Date(over.id));
      }
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setActiveEvent(null);
    setActiveNote(null);
    setDragStartX(null);
    setLastMoveX(null);
    setLastUpdateTime(0);
    document.body.style.cursor = "";
  };

  const handleAddNote = (date: Date) => {
    const newNote: ICalendarNote = {
      id: uuidv4(),
      content: "",
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      date,
      createdAt: new Date(),
      isPinned: false,
    };
    onUpdateNote(newNote);
  };

  const handleDayClick = (e: React.MouseEvent, date: Date) => {
    // Only trigger add event if clicking on empty space
    if (e.target === e.currentTarget) {
      onAddEvent(date);
    }
  };

  return (
    <div className="relative h-full">
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <motion.div className="flex-1 overflow-hidden bg-white/60">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-7 h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] divide-y md:divide-y-0 md:divide-x divide-gray-100/70"
            initial={false}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {days.map((day) => (
              <motion.div
                key={day.date.toString()}
                initial={false}
                animate={{
                  backgroundColor: day.isToday
                    ? "rgb(249, 250, 251)"
                    : "transparent",
                }}
                className="relative flex flex-col group min-h-[500px] md:min-h-0"
              >
                {/* Day Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-3 bg-white border-b border-gray-100">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600">
                      {day.dayName}
                    </span>
                    <div
                      className={`ml-2 w-8 h-8 flex items-center justify-center rounded-full ${
                        day.isToday ? "bg-blue-600 text-white" : ""
                      }`}
                    >
                      <span className="text-sm">{day.dayNumber}</span>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddNote(day.date);
                      }}
                      className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-yellow-100 hover:text-yellow-700"
                    >
                      <LightBulbIcon className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddEvent(day.date);
                      }}
                      className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-700"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Content Area */}
                <DroppableDay date={day.date}>
                  <motion.div
                    className="p-3 md:p-4 relative h-full"
                    initial={false}
                    whileHover={{
                      backgroundColor: "rgba(249, 250, 251, 0.8)",
                    }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => handleDayClick(e, day.date)}
                  >
                    {/* Notes */}
                    <div className="space-y-2 mb-3">
                      {getNotesForDay(day.date).map((note) => (
                        <CalendarNote
                          key={note.id}
                          note={note}
                          onUpdate={onUpdateNote}
                          onDelete={onDeleteNote}
                        />
                      ))}
                    </div>

                    {/* Events */}
                    <SortableContext
                      items={getEventsForDay(day.date).map((e) => e.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <motion.div
                        className="space-y-2"
                        initial={false}
                        animate={{
                          opacity: 1,
                          transition: { staggerChildren: 0.05 },
                        }}
                      >
                        {getEventsForDay(day.date).map((event) => (
                          <EventCard
                            key={event.id}
                            event={event}
                            onEdit={onEditEvent}
                            onDelete={onDeleteEvent}
                            onOpenDetail={onOpenDetail}
                            isDragging={event.id === activeId}
                          />
                        ))}
                      </motion.div>
                    </SortableContext>

                    {getEventsForDay(day.date).length === 0 &&
                      getNotesForDay(day.date).length === 0 && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <p className="text-sm text-gray-400/70 font-medium">
                            Tap to add event
                          </p>
                        </motion.div>
                      )}
                  </motion.div>
                </DroppableDay>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <DragOverlay dropAnimation={null}>
          {activeId && activeEvent ? (
            <motion.div
              initial={false}
              animate={{
                scale: 1.05,
                boxShadow:
                  "0 16px 32px -4px rgba(0, 0, 0, 0.1), 0 8px 16px -4px rgba(0, 0, 0, 0.1)",
                rotate: 0,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
              }}
              className="transform-gpu touch-none"
            >
              <EventCard
                event={activeEvent}
                onEdit={onEditEvent}
                onDelete={onDeleteEvent}
                onOpenDetail={onOpenDetail}
                isDragging={true}
              />
            </motion.div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <SidePanel
        isOpen={isSidePanelOpen}
        onClose={() => setIsSidePanelOpen(false)}
      />
    </div>
  );
}
