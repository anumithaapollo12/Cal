import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { XMarkIcon } from "@heroicons/react/24/outline";

const COLORS = [
  "bg-yellow-100 border-yellow-200",
  "bg-blue-100 border-blue-200",
  "bg-green-100 border-green-200",
  "bg-pink-100 border-pink-200",
  "bg-purple-100 border-purple-200",
];

export interface CalendarNote {
  id: string;
  content: string;
  color: string;
  date: Date;
  createdAt: Date;
  isPinned?: boolean;
}

interface CalendarNoteProps {
  note: CalendarNote;
  onUpdate: (note: CalendarNote) => void;
  onDelete: (noteId: string) => void;
}

export default function CalendarNote({
  note,
  onUpdate,
  onDelete,
}: CalendarNoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(note.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const startEditing = () => {
    setIsEditing(true);
  };

  const saveNote = () => {
    setIsEditing(false);
    if (content !== note.content) {
      onUpdate({ ...note, content });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      saveNote();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(note.id);
  };

  return (
    <div
      className={`group relative p-3 rounded-lg border shadow-sm md:max-w-[200px] w-full
        ${note.color} hover:shadow-md transition-all duration-200`}
      onDoubleClick={startEditing}
    >
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={saveNote}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent resize-none focus:outline-none
                   text-sm text-gray-700 min-h-[60px]"
          placeholder="Write your note..."
          autoFocus
        />
      ) : (
        <p className="text-sm whitespace-pre-wrap text-gray-700 min-h-[60px]">
          {content || "Double-click to add note"}
        </p>
      )}

      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white
                 text-gray-500 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100
                 transition-opacity duration-200"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>

      <div className="mt-2 text-[10px] text-gray-500">
        {format(note.createdAt, "MMM d, h:mm a")}
      </div>
    </div>
  );
}
