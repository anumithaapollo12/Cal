"use client";

import { format } from "date-fns";
import { motion } from "framer-motion";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Event } from "../types/Event";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";
import Image from "next/image";

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
  onOpenDetail: (
    event: Event,
    position?: { top: number; left: number; width: number; height: number }
  ) => void;
  isDragging?: boolean;
}

export default function EventCard({
  event,
  onEdit,
  onDelete,
  onOpenDetail,
  isDragging = false,
}: EventCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: event.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  function handleCardClick(e: React.MouseEvent) {
    const target = e.target as HTMLElement;
    if (target.closest(".edit-button") || target.closest(".delete-button")) {
      return;
    }

    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      onOpenDetail(event, {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    }
  }

  return (
    <motion.div
      ref={(node) => {
        cardRef.current = node;
        setNodeRef(node);
      }}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleCardClick}
      className={`group relative card-premium overflow-hidden cursor-pointer
        ${
          isDragging
            ? "scale-105 shadow-elevated !border-[var(--color-primary)]"
            : ""
        }`}
      initial={false}
      whileHover={{
        scale: isDragging ? 1.05 : 1.02,
        y: -4,
      }}
      animate={{
        scale: 1,
        boxShadow: isDragging ? "var(--shadow-elevated)" : "var(--shadow-card)",
        transition: { duration: 0.2, ease: "easeOut" },
      }}
    >
      {/* Time Badge */}
      <div
        className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-[var(--color-gray-100)] 
           text-xs font-medium text-[var(--color-gray-500)] tracking-wide
           group-hover:bg-[var(--color-gray-200)] transition-all duration-300"
      >
        {format(new Date(event.startTime), "h:mm a")}
      </div>

      {/* Color Tag */}
      <div
        className="absolute top-0 left-0 w-1 h-full transition-all duration-300
                   group-hover:opacity-90"
        style={{ backgroundColor: event.color || "var(--color-primary)" }}
      />

      {event.image && (
        <div className="relative w-full h-48 overflow-hidden">
          <img
            src={event.image}
            alt={event.imageAlt || event.title}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-500
                     group-hover:scale-[1.02] group-hover:saturate-[1.05]"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/0 to-transparent 
                       transition-opacity duration-300 group-hover:opacity-90"
          />
        </div>
      )}

      <div className="p-5">
        <div className="flex flex-col gap-3">
          <div className="space-y-1.5">
            <h2
              className="text-base font-semibold text-[var(--color-gray-900)] 
                         group-hover:text-[var(--color-primary)] transition-colors duration-300"
            >
              {event.title}
            </h2>
            {event.description && (
              <div
                className="text-sm text-[var(--color-gray-500)] line-clamp-2
                          group-hover:text-[var(--color-gray-900)] transition-colors duration-300"
              >
                {event.description}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 pt-1 opacity-0 translate-y-1
                        group-hover:opacity-100 group-hover:translate-y-0 
                        transition-all duration-300 ease-out"
          >
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="edit-button p-2 rounded-xl bg-[var(--color-gray-100)]
                       hover:bg-[var(--color-gray-200)] active:bg-[var(--color-gray-300)]
                       transition-all duration-300"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit(event);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <PencilIcon
                className="w-4 h-4 text-[var(--color-gray-500)]
                                   group-hover:text-[var(--color-primary)] transition-colors duration-300"
              />
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="delete-button p-2 rounded-xl bg-red-50
                       hover:bg-red-100 active:bg-red-200
                       transition-all duration-300"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(event.id);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <TrashIcon className="w-4 h-4 text-[var(--color-error)]" />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Drag Indicator */}
      <motion.div
        initial={false}
        animate={{
          opacity: isDragging ? 1 : 0,
          height: isDragging ? "2px" : "1px",
        }}
        transition={{ duration: 0.2 }}
        className="absolute inset-x-4 bottom-0 bg-[var(--color-primary)]
                 rounded-full origin-left"
        style={{
          boxShadow: "0 0 8px var(--color-primary)",
        }}
      />
    </motion.div>
  );
}
