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
    data: event,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        // Prevent opening detail view when clicking edit or delete buttons
        if ((e.target as HTMLElement).closest("button")) return;
        onOpenDetail(event);
      }}
      className={`group relative rounded-lg p-3 hover:shadow-md transition-shadow bg-white cursor-grab active:cursor-grabbing ${
        isDragging ? "shadow-lg" : ""
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layoutId={`event-${event.id}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <motion.h3
            layoutId={`title-${event.id}`}
            className="font-medium text-gray-900"
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
              className="mt-1 text-sm text-gray-600"
            >
              {event.description}
            </motion.p>
          )}
        </div>
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(event)}
            className="text-gray-400 hover:text-gray-500"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(event.id)}
            className="text-gray-400 hover:text-red-500"
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
