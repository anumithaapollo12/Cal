export interface LifeEvent {
  id: string;
  title: string;
  date: Date;
  type: "birthday" | "anniversary" | "holiday" | "special";
  note?: string;
  color?: string;
  icon?: "cake" | "gift" | "heart" | "star";
  repeatsAnnually?: boolean;
}

export interface Goal {
  id: string;
  title: string;
  progress: number;
  category: "personal" | "work" | "health" | "learning";
  dueDate?: Date;
}
