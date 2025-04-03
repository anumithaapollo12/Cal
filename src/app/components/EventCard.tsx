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
      className={`group relative rounded-xl p-4 bg-white select-none touch-none
        ${
          isDragging
            ? "shadow-lg opacity-50 z-50"
            : "shadow-sm hover:shadow-xl opacity-100"
        }
        transition-all duration-300 ease-out cursor-pointer
        border-0 overflow-hidden backdrop-blur-sm bg-white/90`}
      initial={false}
      animate={{ opacity: isDragging ? 0.5 : 1 }}
      layoutId={`event-${event.id}`}
      whileHover={{
        scale: 1.02,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        y: -2,
        transition: { type: "spring", stiffness: 400, damping: 25 },
      }}
      whileTap={{
        scale: 0.98,
        transition: { type: "spring", stiffness: 400, damping: 25 },
      }}
    >
      {/* Premium Glass Effect Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Enhanced Color Bar with Gradient */}
      <motion.div
        layoutId={`color-${event.id}`}
        className="absolute left-0 top-0 w-1 h-full rounded-full"
        style={{
          background: `linear-gradient(to bottom, ${event.color}, ${event.color}88)`,
          boxShadow: `0 0 10px ${event.color}33`,
        }}
        whileHover={{
          width: "2px",
          transition: { type: "spring", stiffness: 250, damping: 25 },
        }}
      />

      {/* Content Container with Enhanced Parallax */}
      <motion.div
        className="relative z-10"
        whileHover={{
          y: -2,
          transition: { type: "spring", stiffness: 400, damping: 25 },
        }}
      >
        <div className="flex flex-col space-y-2.5">
          {/* Title and Actions Row */}
          <div className="flex items-start justify-between">
            <motion.div
              className="flex-1 min-w-0 pr-2"
              whileHover={{
                x: 2,
                transition: { type: "spring", stiffness: 400, damping: 25 },
              }}
            >
              <motion.h3
                layoutId={`title-${event.id}`}
                className="font-semibold text-gray-800 truncate text-base group-hover:text-indigo-600 transition-colors"
                transition={{ type: "spring", stiffness: 250, damping: 25 }}
              >
                {event.title}
              </motion.h3>
            </motion.div>

            {/* Premium Action Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 10, y: -10 }}
              whileHover={{ opacity: 1, x: 0, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
                staggerChildren: 0.1,
              }}
              className="flex space-x-1.5 transition-all duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "rgb(238, 242, 255)",
                  y: -2,
                }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                onClick={() => onEdit(event)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 transition-colors touch-none bg-white/50 backdrop-blur-sm"
                aria-label="Edit event"
              >
                <PencilIcon className="h-3.5 w-3.5" />
              </motion.button>
              <motion.button
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "rgb(254, 242, 242)",
                  y: -2,
                }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                onClick={() => onDelete(event.id)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 transition-colors touch-none bg-white/50 backdrop-blur-sm"
                aria-label="Delete event"
              >
                <TrashIcon className="h-3.5 w-3.5" />
              </motion.button>
            </motion.div>
          </div>

          {/* Enhanced Time Display */}
          <motion.div
            layoutId={`time-${event.id}`}
            className="flex items-center text-sm text-gray-500"
            whileHover={{
              x: 2,
              transition: { type: "spring", stiffness: 400, damping: 25 },
            }}
          >
            <motion.div
              className="flex items-center gap-1.5"
              whileHover={{ scale: 1.02 }}
            >
              <svg
                className="h-4 w-4 text-gray-400"
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
              <span className="font-medium text-gray-600">
                {format(new Date(event.startTime), "h:mm a")}
              </span>
              <span className="mx-1 text-gray-400">→</span>
              <span className="font-medium text-gray-600">
                {format(new Date(event.endTime), "h:mm a")}
              </span>
            </motion.div>
          </motion.div>

          {/* Enhanced Description */}
          {event.description && (
            <motion.div
              layoutId={`desc-${event.id}`}
              className="relative"
              whileHover={{
                y: -2,
                transition: { type: "spring", stiffness: 400, damping: 25 },
              }}
            >
              <motion.div
                initial={{ height: "3em" }}
                whileHover={{ height: "auto" }}
                className="text-sm text-gray-500 overflow-hidden leading-relaxed"
              >
                {event.description}
              </motion.div>
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white via-white/80 to-transparent"
                whileHover={{
                  opacity: 0.6,
                  transition: { duration: 0.2 },
                }}
              />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Premium Duration Indicator */}
      <motion.div
        className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full overflow-hidden"
        initial={{ opacity: 0.2, scaleX: 0.98 }}
        whileHover={{
          opacity: 0.4,
          scaleX: 1,
          transition: { type: "spring", stiffness: 400, damping: 25 },
        }}
      >
        <motion.div
          className="h-full"
          style={{
            background: `linear-gradient(to right, ${event.color}66, ${event.color})`,
            boxShadow: `0 0 10px ${event.color}33`,
          }}
          whileHover={{
            scale: 1.1,
            transition: { type: "spring", stiffness: 400, damping: 25 },
          }}
        />
      </motion.div>
    </motion.div>
  );
}
