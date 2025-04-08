"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Event } from "../types/Event";
import { format, addHours, isBefore, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarIcon,
  ClockIcon,
  SwatchIcon,
  PhotoIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  ClipboardIcon,
  ChevronDownIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

interface EventFormProps {
  initialEvent?: Event;
  selectedDate?: Date;
  onSubmit: (event: Omit<Event, "id">) => void;
  onCancel: () => void;
}

const PRESET_COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#14B8A6", // Teal
  "#F97316", // Orange
];

const COMMON_TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney",
  "Pacific/Auckland",
];

type EventType = "Event" | "Task" | "Appointment";

export default function EventForm({
  initialEvent,
  selectedDate = new Date(),
  onSubmit,
  onCancel,
}: EventFormProps) {
  const [eventType, setEventType] = useState<EventType>("Event");
  const [title, setTitle] = useState(initialEvent?.title || "");
  const [description, setDescription] = useState(
    initialEvent?.description || ""
  );
  const [image, setImage] = useState(initialEvent?.image || "");
  const [imageAlt, setImageAlt] = useState(initialEvent?.imageAlt || "");
  const [isDragging, setIsDragging] = useState(false);

  // Split date and time into separate states
  const [startDate, setStartDate] = useState(
    format(initialEvent?.startTime || selectedDate, "yyyy-MM-dd")
  );
  const [startTime, setStartTime] = useState(
    format(initialEvent?.startTime || selectedDate, "HH:mm")
  );
  const [endDate, setEndDate] = useState(
    format(initialEvent?.endTime || addHours(selectedDate, 1), "yyyy-MM-dd")
  );
  const [endTime, setEndTime] = useState(
    format(initialEvent?.endTime || addHours(selectedDate, 1), "HH:mm")
  );

  const [color, setColor] = useState(initialEvent?.color || "#3B82F6");

  const [showTimezoneDropdown, setShowTimezoneDropdown] = useState(false);
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  // Create refs for the date and time inputs
  const dateInputRef = useRef<HTMLInputElement>(null);
  const startTimeInputRef = useRef<HTMLInputElement>(null);
  const endTimeInputRef = useRef<HTMLInputElement>(null);

  const [location, setLocation] = useState(initialEvent?.location || "");
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit({
        title,
        description,
        startTime: new Date(`${startDate}T${startTime}`),
        endTime: new Date(`${endDate}T${endTime}`),
        color,
        type: eventType.toLowerCase() as "event" | "task" | "appointment",
        image,
        imageAlt,
      });
    }
  };

  // Update end date and time when start changes
  useEffect(() => {
    const startDateTime = parseISO(`${startDate}T${startTime}`);
    const endDateTime = parseISO(`${endDate}T${endTime}`);

    if (isBefore(endDateTime, startDateTime)) {
      const newEndDate = addHours(startDateTime, 1);
      setEndDate(format(newEndDate, "yyyy-MM-dd"));
      setEndTime(format(newEndDate, "HH:mm"));
    }
  }, [startDate, startTime]);

  // Keep end date in sync with start date for same-day events
  useEffect(() => {
    setEndDate(startDate);
  }, [startDate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".timezone-dropdown")) {
        setShowTimezoneDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImage(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const handlePaste = useCallback((e: ClipboardEvent) => {
    e.preventDefault();
    const items = e.clipboardData?.items;

    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              setImage(event.target.result as string);
            }
          };
          reader.readAsDataURL(file);
          break;
        }
      }
    }
  }, []);

  // Add paste event listener
  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [handlePaste]);

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onSubmit={handleSubmit}
      className="space-y-4 sm:space-y-6 touch-none"
    >
      {/* Event Type Tabs - Mobile Optimized */}
      <div className="flex gap-1.5 sm:gap-2 -mx-1 px-1 py-1 overflow-x-auto hide-scrollbar">
        {(["Event", "Task", "Appointment"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setEventType(type)}
            className={`flex-none px-4 py-2.5 rounded-xl text-sm font-medium transition-colors
              ${
                eventType === type
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 bg-gray-50"
              }
              ${type === "Appointment" ? "flex items-center gap-2" : ""}`}
          >
            {type}
            {type === "Appointment" && (
              <span className="px-1.5 py-0.5 text-xs bg-blue-600 text-white rounded-md">
                New
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Title Input - Mobile Optimized */}
      <div className="space-y-1.5">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full px-4 py-3 text-base sm:text-lg border-0 bg-gray-50 rounded-xl
            text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500"
          placeholder="Event title"
          required
        />
      </div>

      {/* Date and Time Selection - Mobile Optimized */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-gray-50 px-4 py-3 rounded-xl text-gray-900 font-medium
                focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 sm:w-56 gap-2">
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-gray-50 px-4 py-3 rounded-xl text-gray-900 font-medium
                focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full bg-gray-50 px-4 py-3 rounded-xl text-gray-900 font-medium
                focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Color Selection - Mobile Optimized */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Event Color
        </label>
        <div className="flex items-center gap-4 flex-wrap">
          {PRESET_COLORS.map((presetColor) => (
            <motion.button
              key={presetColor}
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={() => setColor(presetColor)}
              className={`w-10 h-10 rounded-xl transition-all duration-200
                ${
                  color === presetColor
                    ? "ring-2 ring-offset-2 ring-blue-500"
                    : ""
                }
                active:scale-95 touch-none`}
              style={{ backgroundColor: presetColor }}
              aria-label={`Select color ${presetColor}`}
            />
          ))}
          <motion.div whileTap={{ scale: 0.92 }} className="relative">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="sr-only"
              id="custom-color"
            />
            <label
              htmlFor="custom-color"
              className="w-10 h-10 rounded-xl border-2 border-dashed border-gray-300 
                flex items-center justify-center cursor-pointer active:scale-95
                transition-colors touch-none"
            >
              <SwatchIcon className="h-5 w-5 text-gray-400" />
            </label>
          </motion.div>
        </div>
      </div>

      {/* Description Input - Mobile Optimized */}
      <div className="space-y-1.5">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add description"
          rows={3}
          className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-900
            placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 border-0
            resize-none"
        />
      </div>

      {/* Location Input - Mobile Optimized */}
      <div className="space-y-1.5">
        <div className="relative">
          <MapPinIcon className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Add location"
            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl text-gray-900
              placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 border-0"
          />
        </div>
      </div>

      {/* Image Upload - Mobile Optimized */}
      <div className="space-y-3">
        {image ? (
          <div className="relative rounded-xl overflow-hidden">
            <img src={image} alt="Event" className="w-full h-48 object-cover" />
            <button
              type="button"
              onClick={() => setImage("")}
              className="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-white
                hover:bg-black/60 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
              <input
                type="text"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-sm border-0 rounded-lg px-3 py-2
                  text-white placeholder:text-white/70 focus:ring-2 focus:ring-white/50"
                placeholder="Add image description for accessibility"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8
                transition-colors text-center
                ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-2">
                <div className="flex flex-col items-center gap-1">
                  <ArrowUpTrayIcon className="w-8 h-8 text-gray-400" />
                  <ClipboardIcon className="w-6 h-6 text-gray-400" />
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-blue-600">
                    Tap to upload
                  </span>
                  {!isMobile && " or drag and drop"}
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG up to 10MB
                  {!isMobile && (
                    <>
                      <br />
                      <span className="text-blue-600">
                        {navigator?.platform?.toLowerCase().includes("mac")
                          ? "⌘+V"
                          : "Ctrl+V"}{" "}
                        to paste
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons - Mobile Optimized */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 sm:relative sm:bg-transparent sm:border-0 sm:p-0 sm:flex sm:justify-end sm:gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto mb-3 sm:mb-0 px-6 py-3 sm:py-2.5 text-sm font-medium 
            text-gray-700 bg-gray-100 rounded-xl sm:rounded-lg hover:bg-gray-200 
            transition-colors touch-none"
        >
          Cancel
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full sm:w-auto px-6 py-3 sm:py-2.5 text-sm font-medium text-white 
            bg-blue-600 rounded-xl sm:rounded-lg shadow-sm hover:bg-blue-700 
            transition-colors touch-none"
        >
          {initialEvent ? "Update Event" : "Create Event"}
        </motion.button>
      </div>
    </motion.form>
  );
}
