"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { format, isWeekend, addYears, differenceInDays } from "date-fns";
import {
  CalendarIcon,
  LightBulbIcon,
  BellIcon,
  DocumentTextIcon,
  XMarkIcon,
  PlusIcon,
  SparklesIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
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
  type: "birthday" | "anniversary" | "holiday";
  note: string;
  isWeekday: boolean;
}

export default function SidePanel({ isOpen, onClose }: SidePanelProps) {
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

  // Sample data - in a real app, this would come from state management
  const upcomingEvents: UpcomingEvent[] = [
    {
      id: "1",
      title: "Your Birthday",
      date: new Date(2024, 5, 15), // June 15, 2024
      type: "birthday",
      isWeekend: false,
      daysUntil: 45,
    },
    {
      id: "2",
      title: "Work Anniversary",
      date: new Date(2024, 7, 1), // August 1, 2024
      type: "anniversary",
      isWeekend: false,
      daysUntil: 92,
    },
    {
      id: "3",
      title: "Christmas",
      date: new Date(2024, 11, 25), // December 25, 2024
      type: "holiday",
      isWeekend: true,
      daysUntil: 198,
    },
  ];

  // Enhanced life events with weekday information
  const lifeEvents: LifeEvent[] = [
    {
      id: "1",
      title: "Mom's Birthday",
      date: new Date(2024, 5, 15),
      type: "birthday",
      note: "She mentioned wanting to try that new Italian restaurant",
      isWeekday: !isWeekend(new Date(2024, 5, 15)),
    },
    {
      id: "2",
      title: "Wedding Anniversary",
      date: new Date(2024, 7, 1),
      type: "anniversary",
      note: "Book something special - last year was magical",
      isWeekday: !isWeekend(new Date(2024, 7, 1)),
    },
    {
      id: "3",
      title: "Family Vacation",
      date: new Date(2024, 11, 25),
      type: "holiday",
      note: "Start planning activities everyone will enjoy",
      isWeekday: !isWeekend(new Date(2024, 11, 25)),
    },
  ];

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

                {activeTab === "upcoming" && (
                  <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
                      <div className="flex items-center gap-3 mb-3">
                        <HeartIcon className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-medium text-gray-900">
                          Life Snapshot
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {lifeEvents.length} upcoming events to plan for. Take a
                        moment to prepare and make them special!
                      </p>
                    </div>

                    <div className="space-y-4">
                      {lifeEvents.map((event) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {event.title}
                              </h4>
                              <p className="mt-1 text-sm text-gray-500">
                                {format(event.date, "MMMM d, yyyy")} (
                                {format(event.date, "EEEE")})
                              </p>
                              <p className="mt-2 text-sm text-gray-600 italic">
                                "{event.note}"
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                {differenceInDays(event.date, new Date())} days
                              </span>
                              {event.isWeekday && (
                                <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                  Weekday
                                </span>
                              )}
                            </div>
                          </div>
                          {event.isWeekday && (
                            <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                              <p className="text-sm text-yellow-800">
                                This falls on a weekday. Consider planning time
                                off or notifying your team.
                              </p>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <button className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-colors">
                        <div className="flex flex-col items-center space-y-2">
                          <BellIcon className="w-6 h-6 text-blue-600" />
                          <span className="text-sm font-medium text-blue-700">
                            Set Reminders
                          </span>
                        </div>
                      </button>
                      <button className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-colors">
                        <div className="flex flex-col items-center space-y-2">
                          <CalendarIcon className="w-6 h-6 text-green-600" />
                          <span className="text-sm font-medium text-green-700">
                            Plan Free Time
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
