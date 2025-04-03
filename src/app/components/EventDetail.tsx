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
          {/* Event Image */}
          {event.image && (
            <motion.div
              layoutId={`image-container-${event.id}`}
              className="relative w-full h-48 md:h-64 overflow-hidden"
            >
              <motion.img
                layoutId={`image-${event.id}`}
                src={event.image}
                alt={event.imageAlt || event.title}
                className="w-full h-full object-cover"
              />
              <motion.div
                layoutId={`image-overlay-${event.id}`}
                className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"
              />
              <motion.div
                className="absolute inset-x-0 bottom-0 p-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.h2
                  layoutId={`title-${event.id}`}
                  className="text-2xl font-semibold text-white mb-2"
                  transition={{ type: "spring", stiffness: 250, damping: 25 }}
                >
                  {event.title}
                </motion.h2>
                <motion.div
                  layoutId={`time-${event.id}`}
                  className="flex items-center gap-2 text-white/90"
                >
                  <CalendarIcon className="h-5 w-5 text-white/70" />
                  <span>
                    {format(new Date(event.startTime), "EEEE, MMMM d, yyyy")}
                  </span>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* Parallax Background - Only show when no image */}
          {!event.image && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* Enhanced Color Bar */}
          <motion.div
            layoutId={`color-${event.id}`}
            className="absolute left-0 top-0 w-1.5 h-full z-10"
            style={{ backgroundColor: event.color }}
            initial={{ height: "100%" }}
            animate={{ height: "120%", top: "-10%" }}
            transition={{ type: "spring", stiffness: 250, damping: 25 }}
          />

          <motion.div
            className={`relative p-6 ${event.image ? "pt-0" : ""}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {/* Header */}
            {!event.image && (
              <motion.div
                className="flex justify-between items-start mb-6"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.h2
                  layoutId={`title-${event.id}`}
                  className="text-2xl font-semibold text-gray-900"
                  transition={{ type: "spring", stiffness: 250, damping: 25 }}
                >
                  {event.title}
                </motion.h2>
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
              </motion.div>
            )}

            {/* Close button for image variant */}
            {event.image && (
              <motion.button
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="absolute top-4 right-4 text-white/90 hover:text-white 
                  rounded-full p-1.5 bg-black/20 backdrop-blur-sm"
              >
                <XMarkIcon className="h-6 w-6" />
              </motion.button>
            )}

            {/* Time Information */}
            {!event.image && (
              <motion.div
                className="space-y-3 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div
                  className="flex items-center gap-2 text-gray-600"
                  whileHover={{ x: 2 }}
                >
                  <CalendarIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <span className="font-medium">
                    {format(new Date(event.startTime), "EEEE, MMMM d, yyyy")}
                  </span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-2 text-gray-600"
                  whileHover={{ x: 2 }}
                >
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
                </motion.div>
              </motion.div>
            )}

            {/* Time (for image variant) */}
            {event.image && (
              <motion.div
                className="flex items-center gap-2 text-gray-600 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
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
              </motion.div>
            )}

            {/* Description */}
            {event.description && (
              <motion.div
                layoutId={`desc-${event.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <motion.h3
                  className="text-lg font-medium text-gray-900"
                  whileHover={{ x: 2 }}
                >
                  Description
                </motion.h3>
                <motion.div
                  className="bg-gray-50 rounded-lg p-4 transform-gpu"
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {event.description}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </motion.div>

          {/* Enhanced Bottom Color Indicator */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{ backgroundColor: event.color }}
            initial={{ opacity: 0.3, scaleX: 0.98 }}
            animate={{ opacity: 0.3, scaleX: 1 }}
            whileHover={{ opacity: 0.5, scaleX: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
