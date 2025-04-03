"use client";

import { motion } from "framer-motion";
import {
  format,
  addDays,
  startOfWeek,
  isSameDay,
  isWithinInterval,
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
  DragOverEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";

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
  day,
  children,
  className,
}: {
  day: {
    date: Date;
    dayName: string;
    dayNumber: string;
    monthName: string;
    isToday: boolean;
  };
  children: React.ReactNode;
  className?: string;
}) {
  const { setNodeRef } = useDroppable({
    id: day.date.toString(),
  });

  return (
    <div ref={setNodeRef} className={className}>
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

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  const startDate = isMobile ? currentDate : startOfWeek(currentDate);

  const days = Array.from({ length: isMobile ? 1 : 7 }, (_, i) => {
    const date = addDays(startDate, i);
    return {
      date,
      dayName: format(date, "EEE"),
      dayNumber: format(date, "d"),
      monthName: format(date, "MMM"),
      isToday: isSameDay(date, new Date()),
    };
  });

  const getEventsForDay = (date: Date) => {
    return events.filter((event) => {
      const eventStart = new Date(event.startTime);
      const eventEnd = new Date(event.endTime);
      return (
        isSameDay(date, eventStart) ||
        isSameDay(date, eventEnd) ||
        (date >= eventStart && date <= eventEnd)
      );
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const draggedEvent = events.find((e) => e.id === event.active.id);
    setActiveId(event.active.id as string);
    setActiveEvent(draggedEvent || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);
    setActiveEvent(null);

    if (over && active.id !== over.id) {
      const overDate = new Date(over.id as string);
      onEventMove(active.id as string, overDate);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 bg-white overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-7 h-[calc(100vh-4rem)] divide-y md:divide-y-0 md:divide-x divide-gray-200">
          {days.map((day, index) => (
            <DroppableDay
              key={day.date.toString()}
              day={day}
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
              <div className="flex-1 p-4 relative">
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
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-sm text-gray-400">No events scheduled</p>
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
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeId && activeEvent ? (
          <EventCard
            event={activeEvent}
            onEdit={onEditEvent}
            onDelete={onDeleteEvent}
            onOpenDetail={onOpenDetail}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
