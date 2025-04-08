export interface Goal {
  id: string;
  title: string;
  progress: number;
  category: "personal" | "work" | "health" | "learning";
  dueDate?: Date;
}
