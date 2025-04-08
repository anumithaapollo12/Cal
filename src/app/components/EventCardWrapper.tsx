import { useRef, useState, useEffect } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Event } from "../types/Event";
import EventCard from "./EventCard";
import useLongPress from "../hooks/useLongPress";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { ClockIcon } from "@heroicons/react/24/outline";

interface EventCardWrapperProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
  onOpenDetail: (
    event: Event,
    position?: { top: number; left: number; width: number; height: number }
  ) => void;
  isCompact?: boolean;
}

export default function EventCardWrapper({
  event,
  onEdit,
  onDelete,
  onOpenDetail,
  isCompact,
}: EventCardWrapperProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const pressTimer = useRef<NodeJS.Timeout>();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSorting,
  } = useSortable({
    id: event.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging || isSorting || hasMoved) return;
    onOpenDetail(event);
  };

  const startDrag = () => {
    setIsDragging(true);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startPos.current = { x: e.clientX, y: e.clientY };
    setHasMoved(false);

    // Start timer for long press
    pressTimer.current = setTimeout(() => {
      startDrag();
    }, 300);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) {
      const dx = Math.abs(e.clientX - startPos.current.x);
      const dy = Math.abs(e.clientY - startPos.current.y);
      if (dx > 5 || dy > 5) {
        setHasMoved(true);
        clearTimeout(pressTimer.current);
      }
    }
  };

  const handleMouseUp = () => {
    clearTimeout(pressTimer.current);
    if (!isDragging && !hasMoved) {
      handleClick({} as React.MouseEvent);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startPos.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    setHasMoved(false);

    // Start timer for long press
    pressTimer.current = setTimeout(() => {
      startDrag();
    }, 300);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) {
      const dx = Math.abs(e.touches[0].clientX - startPos.current.x);
      const dy = Math.abs(e.touches[0].clientY - startPos.current.y);
      if (dx > 5 || dy > 5) {
        setHasMoved(true);
        clearTimeout(pressTimer.current);
      }
    }
  };

  const handleTouchEnd = () => {
    clearTimeout(pressTimer.current);
    if (!isDragging && !hasMoved) {
      handleClick({} as React.MouseEvent);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeout(pressTimer.current);
    };
  }, []);

  // Reset states when sort ends
  useEffect(() => {
    if (!isSorting) {
      setIsDragging(false);
      setHasMoved(false);
    }
  }, [isSorting]);

  const eventHandlers = {
    ...attributes,
    ...(isDragging ? listeners : {}),
    onMouseDown: (e: React.MouseEvent) => {
      handleMouseDown(e);
      if (isDragging && listeners?.onMouseDown) {
        listeners.onMouseDown(e);
      }
    },
    onMouseMove: (e: React.MouseEvent) => {
      handleMouseMove(e);
      if (isDragging && listeners?.onMouseMove) {
        listeners.onMouseMove(e);
      }
    },
    onMouseUp: (e: React.MouseEvent) => {
      handleMouseUp();
      if (isDragging && listeners?.onMouseUp) {
        listeners.onMouseUp(e);
      }
    },
    onTouchStart: (e: React.TouchEvent) => {
      handleTouchStart(e);
      if (isDragging && listeners?.onTouchStart) {
        listeners.onTouchStart(e);
      }
    },
    onTouchMove: (e: React.TouchEvent) => {
      handleTouchMove(e);
      if (isDragging && listeners?.onTouchMove) {
        listeners.onTouchMove(e);
      }
    },
    onTouchEnd: (e: React.TouchEvent) => {
      handleTouchEnd();
      if (isDragging && listeners?.onTouchEnd) {
        listeners.onTouchEnd(e);
      }
    },
  };

  return (
    <div
      ref={(node) => {
        if (node) {
          setNodeRef(node);
          (cardRef as React.MutableRefObject<HTMLDivElement | null>).current =
            node;
        }
      }}
      style={style}
      {...eventHandlers}
      className="touch-none select-none"
    >
      <EventCard
        event={event}
        isDragging={isDragging || isSorting}
        isDragEnabled={true}
        onEdit={onEdit}
        onDelete={onDelete}
        onOpenDetail={onOpenDetail}
      />
    </div>
  );
}
