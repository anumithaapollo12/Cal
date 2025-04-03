"use client";

import { format } from "date-fns";
import { motion } from "framer-motion";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Event } from "../types/Event";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
  onOpenDetail: (event: Event) => void;
}

export default function EventCard({
  event,
  onEdit,
  onDelete,
  onOpenDetail,
}: EventCardProps) {
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
    onOpenDetail(event);
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
        transition-all duration-200 ease-in-out cursor-grab active:cursor-grabbing
        hover:translate-y-[-2px] hover:bg-gray-50
        border border-gray-100`}
      initial={false}
      animate={{ opacity: isDragging ? 0.5 : 1 }}
      layoutId={`event-${event.id}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Color Bar */}
      <motion.div
        layoutId={`color-${event.id}`}
        className="absolute left-0 top-0 w-1.5 h-full rounded-l-lg"
        style={{ backgroundColor: event.color }}
      />

      <div className="flex flex-col space-y-2">
        {/* Title and Actions Row */}
        <div className="flex items-start justify-between">
          <motion.div className="flex-1 min-w-0 pr-2">
            <motion.h3
              layoutId={`title-${event.id}`}
              className="font-semibold text-gray-900 truncate text-base group-hover:text-indigo-600 transition-colors"
            >
              {event.title}
            </motion.h3>
          </motion.div>

          {/* Action Buttons */}
          <div
            className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(event)}
              className="p-1 rounded-full text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors touch-none"
              aria-label="Edit event"
            >
              <PencilIcon className="h-4 w-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(event.id)}
              className="p-1 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors touch-none"
              aria-label="Delete event"
            >
              <TrashIcon className="h-4 w-4" />
            </motion.button>
          </div>
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
            <div className="text-sm text-gray-600 line-clamp-2 group-hover:line-clamp-none transition-all">
              {event.description}
            </div>
            {event.description.length > 150 && (
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white group-hover:from-gray-50 transition-colors" />
            )}
          </motion.div>
        )}

        {/* Duration Indicator */}
        <div className="absolute bottom-0 left-1.5 right-1.5 h-0.5 rounded-full overflow-hidden">
          <div
            className="h-full opacity-20 transition-colors"
            style={{ backgroundColor: event.color || "#3B82F6" }}
          />
        </div>
      </div>
    </motion.div>
  );
}
