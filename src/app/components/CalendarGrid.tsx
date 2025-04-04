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
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import EventCard from "./EventCard";
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

interface CalendarGridProps {
  currentDate: Date;
  isMobile: boolean;
  events: Event[];
  onAddEvent: (date: Date) => void;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
  onEventMove: (eventId: string, newDate: Date) => void;
  onOpenDetail: (
    event: Event,
    position?: { top: number; left: number; width: number; height: number }
  ) => void;
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
    <div
      ref={setNodeRef}
      className={`flex-1 h-full transition-colors ${
        isOver ? "bg-blue-50" : ""
      }`}
    >
      {children}
    </div>
  );
}

export default function CalendarGrid({
  currentDate,
  isMobile,
  events,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  onEventMove,
  onOpenDetail,
}: CalendarGridProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [lastMoveX, setLastMoveX] = useState<number | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);

  useEffect(() => {
    setViewDate(currentDate);
  }, [currentDate]);

  const [viewDate, setViewDate] = useState(currentDate);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
      delay: 150,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 200,
      tolerance: 5,
      distance: 10,
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
      const dayEvents = events.filter((event) => {
        const eventStart = new Date(event.startTime);
        return isSameDay(date, eventStart);
      });
      eventMap.set(date.toISOString(), dayEvents);
    });

    return eventMap;
  }, [days, events]);

  // Efficient lookup function
  const getEventsForDay = useCallback(
    (date: Date) => eventsPerDay.get(date.toISOString()) || [],
    [eventsPerDay]
  );

  const handleDragStart = (event: DragStartEvent) => {
    const draggedEvent = events.find((e) => e.id === event.active.id);
    if (draggedEvent) {
      setActiveId(event.active.id as string);
      setActiveEvent(draggedEvent);
      if (isMobile) {
        const x = event.active.rect.current.translated?.left ?? 0;
        setDragStartX(x);
        setLastUpdateTime(Date.now());
      }
      document.body.style.cursor = "grabbing";
    }
  };

  const handleDragMove = useCallback(
    (event: DragMoveEvent) => {
      if (!isMobile || dragStartX === null) return;

      const x = event.active.rect.current.translated?.left ?? 0;
      const diff = x - dragStartX;
      const now = Date.now();

      // Require more movement on mobile for day change and add time threshold
      if (Math.abs(diff) > 35 && now - lastUpdateTime > 150) {
        if (diff < 0) {
          // Dragging left (go back in time)
          setViewDate((prev) => subDays(prev, 1));
        } else {
          // Dragging right (go forward in time)
          setViewDate((prev) => addDays(prev, 1));
        }
        setDragStartX(x); // Reset reference point
        setLastUpdateTime(now);
      }
    },
    [isMobile, dragStartX, lastUpdateTime]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveEvent(null);
    setDragStartX(null);
    setLastMoveX(null);
    setLastUpdateTime(0);
    document.body.style.cursor = "";

    if (over && active.id !== over.id) {
      onEventMove(active.id as string, new Date(over.id));
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setActiveEvent(null);
    setDragStartX(null);
    setLastMoveX(null);
    setLastUpdateTime(0);
    document.body.style.cursor = "";
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex-1 bg-gradient-to-br from-white to-gray-50 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-7 h-[calc(100vh-4rem)] divide-y md:divide-y-0 md:divide-x divide-gray-200/50">
          {days.map((day) => (
            <motion.div
              key={day.date.toString()}
              initial={false}
              animate={{
                backgroundColor: day.isToday
                  ? "rgb(239, 246, 255)"
                  : "transparent",
              }}
              className="relative flex flex-col group"
            >
              {/* Modern Day Header */}
              <motion.div
                className="sticky top-0 backdrop-blur-sm bg-white/80 border-b border-gray-200/50 z-20"
                initial={false}
                whileHover={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                }}
              >
                <div className="flex items-center justify-center md:justify-start gap-3 p-4">
                  <motion.div
                    className="flex flex-col items-center md:items-start"
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="text-sm font-medium text-gray-600">
                      {day.dayName}
                    </span>
                    <span className="text-xs text-gray-400 md:hidden">
                      {day.monthName}
                    </span>
                  </motion.div>
                  <motion.div
                    className={`flex items-center justify-center w-10 h-10 rounded-xl
                      ${
                        day.isToday
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                          : "text-gray-900 bg-white/50 shadow-sm"
                      }`}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 8px 20px -4px rgba(76, 29, 149, 0.2)",
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-xl font-semibold">
                      {day.dayNumber}
                    </span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Events Container with Modern Styling */}
              <DroppableDay date={day.date}>
                <motion.div
                  className="p-4 relative h-full"
                  initial={false}
                  whileHover={{
                    backgroundColor: "rgba(249, 250, 251, 0.8)",
                  }}
                >
                  <SortableContext
                    items={getEventsForDay(day.date).map((e) => e.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <motion.div
                      className="space-y-3"
                      initial={false}
                      animate={{
                        opacity: 1,
                        transition: { staggerChildren: 0.1 },
                      }}
                    >
                      {getEventsForDay(day.date).map((event) => (
                        <EventCard
                          key={event.id}
                          event={event}
                          onEdit={onEditEvent}
                          onDelete={onDeleteEvent}
                          onOpenDetail={onOpenDetail}
                        />
                      ))}
                    </motion.div>
                  </SortableContext>

                  {getEventsForDay(day.date).length === 0 && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <p className="text-sm text-gray-400/80 italic">
                        No events yet
                      </p>
                    </motion.div>
                  )}

                  {/* Modern Add Event Button */}
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 8px 20px -4px rgba(79, 70, 229, 0.3)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onAddEvent(day.date)}
                    className="absolute bottom-4 right-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 p-2.5 text-white shadow-lg hover:from-indigo-500 hover:to-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 z-10"
                  >
                    <motion.svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      initial={false}
                      animate={{ rotate: 0 }}
                      whileHover={{ rotate: 90 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 10,
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </motion.svg>
                  </motion.button>
                </motion.div>
              </DroppableDay>
            </motion.div>
          ))}
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeId && activeEvent ? (
          <motion.div
            className="transform touch-none pointer-events-none"
            initial={false}
            animate={{
              scale: 1.02,
              boxShadow:
                "0 8px 24px -4px rgba(0, 0, 0, 0.1), 0 2px 8px -2px rgba(0, 0, 0, 0.05)",
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 30,
                mass: 0.8,
              },
            }}
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
  );
}
