import { addDays, addMonths, setHours, setMinutes, subDays } from "date-fns";
import { Event } from "./types/Event";
import { CalendarNote } from "./components/CalendarNote";
import { LifeEvent } from "./types";
import { Goal } from "./types/Goal";

const today = new Date();

export const mockLifeEvents: LifeEvent[] = [
  {
    id: "life-1",
    title: "Sarah's Wedding Day 👰",
    date: addDays(today, 45),
    type: "special",
    note: "Beach wedding in Malibu! Don't forget to coordinate with the photographer.",
    color: "bg-amber-100",
    icon: "heart",
    repeatsAnnually: false,
  },
  {
    id: "life-2",
    title: "Mom's Birthday 🎂",
    date: addDays(today, 15),
    type: "birthday",
    note: "Plan surprise party at her favorite restaurant. Theme: Vintage Hollywood",
    color: "bg-pink-100",
    icon: "cake",
    repeatsAnnually: true,
  },
  {
    id: "life-3",
    title: "House Anniversary 🏠",
    date: addDays(today, 30),
    type: "anniversary",
    note: "One year in our dream home! Planning a housewarming BBQ.",
    color: "bg-purple-100",
    icon: "star",
    repeatsAnnually: true,
  },
  {
    id: "life-4",
    title: "Graduation Day 🎓",
    date: addMonths(today, 2),
    type: "special",
    note: "Master's degree ceremony. Family flying in from Europe.",
    color: "bg-amber-100",
    icon: "star",
    repeatsAnnually: false,
  },
  {
    id: "life-5",
    title: "Dad's Retirement Party 🎉",
    date: addMonths(today, 1),
    type: "special",
    note: "35 years of service celebration! Book the golf club venue.",
    color: "bg-blue-100",
    icon: "star",
    repeatsAnnually: false,
  },
  {
    id: "life-6",
    title: "Wedding Anniversary 💑",
    date: addMonths(today, 3),
    type: "anniversary",
    note: "5 years! Planning a surprise trip to Italy.",
    color: "bg-rose-100",
    icon: "heart",
    repeatsAnnually: true,
  },
  {
    id: "life-7",
    title: "Emma's First Day of School 🎒",
    date: addMonths(today, 4),
    type: "special",
    note: "Pack special lunch and take lots of photos!",
    color: "bg-green-100",
    icon: "star",
    repeatsAnnually: false,
  },
  {
    id: "life-8",
    title: "Brother's Birthday 🎮",
    date: addDays(today, 60),
    type: "birthday",
    note: "Get the new PS5 game he's been talking about",
    color: "bg-pink-100",
    icon: "cake",
    repeatsAnnually: true,
  },
];

export const mockEvents: Event[] = [
  {
    id: "event-1",
    title: "Design Workshop",
    description: "Brainstorming session for the new mobile app UI",
    startTime: setMinutes(setHours(addDays(today, 1), 10), 0),
    endTime: setMinutes(setHours(addDays(today, 1), 12), 0),
    type: "event",
    color: "bg-indigo-100",
    location: "Creative Studio, Floor 5",
    image:
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: "event-2",
    title: "Team Building: Cooking Class",
    description: "Learn to make authentic Italian pasta with Chef Marco",
    startTime: setMinutes(setHours(addDays(today, 2), 14), 0),
    endTime: setMinutes(setHours(addDays(today, 2), 17), 0),
    type: "event",
    color: "bg-indigo-100",
    location: "Culinary Institute Downtown",
    image:
      "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: "event-3",
    title: "Project Deadline: Mobile App V1",
    description: "Submit first version of the mobile app for client review",
    startTime: setMinutes(setHours(addDays(today, 3), 9), 0),
    endTime: setMinutes(setHours(addDays(today, 3), 10), 0),
    type: "task",
    color: "bg-green-100",
    priority: "high",
  },
  {
    id: "event-4",
    title: "Yoga Session",
    description: "Morning yoga and meditation with Sarah",
    startTime: setMinutes(setHours(addDays(today, 1), 7), 0),
    endTime: setMinutes(setHours(addDays(today, 1), 8), 0),
    type: "appointment",
    color: "bg-pink-100",
    location: "Zen Garden Studio",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: "event-5",
    title: "Client Presentation",
    description: "Quarterly review with Acme Corp",
    startTime: setMinutes(setHours(addDays(today, 4), 15), 0),
    endTime: setMinutes(setHours(addDays(today, 4), 16), 30),
    type: "event",
    color: "bg-indigo-100",
    location: "Conference Room A",
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: "event-6",
    title: "Dentist Appointment",
    description: "Regular checkup and cleaning",
    startTime: setMinutes(setHours(addDays(today, 5), 11), 0),
    endTime: setMinutes(setHours(addDays(today, 5), 12), 0),
    type: "appointment",
    color: "bg-pink-100",
    location: "Dr. Smith's Dental Clinic",
  },
  {
    id: "event-7",
    title: "Weekly Team Sync",
    description: "Review sprint progress and upcoming tasks",
    startTime: setMinutes(setHours(today, 13), 0),
    endTime: setMinutes(setHours(today, 14), 0),
    type: "event",
    color: "bg-indigo-100",
    location: "Virtual Meeting Room",
    recurring: "weekly",
  },
  {
    id: "event-8",
    title: "Photography Exhibition",
    description: "Urban Landscapes by Jane Doe",
    startTime: setMinutes(setHours(addDays(today, 6), 18), 0),
    endTime: setMinutes(setHours(addDays(today, 6), 21), 0),
    type: "event",
    color: "bg-indigo-100",
    location: "City Art Gallery",
    image:
      "https://images.unsplash.com/photo-1554668048-5555f7a398ad?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: "event-9",
    title: "Code Review",
    description: "Review PR for new feature implementation",
    startTime: setMinutes(setHours(subDays(today, 1), 15), 0),
    endTime: setMinutes(setHours(subDays(today, 1), 16), 0),
    type: "task",
    color: "bg-green-100",
    priority: "medium",
  },
];

export const mockNotes: CalendarNote[] = [
  {
    id: "note-1",
    content:
      "🎯 Q2 Goals Review\n• Launch new feature\n• Team offsite planning\n• Performance reviews",
    color: "bg-yellow-100 border-yellow-200",
    date: new Date(),
    createdAt: new Date(),
    isPinned: false,
  },
  {
    id: "note-2",
    content:
      "📚 Reading List\n• Atomic Habits\n• Deep Work\n• The Pragmatic Programmer",
    color: "bg-blue-100 border-blue-200",
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    createdAt: new Date(),
    isPinned: false,
  },
  {
    id: "note-3",
    content:
      "💡 Project Ideas\n• AI-powered task manager\n• Personal finance tracker\n• Recipe recommender",
    color: "bg-green-100 border-green-200",
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    createdAt: new Date(),
    isPinned: false,
  },
  {
    id: "note-4",
    content:
      "🎨 Design Inspiration\n• Minimalist UI patterns\n• Color palette ideas\n• Typography experiments",
    color: "bg-pink-100 border-pink-200",
    date: new Date(new Date().setDate(new Date().getDate() + 3)),
    createdAt: new Date(),
    isPinned: false,
  },
  {
    id: "note-5",
    content: "🏃‍♂️ Fitness Goals\n• Run 5k\n• Yoga 3x/week\n• Meal prep Sundays",
    color: "bg-purple-100 border-purple-200",
    date: new Date(new Date().setDate(new Date().getDate() + 4)),
    createdAt: new Date(),
    isPinned: false,
  },
  {
    id: "note-6",
    content:
      "🎵 Music Practice\n• Learn new song\n• Practice scales\n• Record cover",
    color: "bg-yellow-100 border-yellow-200",
    date: new Date(new Date().setDate(new Date().getDate() + 5)),
    createdAt: new Date(),
    isPinned: false,
  },
  {
    id: "note-7",
    content:
      "✈️ Travel Plans\n• Book flights\n• Research activities\n• Packing list",
    color: "bg-blue-100 border-blue-200",
    date: new Date(new Date().setDate(new Date().getDate() + 6)),
    createdAt: new Date(),
    isPinned: false,
  },
];

export const mockGoals: Goal[] = [
  {
    id: "goal-1",
    title: "Learn Spanish",
    progress: 45,
    category: "learning",
    dueDate: addMonths(today, 6),
  },
  {
    id: "goal-2",
    title: "Run a Marathon",
    progress: 70,
    category: "health",
    dueDate: addMonths(today, 3),
  },
  {
    id: "goal-3",
    title: "Launch Side Project",
    progress: 30,
    category: "work",
    dueDate: addMonths(today, 2),
  },
];
