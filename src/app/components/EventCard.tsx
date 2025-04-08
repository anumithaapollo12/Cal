import { format } from "date-fns";
import { motion } from "framer-motion";
import { Event } from "../types/Event";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
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
  return (
    <motion.div
      className={`group relative card-premium overflow-hidden touch-none select-none
        ${isDragging || isDragEnabled ? "z-50" : ""}
        ${
          isDragging || isDragEnabled
            ? "cursor-grabbing shadow-2xl"
            : "cursor-pointer hover:shadow-lg"
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
        {/* Time Badge */}
        <motion.div
          className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-[var(--color-gray-100)] 
             text-xs font-medium text-[var(--color-gray-500)] tracking-wide
             group-hover:bg-[var(--color-gray-200)] transition-all duration-300"
          animate={{
            scale: isDragging ? 1.05 : 1,
          }}
        >
          {format(new Date(event.startTime), "h:mm a")}
        </motion.div>

        {/* Color Tag */}
        <motion.div
          className="absolute top-0 left-0 w-1 h-full"
          style={{ backgroundColor: event.color || "var(--color-primary)" }}
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

        <motion.div
          className="p-5"
          animate={{
            scale: isDragging ? 1.02 : 1,
          }}
        >
          <div className="flex flex-col gap-3">
            <div className="space-y-1.5">
              <motion.h2
                className="text-base font-semibold text-[var(--color-gray-900)] 
                         group-hover:text-[var(--color-primary)] transition-colors duration-300"
                animate={{
                  scale: isDragging ? 1.02 : 1,
                }}
              >
                {event.title}
              </motion.h2>
              {event.description && (
                <motion.div
                  className="text-sm text-[var(--color-gray-500)] line-clamp-2
                          group-hover:text-[var(--color-gray-900)] transition-colors duration-300"
                  animate={{
                    opacity: isDragging ? 0.9 : 1,
                  }}
                >
                  {event.description}
                </motion.div>
              )}
            </div>

            {/* Action Buttons */}
            {onEdit && onDelete && (
              <motion.div
                className="flex items-center gap-2 pt-1 opacity-0 translate-y-1
                          group-hover:opacity-100 group-hover:translate-y-0 
                          transition-all duration-300 ease-out"
                initial={{ opacity: 0, y: 8 }}
                animate={{
                  opacity: isDragging ? 0 : 1,
                  y: isDragging ? 8 : 0,
                }}
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
                    onEdit?.(event);
                  }}
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
                    onDelete?.(event.id);
                  }}
                >
                  <TrashIcon className="w-4 h-4 text-red-500" />
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>

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
