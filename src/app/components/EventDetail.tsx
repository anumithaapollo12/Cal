"use client";

import { motion } from "framer-motion";
import { format, isWeekend, parseISO, differenceInYears } from "date-fns";
import {
  XMarkIcon,
  CalendarIcon,
  BellIcon,
  ClockIcon,
  HeartIcon,
  CakeIcon,
  GiftIcon,
  StarIcon,
  SparklesIcon,
  ChatBubbleBottomCenterTextIcon,
  PencilSquareIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import type { LifeEvent } from "@/app/types";
import type { Event } from "@/app/types/Event";

interface EventDetailProps {
  event: Event | LifeEvent;
  onClose: () => void;
}

const isLifeEvent = (event: Event | LifeEvent): event is LifeEvent => {
  return "date" in event && "type" in event;
};

const convertToLifeEvent = (event: Event): LifeEvent => {
  return {
    id: event.id,
    title: event.title,
    date: event.startTime,
    type: "special",
    note: event.description,
    color: event.color,
    daysUntil: Math.ceil(
      (event.startTime.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    ),
  };
};

const getEventContext = (event: LifeEvent) => {
  const today = new Date();
  const eventDate = new Date(event.date);

  if (event.type === "birthday") {
    const age = differenceInYears(today, eventDate);
    const nextBirthday = new Date(eventDate);
    nextBirthday.setFullYear(today.getFullYear());
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    return {
      milestone: age % 5 === 0 ? `${age}th Birthday!` : undefined,
      suggestion:
        age >= 50
          ? "Consider making this extra special"
          : age >= 21
          ? "Perfect time for a meaningful gesture"
          : "A chance to create lasting memories",
    };
  }

  if (event.type === "anniversary") {
    const years = differenceInYears(today, eventDate);
    return {
      milestone: years % 5 === 0 ? `${years}th Anniversary!` : undefined,
      suggestion:
        years >= 25
          ? "A milestone worth celebrating in style"
          : years >= 10
          ? "Time to reflect on your journey together"
          : "Create new traditions",
    };
  }

  return {
    suggestion:
      event.type === "holiday"
        ? "A moment to pause and celebrate"
        : "Make it memorable",
  };
};

const getMoodEmoji = (type: LifeEvent["type"]) => {
  switch (type) {
    case "birthday":
      return "🎉";
    case "anniversary":
      return "💝";
    case "holiday":
      return "✨";
    case "special":
      return "🌟";
    default:
      return "📅";
  }
};

const renderIcon = (icon?: string) => {
  switch (icon) {
    case "cake":
      return <CakeIcon className="w-6 h-6" />;
    case "gift":
      return <GiftIcon className="w-6 h-6" />;
    case "heart":
      return <HeartIcon className="w-6 h-6" />;
    case "star":
      return <StarIcon className="w-6 h-6" />;
    default:
      return <CalendarIcon className="w-6 h-6" />;
  }
};

const getEventColor = (type: LifeEvent["type"]) => {
  switch (type) {
    case "birthday":
      return "bg-pink-100";
    case "anniversary":
      return "bg-purple-100";
    case "holiday":
      return "bg-blue-100";
    case "special":
      return "bg-amber-100";
    default:
      return "bg-gray-100";
  }
};

const formatEventDate = (date: Date | string | undefined) => {
  try {
    if (!date) {
      return "Date not set";
    }

    // If it's already a Date object, use it directly
    if (date instanceof Date) {
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return format(date, "EEEE, MMMM d, yyyy");
    }

    // If it's a string, try to parse it
    if (typeof date === "string") {
      // First try parsing as ISO string
      try {
        const parsedDate = parseISO(date);
        if (isNaN(parsedDate.getTime())) {
          throw new Error("Invalid ISO date");
        }
        return format(parsedDate, "EEEE, MMMM d, yyyy");
      } catch {
        // If that fails, try creating a new Date object
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
          throw new Error("Invalid date string");
        }
        return format(parsedDate, "EEEE, MMMM d, yyyy");
      }
    }

    return "Invalid date format";
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

const isWeekdayEvent = (date: Date | string | undefined) => {
  try {
    if (!date) {
      return false;
    }

    let eventDate: Date;

    if (date instanceof Date) {
      if (isNaN(date.getTime())) {
        return false;
      }
      eventDate = date;
    } else if (typeof date === "string") {
      try {
        eventDate = parseISO(date);
        if (isNaN(eventDate.getTime())) {
          throw new Error("Invalid ISO date");
        }
      } catch {
        eventDate = new Date(date);
        if (isNaN(eventDate.getTime())) {
          return false;
        }
      }
    } else {
      return false;
    }

    return !isWeekend(eventDate);
  } catch (error) {
    console.error("Error checking weekday:", error);
    return false;
  }
};

export default function EventDetail({ event, onClose }: EventDetailProps) {
  if (!event) return null;

  // Handle regular calendar events
  if (!("date" in event)) {
    return (
      <>
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999]"
          onClick={onClose}
        />
        <div className="fixed inset-0 flex items-center justify-center p-4 z-[99999]">
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`relative p-6 pb-4 ${event.color || "bg-gray-100"}`}
            >
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-700" />
              </button>
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-white/80 backdrop-blur-sm">
                  <CalendarIcon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {event.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-gray-700 flex items-center">
                      <ClockIcon className="w-5 h-5 mr-2" />
                      {format(event.startTime, "h:mm a")} -{" "}
                      {format(event.endTime, "h:mm a")}
                    </p>
                  </div>
                  {event.location && (
                    <p className="text-gray-700 flex items-center mt-1">
                      <MapPinIcon className="w-5 h-5 mr-2" />
                      {event.location}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 bg-white">
              <div className="space-y-6">
                {event.description && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <PencilSquareIcon className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          Description
                        </p>
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {event.type && (
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 capitalize">
                      {event.type}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Handle life events
  const eventColor = event.color || getEventColor(event.type);
  const formattedDate = formatEventDate(event.date);
  const isWeekday = isWeekdayEvent(event.date);
  const context = getEventContext(event);

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999]"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center p-4 z-[99999]">
        <div
          className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Rest of your life event JSX */}
          <div className={`relative p-6 pb-4 ${eventColor}`}>
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-gray-700" />
            </button>
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-white/80 backdrop-blur-sm">
                {renderIcon(event.icon)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {event.title}
                  </h2>
                  <span className="text-2xl" role="img" aria-label="mood">
                    {getMoodEmoji(event.type)}
                  </span>
                </div>
                <p className="text-gray-700 flex items-center mt-1">
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  {formattedDate}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white">
            <div className="space-y-6">
              {/* Context & Milestone */}
              {context.milestone && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 flex items-center gap-3">
                  <SparklesIcon className="w-6 h-6 text-purple-600" />
                  <p className="font-medium text-purple-900">
                    {context.milestone}
                  </p>
                </div>
              )}

              {/* Event Type & Annual Status */}
              <div className="flex items-center flex-wrap gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium capitalize
                  ${
                    event.type === "birthday"
                      ? "bg-pink-100 text-pink-800"
                      : event.type === "anniversary"
                      ? "bg-purple-100 text-purple-800"
                      : event.type === "holiday"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {event.type}
                </span>
                {event.repeatsAnnually && (
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                    Annual Event
                  </span>
                )}
                {isWeekday && (
                  <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium flex items-center gap-1">
                    <BellIcon className="w-4 h-4" />
                    Weekday
                  </span>
                )}
              </div>

              {/* Thoughtful Suggestion */}
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex gap-3">
                  <ChatBubbleBottomCenterTextIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Thoughtful Suggestion
                    </p>
                    <p className="text-sm text-blue-800 mt-1">
                      {context.suggestion}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes & Personal Touch */}
              <div className="space-y-3">
                {event.note ? (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <PencilSquareIcon className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          Your Notes
                        </p>
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {event.note}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button className="w-full p-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2">
                    <PencilSquareIcon className="w-5 h-5" />
                    <span>Add a personal note</span>
                  </button>
                )}
              </div>

              {/* Time Context */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <ClockIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Time Until
                      </p>
                      <p className="text-sm text-gray-600">
                        {event.daysUntil === 0
                          ? "Today is the day! 🎈"
                          : event.daysUntil === 1
                          ? "Tomorrow's the day! 🌟"
                          : typeof event.daysUntil === "number"
                          ? `${event.daysUntil} days to go ✨`
                          : "Date not set"}
                      </p>
                    </div>
                  </div>
                  {isWeekday && (
                    <div className="flex items-start space-x-3">
                      <BellIcon className="w-5 h-5 text-yellow-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Plan Ahead
                        </p>
                        <p className="text-sm text-gray-600">
                          Consider taking time off to fully enjoy this moment
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
