"use client";

import { format } from "date-fns";
import { motion } from "framer-motion";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Event } from "../types/Event";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useRef, useCallback, memo, useMemo } from "react";

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
  onOpenDetail: (
    event: Event,
    position: { top: number; left: number; width: number; height: number }
  ) => void;
  isDragging?: boolean;
}

const EventCard = memo(function EventCard({
  event,
  onEdit,
  onDelete,
  onOpenDetail,
  isDragging,
}: EventCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const isInteractive = !isDragging;

  // Memoize sortable configuration
  const sortableConfig = useMemo(
    () => ({
      id: event.id,
      transition: {
        duration: 150,
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    }),
    [event.id]
  );

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable(sortableConfig);

  // Memoize style object
  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition,
      touchAction: "none",
      willChange: "transform",
    }),
    [transform, transition]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest("button")) return;
      if (transform) return; // Don't open if we're dragging

      const element = e.currentTarget as HTMLElement;
      const rect = element.getBoundingClientRect();
      onOpenDetail(event, {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    },
    [event, onOpenDetail, transform]
  );

  // Memoize animation configurations
  const animations = useMemo(
    () => ({
      hover: isInteractive
        ? {
            y: -4,
            transition: { type: "spring", stiffness: 400, damping: 25 },
          }
        : undefined,
      tap: isInteractive
        ? {
            scale: 0.98,
            transition: { type: "spring", stiffness: 400, damping: 25 },
          }
        : undefined,
    }),
    [isInteractive]
  );

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={`group relative rounded-2xl select-none touch-none
        ${
          isDragging
            ? "shadow-lg bg-white/95 backdrop-blur-sm z-50"
            : "shadow-sm hover:shadow-xl bg-white"
        }
        transition-all duration-200 ease-out cursor-pointer
        border border-gray-100 overflow-hidden`}
      initial={false}
      animate={{
        opacity: isDragging ? 0.85 : 1,
        scale: isDragging ? 1.02 : 1,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 30,
          mass: 0.8,
        },
      }}
      layoutId={`event-${event.id}`}
      whileHover={animations.hover}
      whileTap={animations.tap}
    >
      {/* Event Image */}
      {event.image && !isDragging && (
        <motion.div
          layoutId={`image-container-${event.id}`}
          className="relative aspect-[16/9] w-full overflow-hidden"
        >
          <motion.img
            layoutId={`image-${event.id}`}
            src={event.image}
            alt={event.imageAlt || event.title}
            className="w-full h-full object-cover"
          />
          <motion.div
            layoutId={`image-overlay-${event.id}`}
            className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
          />
          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-3 right-3 flex gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button
              onClick={() => onEdit(event)}
              className="p-2 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900
                shadow-sm backdrop-blur-sm transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <PencilIcon className="h-4 w-4" />
            </motion.button>
            <motion.button
              onClick={() => onDelete(event.id)}
              className="p-2 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-red-600
                shadow-sm backdrop-blur-sm transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <TrashIcon className="h-4 w-4" />
            </motion.button>
          </motion.div>
        </motion.div>
      )}

      {/* Content Container */}
      <motion.div
        className={`relative p-4 ${event.image ? "" : "pt-3"}`}
        style={{
          borderLeft: `4px solid ${event.color}`,
        }}
      >
        {/* Title and Actions Row */}
        <div className="flex items-start justify-between mb-2">
          <motion.div className="flex-1 min-w-0">
            <motion.h3
              layoutId={`title-${event.id}`}
              className="font-medium text-base text-gray-900 leading-tight"
            >
              {event.title}
            </motion.h3>
          </motion.div>

          {/* Action Buttons (when no image) */}
          {!isDragging && !event.image && (
            <motion.div
              className="flex gap-1.5 ml-3"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                onClick={() => onEdit(event)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600
                  hover:bg-gray-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PencilIcon className="h-3.5 w-3.5" />
              </motion.button>
              <motion.button
                onClick={() => onDelete(event.id)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600
                  hover:bg-red-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <TrashIcon className="h-3.5 w-3.5" />
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Time Display */}
        <motion.div
          layoutId={`time-${event.id}`}
          className="flex items-center text-sm text-gray-500 mb-2"
        >
          <div className="flex items-center gap-1.5">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium text-gray-600">
              {format(new Date(event.startTime), "h:mm a")}
            </span>
            <span className="text-gray-400 mx-0.5">→</span>
            <span className="font-medium text-gray-600">
              {format(new Date(event.endTime), "h:mm a")}
            </span>
          </div>
        </motion.div>

        {/* Description */}
        {!isDragging && event.description && (
          <motion.div
            layoutId={`desc-${event.id}`}
            className="text-sm text-gray-500 line-clamp-2 leading-relaxed"
          >
            {event.description}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
});

export default EventCard;
