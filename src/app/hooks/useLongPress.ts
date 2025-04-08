import { useCallback, useRef } from "react";

interface UseLongPressOptions {
  shouldPreventDefault?: boolean;
  delay?: number;
}

export default function useLongPress(
  onLongPress: (event: any) => void,
  onClick: (event: any) => void,
  { shouldPreventDefault = true, delay = 300 } = {} as UseLongPressOptions
) {
  const timeout = useRef<NodeJS.Timeout>();
  const target = useRef<EventTarget>();

  const start = useCallback(
    (event: any) => {
      // Prevent context menu from appearing on long press
      if (shouldPreventDefault && event.target) {
        event.target.addEventListener("contextmenu", preventDefault, {
          passive: false,
        });
        target.current = event.target;
      }
      timeout.current = setTimeout(() => onLongPress(event), delay);
    },
    [onLongPress, delay, shouldPreventDefault]
  );

  const clear = useCallback(
    (event: any, shouldTriggerClick = true) => {
      timeout.current && clearTimeout(timeout.current);
      shouldTriggerClick && !timeout.current && onClick(event);
      if (shouldPreventDefault && target.current) {
        target.current.removeEventListener("contextmenu", preventDefault);
      }
    },
    [shouldPreventDefault, onClick]
  );

  return {
    onMouseDown: (e: any) => start(e),
    onTouchStart: (e: any) => start(e),
    onMouseUp: (e: any) => clear(e),
    onMouseLeave: (e: any) => clear(e, false),
    onTouchEnd: (e: any) => clear(e),
  };
}

const preventDefault = (event: Event) => {
  if (!isTouchEvent(event)) return;

  if (event.touches.length < 2 && event.preventDefault) {
    event.preventDefault();
  }
};

const isTouchEvent = (event: Event): event is TouchEvent => {
  return "touches" in event;
};
