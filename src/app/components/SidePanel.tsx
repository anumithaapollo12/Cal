"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { format, isWeekend, addYears } from "date-fns";
import {
  CalendarIcon,
  LightBulbIcon,
  BellIcon,
  DocumentTextIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UpcomingEvent {
  id: string;
  title: string;
  date: Date;
  type: "birthday" | "anniversary" | "holiday";
  isWeekend: boolean;
  daysUntil: number;
}

export default function SidePanel({ isOpen, onClose }: SidePanelProps) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "goals" | "notes">(
    "upcoming"
  );

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
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Calendar Insights
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
                    <span>Upcoming</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("goals")}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === "goals"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <LightBulbIcon className="w-5 h-5" />
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
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === "upcoming" && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Important Dates
                      </h3>
                      {upcomingEvents.map((event) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-xl bg-gray-50"
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
                            </div>
                            <div className="flex items-center space-x-2">
                              {!event.isWeekend && (
                                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                  Weekday
                                </span>
                              )}
                              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                {event.daysUntil} days
                              </span>
                            </div>
                          </div>
                          {!event.isWeekend && (
                            <div className="mt-3 p-3 bg-white rounded-lg border border-yellow-200">
                              <p className="text-sm text-yellow-800">
                                This falls on a weekday. Consider planning time
                                off or notifying your team.
                              </p>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Quick Actions
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
                          <div className="flex items-center space-x-2">
                            <BellIcon className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-medium text-blue-700">
                              Set Reminder
                            </span>
                          </div>
                        </button>
                        <button className="p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
                          <div className="flex items-center space-x-2">
                            <CalendarIcon className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-medium text-green-700">
                              Plan Time Off
                            </span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "goals" && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Monthly Goals
                      </h3>
                      <div className="p-4 rounded-xl bg-gray-50">
                        <p className="text-sm text-gray-600">
                          Track your monthly goals and see how they align with
                          your schedule.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "notes" && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Quick Notes
                      </h3>
                      <div className="p-4 rounded-xl bg-gray-50">
                        <p className="text-sm text-gray-600">
                          Jot down quick notes about your schedule or important
                          reminders.
                        </p>
                      </div>
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
