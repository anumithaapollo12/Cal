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
} from "@heroicons/react/24/outline";
import Image from "next/image";

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
  const getEventStyles = () => {
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
      accent: event.color || "bg-[#FF385C]", // Use event color or fallback to Airbnb red
      text: "text-[#222222]",
      border: "border-gray-100",
      tag: getTagStyle(event.type || "event"),
    };
  };

  const styles = getEventStyles();

  return (
    <motion.div
      className={`group relative overflow-hidden select-none
        ${isDragging || isDragEnabled ? "z-50" : ""}
        ${isDragging || isDragEnabled ? "cursor-grabbing" : "cursor-pointer"}
        ${styles.bg}
        border ${styles.border}
        rounded-2xl
        transition-all duration-300
        hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)]
        hover:-translate-y-0.5
        active:translate-y-0
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
      whileHover={{
        scale: isDragging ? 1.05 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
      }}
      onClick={() => onOpenDetail?.(event)}
    >
      {/* Accent Color Bar - Using event.color directly */}
      <div
        className="h-1 w-full rounded-t-2xl"
        style={{ backgroundColor: event.color || "#FF385C" }}
      />

      <div className="relative">
        {event.image && (
          <div className="relative w-full h-40 overflow-hidden">
            <Image
              src={event.image}
              alt={event.imageAlt || event.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        )}

        <div className="p-6 space-y-4">
          {/* Header: Time and Type */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[#717171]">
              <CalendarIcon className="w-4 h-4" />
              <span className="text-sm font-normal">
                {format(new Date(event.startTime), "EEE, MMM d")}
              </span>
              <span className="text-[#DDDDDD]">·</span>
              <span className="text-sm font-normal">
                {format(new Date(event.startTime), "h:mm a")}
              </span>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-sm font-normal ${styles.tag}`}
            >
              {event.isLifeEvent ? event.type : event.type || "Event"}
            </span>
          </div>

          {/* Title and Description */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-[#222222] leading-tight">
              {event.title}
            </h3>
            {event.description && (
              <p className="text-[#717171] text-base leading-normal line-clamp-2">
                {event.description}
              </p>
            )}
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-center gap-2 text-[#717171]">
              <MapPinIcon className="w-4 h-4" />
              <span className="text-sm">{event.location}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
            {onEdit && !event.isLifeEvent && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(event);
                }}
                className="p-2 rounded-full bg-white shadow-lg hover:scale-105 transition-transform duration-200"
                aria-label="Edit event"
              >
                <PencilIcon className="w-4 h-4 text-[#222222]" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(event.id);
                }}
                className="p-2 rounded-full bg-white shadow-lg hover:scale-105 transition-transform duration-200"
                aria-label="Delete event"
              >
                <TrashIcon className="w-4 h-4 text-[#222222]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
