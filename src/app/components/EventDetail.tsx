"use client";

import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  ClockIcon,
  CalendarIcon,
  MapPinIcon,
  PencilIcon,
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
  if (!event || !cardPosition) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
      style={{
        backdropFilter: "blur(8px)",
        backgroundColor: "rgba(251, 251, 250, 0.8)",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{
          opacity: 0,
          top: cardPosition.top,
          left: cardPosition.left,
          width: cardPosition.width,
          height: cardPosition.height,
          position: "fixed",
          scale: 1,
        }}
        animate={{
          opacity: 1,
          top: "50%",
          left: "50%",
          width: "min(95vw, 720px)",
          height: "auto",
          y: "-50%",
          x: "-50%",
          scale: 1,
        }}
        exit={{
          opacity: 0,
          top: cardPosition.top,
          left: cardPosition.left,
          width: cardPosition.width,
          height: cardPosition.height,
          y: 0,
          x: 0,
          scale: 0.97,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 350,
        }}
        className="bg-white rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_2px_8px_rgba(0,0,0,0.08)] 
                 overflow-hidden transform-gpu"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Event Image */}
        {event.image && (
          <motion.div
            initial={{ height: "12rem" }}
            animate={{ height: "18rem" }}
            exit={{ height: "12rem" }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="relative w-full overflow-hidden bg-[#f1f1f0]"
          >
            <motion.img
              initial={{ scale: 1 }}
              animate={{ scale: 1.02 }}
              exit={{ scale: 1 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              src={event.image}
              alt={event.imageAlt || event.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ delay: 0.1 }}
              whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(55, 53, 47, 0.16)",
              }}
              onClick={onClose}
              className="absolute top-5 left-5 p-1.5 rounded-md bg-[rgba(55,53,47,0.08)]
                       text-[rgb(55,53,47)] transition-all duration-150"
            >
              <XMarkIcon className="h-5 w-5" />
            </motion.button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.1 }}
          className="relative px-10 py-8 space-y-6"
        >
          {/* Title */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <h2 className="text-[1.875rem] font-medium text-[rgb(55,53,47)] tracking-[-0.02em]">
                {event.title}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-[rgb(55,53,47,0.65)]">
              <CalendarIcon className="h-4 w-4" />
              <span className="text-sm">
                {format(new Date(event.startTime), "EEEE, MMMM d")}
              </span>
              <span className="text-sm mx-1">•</span>
              <ClockIcon className="h-4 w-4" />
              <span className="text-sm">
                {format(new Date(event.startTime), "h:mm a")} -{" "}
                {format(new Date(event.endTime), "h:mm a")}
              </span>
              {event.location && (
                <>
                  <span className="text-sm mx-1">•</span>
                  <MapPinIcon className="h-4 w-4" />
                  <span className="text-sm">{event.location}</span>
                </>
              )}
            </div>
          </motion.div>

          {/* Description */}
          {event.description && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.2 }}
              className="pt-2"
            >
              <div className="prose prose-sm max-w-none">
                <p className="text-[rgb(55,53,47)] whitespace-pre-wrap leading-relaxed">
                  {event.description}
                </p>
              </div>
            </motion.div>
          )}

          {/* Color Tag */}
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "2rem" }}
            exit={{ opacity: 0, width: 0 }}
            className="absolute bottom-8 right-10 h-1.5 rounded-full"
            style={{ backgroundColor: event.color || "rgb(55, 53, 47)" }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
