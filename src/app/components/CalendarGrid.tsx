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
  onOpenDetail: (event: Event) => void;
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
      distance: 4,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 0,
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

  // Memoize events per day
  const getEventsForDay = useMemo(
    () => (date: Date) => {
      return events.filter((event) => {
        const eventStart = new Date(event.startTime);
        return isSameDay(date, eventStart);
      });
    },
    [events]
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
      <div className="flex-1 bg-white overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-7 h-[calc(100vh-4rem)] divide-y md:divide-y-0 md:divide-x divide-gray-200">
          {days.map((day) => (
            <div
              key={day.date.toString()}
              className={`relative flex flex-col ${
                day.isToday ? "bg-blue-50" : ""
              }`}
            >
              {/* Day Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 z-20">
                <div className="flex items-center justify-center md:justify-start gap-2 p-4">
                  <div className="flex flex-col items-center md:items-start">
                    <span className="text-sm font-medium text-gray-500">
                      {day.dayName}
                    </span>
                    <span className="text-xs text-gray-400 md:hidden">
                      {day.monthName}
                    </span>
                  </div>
                  <span
                    className={`flex items-center justify-center w-8 h-8 text-xl ${
                      day.isToday
                        ? "rounded-full bg-blue-600 text-white"
                        : "text-gray-900"
                    }`}
                  >
                    {day.dayNumber}
                  </span>
                </div>
              </div>

              {/* Events Container */}
              <DroppableDay date={day.date}>
                <div className="p-4 relative h-full">
                  <SortableContext
                    items={getEventsForDay(day.date).map((e) => e.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {getEventsForDay(day.date).map((event) => (
                        <EventCard
                          key={event.id}
                          event={event}
                          onEdit={onEditEvent}
                          onDelete={onDeleteEvent}
                          onOpenDetail={onOpenDetail}
                        />
                      ))}
                    </div>
                  </SortableContext>

                  {getEventsForDay(day.date).length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <p className="text-sm text-gray-400">
                        No events scheduled
                      </p>
                    </div>
                  )}

                  {/* Add Event Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onAddEvent(day.date)}
                    className="absolute bottom-4 right-4 rounded-full bg-indigo-600 p-2 text-white shadow-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 z-10"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </motion.button>
                </div>
              </DroppableDay>
            </div>
          ))}
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeId && activeEvent ? (
          <div className="transform scale-105 opacity-90 touch-none">
            <EventCard
              event={activeEvent}
              onEdit={onEditEvent}
              onDelete={onDeleteEvent}
              onOpenDetail={onOpenDetail}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
