"use client";

import { format } from "date-fns";
import { motion } from "framer-motion";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Event } from "../types/Event";
import {
  TrashIcon,
  PencilIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useRef, useCallback } from "react";

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
  onOpenDetail: (
    event: Event,
    position: { top: number; left: number; width: number; height: number }
  ) => void;
}

export default function EventCard({
  event,
  onEdit,
  onDelete,
  onOpenDetail,
}: EventCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: event.id,
    transition: {
      duration: 150,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  });

  const handleClick = (e: React.MouseEvent) => {
    // Prevent opening detail view when clicking edit or delete buttons
    if ((e.target as HTMLElement).closest("button")) return;

    // Get the position from the event target
    const element = e.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();
    onOpenDetail(event, {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    });
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={`group relative rounded-lg p-4 bg-white select-none touch-none
        ${
          isDragging
            ? "shadow-lg opacity-50 z-50"
            : "hover:shadow-md opacity-100"
        }
        transition-all duration-200 ease-in-out cursor-pointer
        border border-gray-100 overflow-hidden`}
      initial={false}
      animate={{ opacity: isDragging ? 0.5 : 1 }}
      layoutId={`event-${event.id}`}
      whileHover={{
        scale: 1.02,
        backgroundColor: "rgb(249, 250, 251)",
        y: -2,
        transition: { type: "spring", stiffness: 400, damping: 25 },
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Color Bar */}
      <motion.div
        layoutId={`color-${event.id}`}
        className="absolute left-0 top-0 w-1.5 h-full"
        style={{ backgroundColor: event.color }}
        transition={{ type: "spring", stiffness: 250, damping: 25 }}
      />

      {/* Hover Indicator */}
      <motion.div
        initial={false}
        animate={{
          opacity: 0,
          x: "100%",
        }}
        whileHover={{
          opacity: 1,
          x: "0%",
        }}
        transition={{
          duration: 0.2,
          type: "spring",
          stiffness: 400,
          damping: 25,
        }}
        className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-50 to-transparent flex items-center justify-center"
      >
        <ChevronRightIcon className="h-5 w-5 text-gray-400" />
      </motion.div>

      <div className="flex flex-col space-y-2">
        {/* Title and Actions Row */}
        <div className="flex items-start justify-between">
          <motion.div className="flex-1 min-w-0 pr-2">
            <motion.h3
              layoutId={`title-${event.id}`}
              className="font-semibold text-gray-900 truncate text-base group-hover:text-indigo-600 transition-colors"
              transition={{ type: "spring", stiffness: 250, damping: 25 }}
            >
              {event.title}
            </motion.h3>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileHover={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.2,
              type: "spring",
              stiffness: 400,
              damping: 25,
            }}
            className="flex space-x-1 transition-all duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "rgb(238, 242, 255)" }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(event)}
              className="p-1 rounded-full text-gray-400 hover:text-indigo-600 transition-colors touch-none"
              aria-label="Edit event"
            >
              <PencilIcon className="h-4 w-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "rgb(254, 242, 242)" }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(event.id)}
              className="p-1 rounded-full text-gray-400 hover:text-red-600 transition-colors touch-none"
              aria-label="Delete event"
            >
              <TrashIcon className="h-4 w-4" />
            </motion.button>
          </motion.div>
        </div>

        {/* Time Display */}
        <motion.div
          layoutId={`time-${event.id}`}
          className="flex items-center text-sm text-gray-500"
        >
          <svg
            className="h-4 w-4 mr-1 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-medium">
            {format(new Date(event.startTime), "h:mm a")}
          </span>
          <span className="mx-1">-</span>
          <span className="font-medium">
            {format(new Date(event.endTime), "h:mm a")}
          </span>
        </motion.div>

        {/* Description */}
        {event.description && (
          <motion.div layoutId={`desc-${event.id}`} className="relative">
            <motion.div
              initial={{ height: "3em" }}
              whileHover={{ height: "auto" }}
              className="text-sm text-gray-600 overflow-hidden"
            >
              {event.description}
            </motion.div>
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white group-hover:from-gray-50 transition-colors" />
          </motion.div>
        )}

        {/* Duration Indicator */}
        <motion.div
          className="absolute bottom-0 left-1.5 right-1.5 h-0.5 rounded-full overflow-hidden"
          initial={{ opacity: 0.2 }}
          whileHover={{ opacity: 0.4 }}
        >
          <div
            className="h-full transition-colors"
            style={{ backgroundColor: event.color || "#3B82F6" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
