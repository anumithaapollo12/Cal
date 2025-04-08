export interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  type:
    | "event"
    | "task"
    | "appointment"
    | "birthday"
    | "anniversary"
    | "holiday"
    | "special";
  color?: string;
  location?: string;
  image?: string;
  isLifeEvent?: boolean;
  priority?: "low" | "medium" | "high";
  recurring?: "daily" | "weekly" | "monthly" | "yearly";
}
