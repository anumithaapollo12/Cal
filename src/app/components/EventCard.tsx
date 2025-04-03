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
      className={`group relative rounded-lg p-3 bg-white select-none touch-none
        ${
          isDragging
            ? "shadow-lg opacity-50 z-50"
            : "hover:shadow-md opacity-100"
        }
        transition-all cursor-grab active:cursor-grabbing`}
      initial={false}
      animate={{ opacity: isDragging ? 0.5 : 1 }}
      layoutId={`event-${event.id}`}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <motion.h3
            layoutId={`title-${event.id}`}
            className="font-medium text-gray-900 truncate"
          >
            {event.title}
          </motion.h3>
          <motion.p
            layoutId={`time-${event.id}`}
            className="text-sm text-gray-500"
          >
            {format(new Date(event.startTime), "h:mm a")} -{" "}
            {format(new Date(event.endTime), "h:mm a")}
          </motion.p>
          {event.description && (
            <motion.p
              layoutId={`desc-${event.id}`}
              className="mt-1 text-sm text-gray-600 line-clamp-2"
            >
              {event.description}
            </motion.p>
          )}
        </div>
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
          <button
            onClick={() => onEdit(event)}
            className="text-gray-400 hover:text-gray-500 touch-none"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(event.id)}
            className="text-gray-400 hover:text-red-500 touch-none"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      <motion.div
        layoutId={`color-${event.id}`}
        className="absolute left-0 top-0 w-1 h-full rounded-l-lg"
        style={{ backgroundColor: event.color }}
      />
    </motion.div>
  );
}
