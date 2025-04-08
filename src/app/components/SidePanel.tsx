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
    return saved ? JSON.parse(saved) : [];
  });
  const [showNewGoalForm, setShowNewGoalForm] = useState(false);
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    title: "",
    progress: 0,
    category: "personal",
  });
  const [showNewEventForm, setShowNewEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<LifeEvent>>({
    type: "birthday",
    repeatsAnnually: true,
    icon: "cake",
  });
  const [selectedEvent, setSelectedEvent] = useState<LifeEvent | null>(null);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

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

  const deleteGoal = (id: string) => {
    setGoals(goals.filter((goal) => goal.id !== id));
  };

  const addGoal = () => {
    if (newGoal.title?.trim()) {
      const goal: Goal = {
        id: Math.random().toString(36).substr(2, 9),
        title: newGoal.title.trim(),
        progress: 0,
        category: newGoal.category || "personal",
        ...(newGoal.dueDate && { dueDate: new Date(newGoal.dueDate) }),
      };
      setGoals([...goals, goal]);
      setNewGoal({
        title: "",
        progress: 0,
        category: "personal",
      });
      setShowNewGoalForm(false);
    }
  };

  const updateGoalProgress = (id: string, progress: number) => {
    setGoals(
      goals.map((goal) => (goal.id === id ? { ...goal, progress } : goal))
    );
  };

  const addLifeEvent = () => {
    if (!newEvent.title?.trim() || !newEvent.date) {
      return;
    }

    const eventColors = {
      birthday: "bg-pink-100",
      anniversary: "bg-purple-100",
      holiday: "bg-blue-100",
      special: "bg-amber-100",
    };

    const newEventObj: LifeEvent = {
      id: Math.random().toString(36).substr(2, 9),
      title: newEvent.title.trim(),
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
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={isMobile ? { y: "100%" } : { x: "100%" }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: "100%" } : { x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`fixed ${
              isMobile
                ? "inset-x-0 bottom-0 rounded-t-3xl max-h-[90vh]"
                : "right-0 top-0 bottom-0 w-96"
            } bg-white shadow-2xl z-[61] flex flex-col touch-none`}
          >
            {/* Header */}
            <div className="flex-none p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Life Events
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 -m-2 text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Pull Indicator */}
              {isMobile && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-300 rounded-full" />
              )}

              {/* Tabs */}
              <div className="mt-6 flex gap-2 overflow-x-auto hide-scrollbar -mx-1 px-1">
                <button
                  onClick={() => setActiveTab("upcoming")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl flex-none transition-colors ${
                    activeTab === "upcoming"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <CalendarIcon className="w-5 h-5" />
                  <span className="text-sm font-medium whitespace-nowrap">
                    Life Events
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("goals")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl flex-none transition-colors ${
                    activeTab === "goals"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <SparklesIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">Goals</span>
                </button>
                <button
                  onClick={() => setActiveTab("notes")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl flex-none transition-colors ${
                    activeTab === "notes"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <DocumentTextIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">Notes</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {activeTab === "upcoming" && renderLifeEventsTab()}
              {activeTab === "goals" && (
                <div className="p-4 sm:p-6 space-y-4">
                  {!showNewGoalForm ? (
                    <button
                      onClick={() => setShowNewGoalForm(true)}
                      className="w-full p-4 rounded-xl border-2 border-dashed border-gray-200 
                        hover:border-blue-500 hover:bg-blue-50 transition-colors touch-none
                        flex items-center justify-center gap-2"
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
                        value={newGoal.title}
                        onChange={(e) =>
                          setNewGoal({ ...newGoal, title: e.target.value })
                        }
                        placeholder="What's your goal?"
                        className="w-full p-3 rounded-xl border-0 bg-gray-50
                          focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <select
                          value={newGoal.category}
                          onChange={(e) =>
                            setNewGoal({
                              ...newGoal,
                              category: e.target.value as Goal["category"],
                            })
                          }
                          className="p-3 rounded-xl border-0 bg-gray-50 text-gray-900"
                        >
                          <option value="personal">Personal</option>
                          <option value="work">Work</option>
                          <option value="health">Health</option>
                          <option value="learning">Learning</option>
                        </select>
                        <input
                          type="date"
                          value={
                            newGoal.dueDate
                              ? format(new Date(newGoal.dueDate), "yyyy-MM-dd")
                              : ""
                          }
                          onChange={(e) =>
                            setNewGoal({
                              ...newGoal,
                              dueDate: e.target.value
                                ? new Date(e.target.value)
                                : undefined,
                            })
                          }
                          className="p-3 rounded-xl border-0 bg-gray-50 text-gray-900"
                          placeholder="Due Date (Optional)"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setShowNewGoalForm(false)}
                          className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100
                            rounded-lg transition-colors touch-none"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={addGoal}
                          disabled={!newGoal.title?.trim()}
                          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg
                            hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                            transition-colors touch-none"
                        >
                          Add Goal
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Goals List */}
                  <div className="space-y-3">
                    {goals.map((goal) => (
                      <motion.div
                        key={goal.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group p-4 bg-white rounded-xl border border-gray-100
                          hover:border-gray-200 transition-colors"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">
                                {goal.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                  ${
                                    goal.category === "personal"
                                      ? "bg-blue-100 text-blue-800"
                                      : goal.category === "work"
                                      ? "bg-purple-100 text-purple-800"
                                      : goal.category === "health"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-amber-100 text-amber-800"
                                  }`}
                                >
                                  {goal.category}
                                </span>
                                {goal.dueDate && (
                                  <span className="text-sm text-gray-500">
                                    Due{" "}
                                    {format(
                                      new Date(goal.dueDate),
                                      "MMM d, yyyy"
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => deleteGoal(goal.id)}
                              className="p-2 -m-2 text-gray-400 hover:text-red-500
                                transition-colors touch-none sm:opacity-0 sm:group-hover:opacity-100"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <span>Progress</span>
                              <span>{goal.progress}%</span>
                            </div>
                            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`absolute inset-y-0 left-0 transition-all duration-300
                                  ${
                                    goal.category === "personal"
                                      ? "bg-blue-500"
                                      : goal.category === "work"
                                      ? "bg-purple-500"
                                      : goal.category === "health"
                                      ? "bg-green-500"
                                      : "bg-amber-500"
                                  }`}
                                style={{ width: `${goal.progress}%` }}
                              />
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={goal.progress}
                              onChange={(e) =>
                                updateGoalProgress(
                                  goal.id,
                                  parseInt(e.target.value)
                                )
                              }
                              className="w-full h-2 appearance-none bg-transparent cursor-pointer"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes Tab */}
              {activeTab === "notes" && (
                <div className="p-4 sm:p-6 space-y-4">
                  <div className="relative">
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Write a note..."
                      className="w-full p-4 rounded-xl border-0 bg-gray-50
                        focus:ring-2 focus:ring-blue-500 text-gray-900
                        resize-none min-h-[120px] touch-none"
                    />
                    <button
                      onClick={addNote}
                      disabled={!newNote.trim()}
                      className="absolute bottom-4 right-4 p-2 rounded-lg bg-blue-600 text-white
                        hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                        transition-colors touch-none"
                    >
                      <PlusIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {notes.map((note) => (
                      <motion.div
                        key={note.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group p-4 bg-white rounded-xl border border-gray-100
                          hover:border-gray-200 transition-colors touch-none"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <p className="text-gray-900 whitespace-pre-wrap select-none">
                              {note.content}
                            </p>
                            <span className="block mt-2 text-xs text-gray-500 select-none">
                              {format(new Date(note.createdAt), "MMM d, yyyy")}
                            </span>
                          </div>
                          <button
                            onClick={() => deleteNote(note.id)}
                            className="p-2 -m-2 text-gray-400 hover:text-red-500
                              transition-colors touch-none sm:opacity-0 sm:group-hover:opacity-100"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
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
