"use client";

import { useState, useEffect } from "react";
import { Event } from "../types/Event";
import { format, addHours, isBefore, parseISO } from "date-fns";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  ClockIcon,
  SwatchIcon,
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

export default function EventForm({
  initialEvent,
  selectedDate = new Date(),
  onSubmit,
  onCancel,
}: EventFormProps) {
  const [title, setTitle] = useState(initialEvent?.title || "");
  const [description, setDescription] = useState(
    initialEvent?.description || ""
  );

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit({
        title,
        description,
        startTime: new Date(`${startDate}T${startTime}`),
        endTime: new Date(`${endDate}T${endTime}`),
        color,
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

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {/* Title Input */}
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full border-0 border-b-2 border-gray-200 
            focus:border-indigo-500 focus:ring-0 text-lg font-medium
            placeholder:text-gray-400 transition-colors pb-2"
          placeholder="Event title"
          required
        />
      </div>

      {/* Description Input */}
      <div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="block w-full border border-gray-200 rounded-lg px-4 py-3
            focus:border-indigo-500 focus:ring-0 text-gray-600
            placeholder:text-gray-400 resize-none transition-colors"
          placeholder="Add description (optional)"
        />
      </div>

      {/* Date and Time Grid */}
      <div className="space-y-6">
        {/* Start Date/Time */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Start
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="block w-full rounded-lg border border-gray-200 pl-12 pr-4 py-3
                  focus:border-indigo-500 focus:ring-0 transition-colors"
                required
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                <ClockIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="block w-full rounded-lg border border-gray-200 pl-12 pr-4 py-3
                  focus:border-indigo-500 focus:ring-0 transition-colors"
                required
              />
            </div>
          </div>
        </div>

        {/* End Date/Time */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">End</label>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="block w-full rounded-lg border border-gray-200 pl-12 pr-4 py-3
                  focus:border-indigo-500 focus:ring-0 transition-colors"
                required
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                <ClockIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="block w-full rounded-lg border border-gray-200 pl-12 pr-4 py-3
                  focus:border-indigo-500 focus:ring-0 transition-colors"
                required
              />
            </div>
          </div>
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
                    ? "ring-2 ring-offset-2 ring-indigo-500"
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
            bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 
            focus:outline-none focus:ring-2 focus:ring-indigo-500 
            focus:ring-offset-2 transition-colors"
        >
          {initialEvent ? "Update Event" : "Create Event"}
        </motion.button>
      </div>
    </motion.form>
  );
}
