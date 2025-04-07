"use client";

import { useState, useEffect } from "react";
import { Event } from "../types/Event";
import { CalendarNote } from "../components/CalendarNote";

type StorageKey = "events" | "notes";

export function useLocalStorage<T extends Event[] | CalendarNote[]>(
  key: StorageKey,
  initialValue: T
) {
  // Initialize state with a function to avoid unnecessary computation
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (!item) {
        return initialValue;
      }

      const parsed = JSON.parse(item);

      // Handle date conversion for specific types
      if (key === "events") {
        return parsed.map((event: Event) => ({
          ...event,
          startTime: new Date(event.startTime),
          endTime: new Date(event.endTime),
        })) as T;
      } else if (key === "notes") {
        return parsed.map((note: CalendarNote) => ({
          ...note,
          date: new Date(note.date),
          createdAt: new Date(note.createdAt),
        })) as T;
      }

      return parsed;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return initialValue;
    }
  });

  // Update localStorage when the state changes
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}
