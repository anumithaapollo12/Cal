"use client";

import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  ClockIcon,
  CalendarIcon,
  MapPinIcon,
  PencilIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { Event } from "../types/Event";

interface EventDetailProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EventDetail({
  event,
  isOpen,
  onClose,
}: EventDetailProps) {
  if (!isOpen || !event) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
              w-full max-w-lg bg-white rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header with color strip */}
            <div
              className="h-2 w-full"
              style={{ backgroundColor: event.color }}
            />

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 rounded-full
                  hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-500" />
              </button>

              {/* Title and Type */}
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {event.title}
                </h2>
                <span
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  bg-blue-100 text-blue-800"
                >
                  {event.type
                    ? event.type.charAt(0).toUpperCase() + event.type.slice(1)
                    : "Event"}
                </span>
              </div>

              {/* Date and Time */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <CalendarIcon className="w-5 h-5" />
                  <span>{format(event.startTime, "EEEE, MMMM d, yyyy")}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <ClockIcon className="w-5 h-5" />
                  <span>
                    {format(event.startTime, "h:mm a")} -{" "}
                    {format(event.endTime, "h:mm a")}
                  </span>
                </div>
              </div>

              {/* Description */}
              {event.description && (
                <div className="text-gray-600">
                  <p>{event.description}</p>
                </div>
              )}

              {/* Image */}
              {event.image && (
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.imageAlt || event.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
