import { format } from "date-fns";
import { motion } from "framer-motion";
import { Event } from "../types/Event";
import {
  TrashIcon,
  PencilIcon,
  SparklesIcon,
  ClockIcon,
  MapPinIcon,
  CalendarIcon,
  UserGroupIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useCallback } from "react";

interface EventCardProps {
  event: Event;
  isDragging?: boolean;
  isDragEnabled?: boolean;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: string) => void;
  onOpenDetail?: (event: Event) => void;
}

export default function EventCard({
  event,
  isDragging = false,
  isDragEnabled = false,
  onEdit,
  onDelete,
  onOpenDetail,
}: EventCardProps) {
  const getEventStyles = useCallback(() => {
    // Get tag color based on event type
    const getTagStyle = (type: string) => {
      switch (type?.toLowerCase()) {
        case "event":
          return "bg-rose-50 text-[#FF385C]";
        case "task":
          return "bg-teal-50 text-[#008489]";
        case "appointment":
          return "bg-purple-50 text-[#914669]";
        case "birthday":
          return "bg-rose-50 text-[#FF385C]";
        case "anniversary":
          return "bg-purple-50 text-[#914669]";
        case "holiday":
          return "bg-blue-50 text-[#428BFF]";
        case "special":
          return "bg-orange-50 text-[#E07912]";
        default:
          return "bg-gray-50 text-[#717171]";
      }
    };

    return {
      bg: "bg-white",
      accent: event.color || "bg-[#FF385C]",
      text: "text-[#222222]",
      border: "border-gray-100",
      tag: getTagStyle(event.type || "event"),
    };
  }, [event.color, event.type]);

  const styles = getEventStyles();

  const handleEditClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (onEdit) {
        onEdit(event);
      }
    },
    [event, onEdit]
  );

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (onDelete) {
        onDelete(event.id);
      }
    },
    [event.id, onDelete]
  );

  const handleDetailsClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (onOpenDetail) {
        onOpenDetail(event);
      }
    },
    [event, onOpenDetail]
  );

  const handleCardClick = useCallback(
    (e: React.MouseEvent) => {
      // Only handle card clicks on desktop
      if (!isDragging && !isDragEnabled && window.innerWidth >= 640) {
        e.stopPropagation();
        onOpenDetail?.(event);
      }
    },
    [isDragging, isDragEnabled, event, onOpenDetail]
  );

  return (
    <div
      className="relative group touch-none"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Mobile Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-3 bg-white border-t border-gray-100 z-50 sm:hidden">
        <div className="flex gap-2">
          {onDelete && (
            <button
              onClick={handleDeleteClick}
              className="p-2.5 rounded-full bg-gray-50 active:scale-95 transition-transform duration-200 touch-none"
              aria-label="Delete event"
            >
              <TrashIcon className="w-5 h-5 text-[#222222]" />
            </button>
          )}
        </div>
        {onOpenDetail && (
          <button
            onClick={handleDetailsClick}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF385C] text-white active:scale-95 transition-transform duration-200 touch-none"
            aria-label="View event details"
          >
            <span className="text-sm font-medium">Details</span>
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Desktop Action Buttons */}
      <div
        className="absolute top-4 right-4 hidden sm:flex gap-2 z-50 opacity-0 group-hover:opacity-100 transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {onDelete && (
          <button
            onClick={handleDeleteClick}
            className="p-2.5 rounded-full bg-white shadow-lg active:scale-95 transition-transform duration-200"
            aria-label="Delete event"
          >
            <TrashIcon className="w-4 h-4 text-[#222222]" />
          </button>
        )}
      </div>

      {/* Card Content */}
      <motion.div
        className={`relative overflow-hidden select-none
          ${isDragging || isDragEnabled ? "z-40" : ""}
          ${
            isDragging || isDragEnabled
              ? "cursor-grabbing"
              : "sm:cursor-pointer cursor-default"
          }
          ${styles.bg}
          border ${styles.border}
          rounded-2xl
          transition-all duration-300
          sm:hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)]
          sm:active:scale-[0.98]
          pb-16 sm:pb-4
          ${
            isDragging
              ? "shadow-2xl scale-105"
              : "shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
          }`}
        initial={false}
        animate={{
          y: isDragging ? -8 : 0,
          scale: isDragging ? 1.05 : 1,
        }}
        whileTap={{ scale: window.innerWidth >= 640 ? 0.98 : 1 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
        onClick={handleCardClick}
      >
        {/* Accent Color Bar */}
        <div
          className="h-1 w-full rounded-t-2xl"
          style={{ backgroundColor: event.color || "#FF385C" }}
        />

        <div className="relative">
          {event.image && (
            <div className="relative w-full h-32 overflow-hidden">
              <Image
                src={event.image}
                alt={event.imageAlt || event.title}
                fill
                className="object-cover"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>
          )}

          <div className="p-4 space-y-3">
            {/* Header: Time and Type */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[#717171] min-w-0">
                <CalendarIcon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-normal truncate">
                  {format(new Date(event.startTime), "EEE, MMM d")}
                </span>
                <span className="text-[#DDDDDD] mx-0.5">·</span>
                <span className="text-sm font-normal truncate">
                  {format(new Date(event.startTime), "h:mm a")}
                </span>
              </div>

              <span
                className={`px-2.5 py-0.5 rounded-full text-sm font-normal truncate flex-shrink-0 ${styles.tag}`}
              >
                {event.isLifeEvent ? event.type : event.type || "Event"}
              </span>
            </div>

            {/* Title and Description */}
            <div className="space-y-1.5">
              <h3 className="text-base font-medium text-[#222222] leading-tight line-clamp-2">
                {event.title}
              </h3>
              {event.description && (
                <p className="text-[#717171] text-sm leading-normal line-clamp-2">
                  {event.description}
                </p>
              )}
            </div>

            {/* Location */}
            {event.location && (
              <div className="flex items-center gap-1.5 text-[#717171] min-w-0">
                <MapPinIcon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm truncate">{event.location}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
