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
} from "@heroicons/react/24/outline";

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
      className="space-y-6"
    >
      <h1 className="text-2xl font-semibold text-gray-900">
        Add title and time
      </h1>

      {/* Event Type Tabs */}
      <div className="flex gap-2">
        {(["Event", "Task", "Appointment"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setEventType(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${
                eventType === type
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }
              ${type === "Appointment" ? "flex items-center gap-2" : ""}`}
          >
            {type}
            {type === "Appointment" && (
              <span className="px-1.5 py-0.5 text-xs bg-blue-600 text-white rounded">
                New
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Title Input */}
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full border-0 text-lg text-gray-500
            focus:ring-0 placeholder:text-gray-400"
          placeholder="Event title"
          required
        />
      </div>

      {/* Date and Time Selection */}
      <div className="flex gap-2">
        <div className="flex-1">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-gray-100 px-4 py-2 rounded-lg text-gray-900 font-medium
              hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>
        <div className="w-28">
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full bg-gray-100 px-4 py-2 rounded-lg text-gray-900 font-medium
              hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>
        <span className="flex items-center text-gray-500">-</span>
        <div className="w-28">
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full bg-gray-100 px-4 py-2 rounded-lg text-gray-900 font-medium
              hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Color Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Event Color
        </label>
        <div className="flex items-center gap-3">
          {PRESET_COLORS.map((presetColor) => (
            <motion.button
              key={presetColor}
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setColor(presetColor)}
              className={`w-8 h-8 rounded-full transition-all duration-200
                ${
                  color === presetColor
                    ? "ring-2 ring-offset-2 ring-blue-500"
                    : ""
                }
                hover:shadow-lg focus:outline-none`}
              style={{ backgroundColor: presetColor }}
              aria-label={`Select color ${presetColor}`}
            />
          ))}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="sr-only"
              id="custom-color"
            />
            <label
              htmlFor="custom-color"
              className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 
                flex items-center justify-center cursor-pointer hover:border-gray-400
                transition-colors hover:shadow-lg"
            >
              <SwatchIcon className="h-4 w-4 text-gray-400" />
            </label>
          </motion.div>
        </div>
      </div>

      {/* Description Input */}
      <div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="block w-full border border-gray-200 rounded-lg px-4 py-3
            focus:border-blue-500 focus:ring-0 text-gray-600
            placeholder:text-gray-400 resize-none transition-colors"
          placeholder="Add description (optional)"
        />
      </div>

      {/* Image Input */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Event Image
        </label>
        <div className="relative">
          {image ? (
            <div className="relative rounded-lg overflow-hidden">
              <motion.img
                src={image}
                alt={imageAlt || title}
                className="w-full h-48 object-cover"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              />
              <motion.button
                type="button"
                onClick={() => setImage("")}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/20 text-white/90 
                  hover:bg-black/30 hover:text-white backdrop-blur-sm transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <XMarkIcon className="w-5 h-5" />
              </motion.button>
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  className="w-full bg-transparent border-0 text-white placeholder:text-white/70
                    focus:ring-0 text-sm"
                  placeholder="Add image description for accessibility"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Drag & Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-lg p-8
                  transition-colors text-center cursor-pointer
                  ${
                    isDragging
                      ? "border-indigo-500 bg-indigo-50"
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
                    <span className="font-medium text-indigo-600">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG up to 10MB
                    <br />
                    <span className="text-indigo-600">
                      {navigator?.platform?.toLowerCase().includes("mac")
                        ? "⌘+V"
                        : "Ctrl+V"}{" "}
                      to paste
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end pt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 text-sm font-medium text-gray-700 
            hover:text-gray-900 focus:outline-none transition-colors"
        >
          Cancel
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="px-6 py-2.5 text-sm font-medium text-white 
            bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 
            focus:outline-none focus:ring-2 focus:ring-blue-500 
            focus:ring-offset-2 transition-colors"
        >
          {initialEvent ? "Update Event" : "Create Event"}
        </motion.button>
      </div>
    </motion.form>
  );
}
