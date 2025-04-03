export interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  color?: string;
  image?: string; // URL of the event image
  imageAlt?: string; // Alt text for accessibility
}
