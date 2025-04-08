"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  format,
  isWeekend,
  addYears,
  differenceInDays,
  isFuture,
} from "date-fns";
import {
  CalendarIcon,
  LightBulbIcon,
  BellIcon,
  DocumentTextIcon,
  XMarkIcon,
  PlusIcon,
  SparklesIcon,
  HeartIcon,
  CakeIcon,
  GiftIcon,
  StarIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import EventDetail from "./EventDetail";

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLifeEvent?: (event: LifeEvent) => void;
  lifeEvents: LifeEvent[];
  onDeleteLifeEvent: (eventId: string) => void;
}

interface Note {
  id: string;
  content: string;
  color: string;
  createdAt: Date;
}

interface Goal {
  id: string;
  title: string;
  progress: number;
  dueDate?: Date;
  category: "personal" | "work" | "health" | "learning";
}

interface UpcomingEvent {
  id: string;
  title: string;
  date: Date;
  type: "birthday" | "anniversary" | "holiday";
  isWeekend: boolean;
  daysUntil: number;
}

interface LifeEvent {
  id: string;
  title: string;
  date: Date;
  type: "birthday" | "anniversary" | "holiday" | "special";
  note?: string;
  color?: string;
  icon?: "cake" | "gift" | "heart" | "star";
  repeatsAnnually?: boolean;
}

export default function SidePanel({
  isOpen,
  onClose,
  onAddLifeEvent,
  lifeEvents,
  onDeleteLifeEvent,
}: SidePanelProps) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "goals" | "notes">(
    "upcoming"
  );
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem("calendar-notes");
    return saved ? JSON.parse(saved) : [];
  });
  const [newNote, setNewNote] = useState("");
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem("calendar-goals");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "1",
            title: "Read 12 books this year",
            progress: 25,
            category: "learning",
          },
          {
            id: "2",
            title: "Exercise 3 times a week",
            progress: 66,
            category: "health",
          },
        ];
  });
  const [newGoal, setNewGoal] = useState("");
  const [newGoalCategory, setNewGoalCategory] =
    useState<Goal["category"]>("personal");
  const [showNewGoalForm, setShowNewGoalForm] = useState(false);

  const [showNewEventForm, setShowNewEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<LifeEvent>>({
    type: "birthday",
    repeatsAnnually: true,
    icon: "cake",
  });

  const [selectedEvent, setSelectedEvent] = useState<LifeEvent | null>(null);

  // Save notes to localStorage when they change
  useEffect(() => {
    localStorage.setItem("calendar-notes", JSON.stringify(notes));
  }, [notes]);

  // Save goals to localStorage when they change
  useEffect(() => {
    localStorage.setItem("calendar-goals", JSON.stringify(goals));
  }, [goals]);

  const addNote = () => {
    if (!newNote.trim()) return;

    const colors = [
      "bg-yellow-100 border-yellow-200",
      "bg-blue-100 border-blue-200",
      "bg-green-100 border-green-200",
      "bg-pink-100 border-pink-200",
    ];

    const newNoteObj: Note = {
      id: Math.random().toString(36).substr(2, 9),
      content: newNote,
      color: colors[Math.floor(Math.random() * colors.length)],
      createdAt: new Date(),
    };

    setNotes([newNoteObj, ...notes]);
    setNewNote("");
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const updateGoalProgress = (id: string, progress: number) => {
    setGoals(
      goals.map((goal) =>
        goal.id === id
          ? { ...goal, progress: Math.min(100, Math.max(0, progress)) }
          : goal
      )
    );
  };

  const addGoal = () => {
    if (!newGoal.trim()) return;

    const newGoalObj: Goal = {
      id: Math.random().toString(36).substr(2, 9),
      title: newGoal,
      progress: 0,
      category: newGoalCategory,
    };

    setGoals([...goals, newGoalObj]);
    setNewGoal("");
    setShowNewGoalForm(false);
  };

  const addLifeEvent = () => {
    if (!newEvent.title || !newEvent.date) return;

    const eventColors = {
      birthday: "bg-pink-100",
      anniversary: "bg-purple-100",
      holiday: "bg-blue-100",
      special: "bg-amber-100",
    };

    const newEventObj: LifeEvent = {
      id: Math.random().toString(36).substr(2, 9),
      title: newEvent.title,
      date: new Date(newEvent.date),
      type: newEvent.type || "special",
      note: newEvent.note,
      color: eventColors[newEvent.type || "special"],
      icon: newEvent.icon,
      repeatsAnnually: newEvent.repeatsAnnually,
    };

    onAddLifeEvent?.(newEventObj);
    setShowNewEventForm(false);
    setNewEvent({
      type: "birthday",
      repeatsAnnually: true,
      icon: "cake",
    });
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    const nextYear = new Date(
      today.getFullYear() + 1,
      today.getMonth(),
      today.getDate()
    );

    return lifeEvents
      .map((event) => {
        const eventDate = new Date(event.date);
        if (event.repeatsAnnually) {
          // Adjust the year to either this year or next year, whichever is closer
          eventDate.setFullYear(today.getFullYear());
          if (eventDate < today) {
            eventDate.setFullYear(today.getFullYear() + 1);
          }
        }
        return {
          ...event,
          date: eventDate,
          daysUntil: differenceInDays(eventDate, today),
        };
      })
      .filter((event) => event.daysUntil >= 0 && event.daysUntil <= 365)
      .sort((a, b) => a.daysUntil - b.daysUntil);
  };

  const renderIcon = (icon?: string) => {
    switch (icon) {
      case "cake":
        return <CakeIcon className="w-5 h-5" />;
      case "gift":
        return <GiftIcon className="w-5 h-5" />;
      case "heart":
        return <HeartIcon className="w-5 h-5" />;
      case "star":
        return <StarIcon className="w-5 h-5" />;
      default:
        return <CalendarIcon className="w-5 h-5" />;
    }
  };

  const renderLifeEventsTab = () => (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="space-y-6">
        {/* Life Snapshot Section */}
        <div className="bg-blue-50 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <HeartIcon className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Life Snapshot
            </h3>
          </div>
          <p className="text-gray-600 mb-4">
            {lifeEvents.length === 0
              ? "0 upcoming events to plan for. Take a moment to prepare and make them special!"
              : `${lifeEvents.length} upcoming events to look forward to!`}
          </p>
          <button
            onClick={() => setShowNewEventForm(true)}
            className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add Life Event</span>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button className="flex flex-col items-center justify-center p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
            <BellIcon className="w-6 h-6 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-blue-700">
              Set Reminders
            </span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
            <CalendarIcon className="w-6 h-6 text-green-600 mb-2" />
            <span className="text-sm font-medium text-green-700">
              Plan Free Time
            </span>
          </button>
        </div>

        {/* Upcoming Events List */}
        {lifeEvents.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-500">
              Upcoming Events
            </h3>
            {getUpcomingEvents().map((event) => (
              <div
                key={event.id}
                onClick={(e) => handleEventClick(event, e)}
                className={`p-4 rounded-lg ${
                  event.color || "bg-gray-50"
                } relative group cursor-pointer hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-full">
                      {renderIcon(event.icon)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {event.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {format(event.date, "MMMM d, yyyy")}
                        {event.daysUntil === 0
                          ? " (Today!)"
                          : event.daysUntil === 1
                          ? " (Tomorrow)"
                          : ` (in ${event.daysUntil} days)`}
                      </p>
                      {event.note && (
                        <p className="mt-1 text-sm text-gray-600">
                          {event.note}
                        </p>
                      )}
                      {!isWeekend(event.date) && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-100 rounded-lg">
                          <p className="text-sm text-yellow-800 flex items-center">
                            <BellIcon className="w-4 h-4 mr-1" />
                            <span>
                              Falls on a {format(event.date, "EEEE")} - Consider
                              planning time off
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteLifeEvent(event.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-red-100 text-red-500 transition-opacity"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Event Form Modal */}
      <AnimatePresence>
        {showNewEventForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[70] flex items-center justify-center"
            onClick={() => setShowNewEventForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-xl shadow-xl p-6 m-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Add Life Event
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newEvent.title || ""}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Mom's Birthday"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={
                      newEvent.date
                        ? format(new Date(newEvent.date), "yyyy-MM-dd")
                        : ""
                    }
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        date: new Date(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={newEvent.type}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        type: e.target.value as LifeEvent["type"],
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="birthday">Birthday</option>
                    <option value="anniversary">Anniversary</option>
                    <option value="holiday">Holiday</option>
                    <option value="special">Special Occasion</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon
                  </label>
                  <div className="flex space-x-4">
                    {["cake", "gift", "heart", "star"].map((icon) => (
                      <button
                        key={icon}
                        onClick={() =>
                          setNewEvent({
                            ...newEvent,
                            icon: icon as LifeEvent["icon"],
                          })
                        }
                        className={`p-2 rounded-lg ${
                          newEvent.icon === icon
                            ? "bg-blue-50 text-blue-600"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        {renderIcon(icon)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Note (optional)
                  </label>
                  <textarea
                    value={newEvent.note || ""}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, note: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a note or reminder"
                    rows={3}
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="repeatsAnnually"
                    checked={newEvent.repeatsAnnually}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        repeatsAnnually: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="repeatsAnnually"
                    className="ml-2 text-sm text-gray-600"
                  >
                    Repeats annually
                  </label>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowNewEventForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addLifeEvent}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                  >
                    Add Event
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const handleEventClick = (event: LifeEvent, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up
    setSelectedEvent(event);
  };

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
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[55]"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-[60] overflow-hidden"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Your Space
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="mt-6 flex space-x-4">
                  <button
                    onClick={() => setActiveTab("upcoming")}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === "upcoming"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <CalendarIcon className="w-5 h-5" />
                    <span>Life Events</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("goals")}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === "goals"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <SparklesIcon className="w-5 h-5" />
                    <span>Goals</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("notes")}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === "notes"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <DocumentTextIcon className="w-5 h-5" />
                    <span>Notes</span>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 pb-24">
                {activeTab === "notes" && (
                  <div className="space-y-6">
                    {/* Add new note */}
                    <div className="relative">
                      <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Write a note... What's on your mind?"
                        className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                 min-h-[100px] text-sm resize-none"
                      />
                      <button
                        onClick={addNote}
                        disabled={!newNote.trim()}
                        className="absolute bottom-4 right-4 p-2 rounded-lg bg-blue-600 text-white 
                                 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <PlusIcon className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Notes grid */}
                    <div className="grid grid-cols-1 gap-4">
                      {notes.map((note) => (
                        <motion.div
                          key={note.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`relative p-4 rounded-xl border ${note.color} transform rotate-[-0.5deg]`}
                        >
                          <p className="text-gray-800 whitespace-pre-wrap">
                            {note.content}
                          </p>
                          <span className="block mt-2 text-xs text-gray-500">
                            {format(new Date(note.createdAt), "MMM d, yyyy")}
                          </span>
                          <button
                            onClick={() => deleteNote(note.id)}
                            className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200/50"
                          >
                            <XMarkIcon className="w-4 h-4 text-gray-500" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "goals" && (
                  <div className="space-y-6">
                    {/* Add new goal button */}
                    {!showNewGoalForm ? (
                      <button
                        onClick={() => setShowNewGoalForm(true)}
                        className="w-full p-4 rounded-xl border-2 border-dashed border-gray-200 
                                 hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <PlusIcon className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-600">Add New Goal</span>
                      </button>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm space-y-4"
                      >
                        <input
                          type="text"
                          value={newGoal}
                          onChange={(e) => setNewGoal(e.target.value)}
                          placeholder="What's your goal?"
                          className="w-full p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="flex gap-2">
                          {(
                            ["personal", "work", "health", "learning"] as const
                          ).map((category) => (
                            <button
                              key={category}
                              onClick={() => setNewGoalCategory(category)}
                              className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                                ${
                                  newGoalCategory === category
                                    ? category === "personal"
                                      ? "bg-purple-100 text-purple-800"
                                      : category === "work"
                                      ? "bg-blue-100 text-blue-800"
                                      : category === "health"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setShowNewGoalForm(false)}
                            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={addGoal}
                            disabled={!newGoal.trim()}
                            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg
                                     hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Add Goal
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {goals.map((goal) => (
                      <motion.div
                        key={goal.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-medium text-gray-900">
                            {goal.title}
                          </h4>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full
                            ${
                              goal.category === "personal"
                                ? "bg-purple-100 text-purple-800"
                                : goal.category === "work"
                                ? "bg-blue-100 text-blue-800"
                                : goal.category === "health"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {goal.category}
                          </span>
                        </div>

                        <div className="relative pt-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="text-xs font-semibold inline-block text-blue-600">
                                {goal.progress}%
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="flex-1 mr-4">
                              <div className="h-2 bg-gray-200 rounded-full">
                                <motion.div
                                  className="h-2 bg-blue-600 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${goal.progress}%` }}
                                  transition={{ duration: 0.5 }}
                                />
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() =>
                                  updateGoalProgress(
                                    goal.id,
                                    goal.progress - 10
                                  )
                                }
                                className="p-1 rounded-lg hover:bg-gray-100"
                              >
                                -
                              </button>
                              <button
                                onClick={() =>
                                  updateGoalProgress(
                                    goal.id,
                                    goal.progress + 10
                                  )
                                }
                                className="p-1 rounded-lg hover:bg-gray-100"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === "upcoming" && renderLifeEventsTab()}
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* Event Detail Modal - Moved outside the panel AnimatePresence */}
      <AnimatePresence>
        {selectedEvent && (
          <EventDetail
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}
