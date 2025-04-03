"use client";

import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  ClockIcon,
  CalendarIcon,
  MapPinIcon,
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
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
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
                  borderRadius: "1rem",
                }
              : {
                  opacity: 0,
                  scale: 0.95,
                  y: 20,
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
            borderRadius: "1rem",
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
                  borderRadius: "1rem",
                }
              : {
                  opacity: 0,
                  scale: 0.95,
                  y: 20,
                }
          }
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 300,
          }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Event Image */}
          {event.image && (
            <motion.div
              layoutId={`image-container-${event.id}`}
              className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100"
            >
              <motion.img
                layoutId={`image-${event.id}`}
                src={event.image}
                alt={event.imageAlt || event.title}
                className="w-full h-full object-cover"
              />
              <motion.div
                layoutId={`image-overlay-${event.id}`}
                className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
              />
              <motion.button
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="absolute top-4 left-4 p-2 rounded-full bg-black/30 text-white/90
                  backdrop-blur-sm transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </motion.button>
            </motion.div>
          )}

          <motion.div
            className="relative p-6"
            style={{
              borderLeft: `4px solid ${event.color}`,
            }}
          >
            {/* Close button when no image */}
            {!event.image && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full text-gray-400
                  hover:text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </motion.button>
            )}

            {/* Title */}
            <motion.div className="mb-6">
              <motion.h2
                layoutId={`title-${event.id}`}
                className="text-2xl font-semibold text-gray-900 mb-2"
              >
                {event.title}
              </motion.h2>
            </motion.div>

            {/* Time and Date Information */}
            <motion.div className="space-y-4 mb-8">
              <motion.div
                layoutId={`time-${event.id}`}
                className="flex items-center gap-3 text-gray-600"
              >
                <ClockIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {format(new Date(event.startTime), "h:mm a")}
                  </span>
                  <span className="text-gray-400">→</span>
                  <span className="font-medium">
                    {format(new Date(event.endTime), "h:mm a")}
                  </span>
                </div>
              </motion.div>

              <motion.div className="flex items-center gap-3 text-gray-600">
                <CalendarIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <span className="font-medium">
                  {format(new Date(event.startTime), "EEEE, MMMM d, yyyy")}
                </span>
              </motion.div>

              {event.location && (
                <motion.div className="flex items-center gap-3 text-gray-600">
                  <MapPinIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <span className="font-medium">{event.location}</span>
                </motion.div>
              )}
            </motion.div>

            {/* Description */}
            {event.description && (
              <motion.div layoutId={`desc-${event.id}`} className="space-y-3">
                <motion.h3 className="text-lg font-medium text-gray-900">
                  About this event
                </motion.h3>
                <motion.div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                    {event.description}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
