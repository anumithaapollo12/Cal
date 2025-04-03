"use client";

import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Event } from "../types/Event";

interface EventDetailProps {
  event: Event | null;
  onClose: () => void;
}

export default function EventDetail({ event, onClose }: EventDetailProps) {
  if (!event) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm z-50"
        onClick={onClose}
      >
        <motion.div
          layoutId={`event-${event.id}`}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-lg shadow-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            layoutId={`color-${event.id}`}
            className="absolute left-0 top-0 w-2 h-full"
            style={{ backgroundColor: event.color }}
          />

          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <motion.h2
                layoutId={`title-${event.id}`}
                className="text-2xl font-semibold text-gray-900"
              >
                {event.title}
              </motion.h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <motion.div
              layoutId={`time-${event.id}`}
              className="mb-4 text-gray-600"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">Time:</span>
                <span>
                  {format(new Date(event.startTime), "EEEE, MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">From:</span>
                <span>{format(new Date(event.startTime), "h:mm a")}</span>
                <span className="font-medium ml-4">To:</span>
                <span>{format(new Date(event.endTime), "h:mm a")}</span>
              </div>
            </motion.div>

            {event.description && (
              <motion.div
                layoutId={`desc-${event.id}`}
                className="prose prose-sm max-w-none text-gray-600"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Description
                </h3>
                <p>{event.description}</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
