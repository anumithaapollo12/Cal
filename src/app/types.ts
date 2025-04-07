export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  color?: string;
  allDay?: boolean;
}

export interface CalendarNote {
  id: string;
  content: string;
  date: Date;
  createdAt: Date;
}

export interface LifeEvent {
  id: string;
  title: string;
  date: Date;
  type: "birthday" | "anniversary" | "holiday" | "special";
  note?: string;
  color?: string;
  icon?: "cake" | "gift" | "heart" | "star";
  repeatsAnnually?: boolean;
  daysUntil?: number;
}
