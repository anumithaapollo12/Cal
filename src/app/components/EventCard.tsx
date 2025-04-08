import { format } from "date-fns";
import { motion } from "framer-motion";
import { Event } from "../types/Event";
import {
  TrashIcon,
  PencilIcon,
  SparklesIcon,
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
  // Helper function to get event type icon
  const getEventIcon = () => {
    if (!event.isLifeEvent) return null;
    return <SparklesIcon className="w-4 h-4 text-amber-500" />;
  };

  // Helper function to get event type color
  const getEventTypeColor = () => {
    if (!event.isLifeEvent) return event.color || "var(--color-primary)";

    switch (event.type) {
      case "birthday":
        return "rgb(244, 114, 182)"; // pink-400
      case "anniversary":
        return "rgb(168, 85, 247)"; // purple-500
      case "holiday":
        return "rgb(59, 130, 246)"; // blue-500
      case "special":
        return "rgb(245, 158, 11)"; // amber-500
      default:
        return event.color || "var(--color-primary)";
    }
  };

  return (
    <motion.div
      className={`group relative card-premium overflow-hidden touch-none select-none
        ${isDragging || isDragEnabled ? "z-50" : ""}
        ${
          isDragging || isDragEnabled
            ? "cursor-grabbing shadow-2xl"
            : "cursor-pointer hover:shadow-lg"
        }
        ${
          event.isLifeEvent
            ? "border border-amber-200/50 bg-gradient-to-br from-amber-50/80 to-white/90"
            : ""
        }`}
      initial={false}
      animate={{
        scale: isDragging ? 1.05 : 1,
        boxShadow:
          isDragging || isDragEnabled
            ? "0 20px 40px -8px rgba(0, 0, 0, 0.2)"
            : "0 4px 12px -2px rgba(0, 0, 0, 0.05)",
        y: isDragging ? -4 : 0,
      }}
      whileHover={{
        scale: isDragging ? 1.05 : 1.02,
        y: -4,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
      }}
    >
      {/* Visual indicator for drag mode */}
      {isDragEnabled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/5 z-20 pointer-events-none"
        />
      )}

      {/* Content Area */}
      <div className="relative z-10">
        {/* Time Badge with Event Type Icon */}
        <motion.div
          className={`absolute top-4 right-4 px-2.5 py-1 rounded-full 
             text-xs font-medium tracking-wide flex items-center gap-1.5
             ${
               event.isLifeEvent
                 ? "bg-amber-100/80 text-amber-800"
                 : "bg-[var(--color-gray-100)] text-[var(--color-gray-500)]"
             }
             group-hover:bg-opacity-90 transition-all duration-300`}
          animate={{
            scale: isDragging ? 1.05 : 1,
          }}
        >
          {getEventIcon()}
          {format(new Date(event.startTime), "h:mm a")}
        </motion.div>

        {/* Color Tag */}
        <motion.div
          className="absolute top-0 left-0 w-1 h-full"
          style={{ backgroundColor: getEventTypeColor() }}
          animate={{
            opacity: isDragging ? 1 : 0.9,
            height: isDragging ? "100%" : "100%",
          }}
          transition={{ duration: 0.2 }}
        />

        {event.image && (
          <motion.div className="relative w-full h-48 overflow-hidden">
            <motion.img
              src={event.image}
              alt={event.imageAlt || event.title}
              className="absolute inset-0 w-full h-full object-cover"
              animate={{
                scale: isDragging ? 1.05 : 1,
              }}
              whileHover={{
                scale: isDragging ? 1.05 : 1.02,
              }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/0 to-transparent"
              animate={{
                opacity: isDragging ? 0.9 : 0.7,
              }}
            />
          </motion.div>
        )}

        {/* Main Content Area */}
        <div
          className={`p-4 pl-6 flex flex-col gap-2 ${
            event.isLifeEvent ? "pt-3" : ""
          }`}
          onClick={() => onOpenDetail?.(event)}
        >
          {/* Event Type Badge for Life Events */}
          {event.isLifeEvent && (
            <span className="text-xs font-medium text-amber-600 capitalize flex items-center gap-1">
              {event.type}
            </span>
          )}

          {/* Title */}
          <h3
            className={`font-semibold text-[var(--color-gray-900)] line-clamp-2
            ${event.isLifeEvent ? "text-lg" : ""}`}
          >
            {event.title}
          </h3>

          {/* Description */}
          {event.description && (
            <p className="text-sm text-[var(--color-gray-500)] line-clamp-2">
              {event.description}
            </p>
          )}

          {/* Image */}
          {event.image && (
            <div className="relative w-full h-32 mt-2 rounded-lg overflow-hidden">
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && !event.isLifeEvent && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(event);
                }}
                className="p-1.5 rounded-full hover:bg-[var(--color-gray-100)] text-[var(--color-gray-500)]"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(event.id);
                }}
                className={`p-1.5 rounded-full 
                  ${
                    event.isLifeEvent
                      ? "hover:bg-amber-100 text-amber-700"
                      : "hover:bg-[var(--color-gray-100)] text-[var(--color-gray-500)]"
                  }`}
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Drag Indicator */}
        <motion.div
          initial={false}
          animate={{
            opacity: isDragging ? 1 : 0,
            height: isDragging ? "2px" : "1px",
            width: isDragging ? "calc(100% - 2rem)" : "0%",
          }}
          transition={{ duration: 0.2 }}
          className="absolute inset-x-4 bottom-0 bg-[var(--color-primary)]
                   rounded-full origin-left"
          style={{
            boxShadow: "0 0 8px var(--color-primary)",
          }}
        />
      </div>
    </motion.div>
  );
}
