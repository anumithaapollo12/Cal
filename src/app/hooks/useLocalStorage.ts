"use client";

import { useState, useEffect } from "react";
import { Event } from "../types/Event";
import { CalendarNote } from "../components/CalendarNote";

type StorageKey = "events" | "notes";

export function useLocalStorage<T extends Event[] | CalendarNote[]>(
  key: StorageKey,
  initialValue: T
) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);

      // Parse stored json or if none return initialValue
      if (item) {
        const parsed = JSON.parse(item);

        // Handle date conversion for specific types
        if (key === "events") {
          const withDates = parsed.map((event: Event) => ({
            ...event,
            startTime: new Date(event.startTime),
            endTime: new Date(event.endTime),
          }));
          setStoredValue(withDates as T);
        } else if (key === "notes") {
          const withDates = parsed.map((note: CalendarNote) => ({
            ...note,
            date: new Date(note.date),
            createdAt: new Date(note.createdAt),
          }));
          setStoredValue(withDates as T);
        }
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
    }
  }, [key]); // Only run on mount and when key changes

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  };

  return [storedValue, setValue] as const;
}
