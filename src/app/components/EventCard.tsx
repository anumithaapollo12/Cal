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
      className={`group relative rounded-2xl bg-white border border-black/[0.04] 
        ${isDragging ? "shadow-lg" : "shadow-sm hover:shadow-md"}`}
      layoutId={`event-${event.id}`}
    >
      {event.image && (
        <div className="relative w-full h-32 overflow-hidden">
          <Image
            src={event.image}
            alt={event.imageAlt || event.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-medium text-[#222222] truncate">
              {event.title}
            </h3>
            <p className="mt-1 text-sm text-[#717171]">
              {format(new Date(event.startTime), "h:mm a")}
            </p>
          </div>

          <div className="flex items-center gap-2 z-10">
            <button
              type="button"
              className="edit-button p-2 rounded-lg bg-gray-50 hover:bg-gray-100"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit(event);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <PencilIcon className="w-4 h-4 text-gray-600" />
            </button>
            <button
              type="button"
              className="delete-button p-2 rounded-lg bg-red-50 hover:bg-red-100"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(event.id);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <TrashIcon className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>

        {event.description && (
          <p className="mt-2 text-sm text-[#717171] line-clamp-2">
            {event.description}
          </p>
        )}
      </div>

      {/* Drag Handle */}
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-[#FF385C] origin-left transition-all duration-300
          ${isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
      />
    </motion.div>
  );
}
