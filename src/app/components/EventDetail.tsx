"use client";

import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  ClockIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { Event } from "../types/Event";

interface EventDetailProps {
  event: Event | null;
  onClose: () => void;
  cardPosition?: { top: number; left: number; width: number; height: number };
}

export default function EventDetail({
  event,
  onClose,
  cardPosition,
}: EventDetailProps) {
  if (!event) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50"
        onClick={onClose}
      >
        <motion.div
          initial={
            cardPosition
              ? {
                  position: "fixed",
                  top: cardPosition.top,
                  left: cardPosition.left,
                  width: cardPosition.width,
                  height: cardPosition.height,
                  scale: 1,
                  transformOrigin: "center",
                  borderRadius: "0.5rem",
                }
              : {
                  opacity: 0,
                  scale: 0.95,
                  y: 20,
                  transformOrigin: "center",
                }
          }
          animate={{
            position: "fixed",
            top: "50%",
            left: "50%",
            width: "100%",
            maxWidth: "32rem",
            height: "auto",
            x: "-50%",
            y: "-50%",
            scale: 1,
            opacity: 1,
            transformOrigin: "center",
            borderRadius: "0.5rem",
          }}
          exit={
            cardPosition
              ? {
                  position: "fixed",
                  top: cardPosition.top,
                  left: cardPosition.left,
                  width: cardPosition.width,
                  height: cardPosition.height,
                  scale: 1,
                  opacity: 0,
                  transformOrigin: "center",
                  borderRadius: "0.5rem",
                }
              : {
                  opacity: 0,
                  scale: 0.95,
                  y: 20,
                }
          }
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 250,
            mass: 0.5,
          }}
          className="bg-white rounded-lg shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Color Bar */}
          <div
            className="absolute left-0 top-0 w-1.5 h-full"
            style={{ backgroundColor: event.color }}
          />

          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                {event.title}
              </h2>
              <motion.button
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "rgb(243, 244, 246)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 rounded-full p-1 -mr-1"
              >
                <XMarkIcon className="h-6 w-6" />
              </motion.button>
            </div>

            {/* Time Information */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-gray-600">
                <CalendarIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <span className="font-medium">
                  {format(new Date(event.startTime), "EEEE, MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <ClockIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <div>
                  <span className="font-medium">
                    {format(new Date(event.startTime), "h:mm a")}
                  </span>
                  <span className="mx-2">-</span>
                  <span className="font-medium">
                    {format(new Date(event.endTime), "h:mm a")}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <h3 className="text-lg font-medium text-gray-900">
                  Description
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Bottom Color Indicator */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1 opacity-30"
            style={{ backgroundColor: event.color }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
