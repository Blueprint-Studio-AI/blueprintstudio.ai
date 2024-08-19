// @/features/gestureHandler/handlers/backScrollHandler.ts

//This removes the "go back" gesture on desktop browsers when you scroll left.

import { useEffect } from "react";

export function useBackScrollHandler(ref: React.RefObject<HTMLDivElement>) {
    useEffect(() => {
      const element = ref.current;
      if (!element) return;
  
      const handleWheel = (event: WheelEvent) => {
        if (Math.abs(event.deltaX) < Math.abs(event.deltaY)) {
          // Scrolling more vertically than horizontally. Let it be!
          return;
        }
        const scrollLeftMax = element.scrollWidth - element.offsetWidth;
        if (
          element.scrollLeft + event.deltaX < 0 ||
          element.scrollLeft + event.deltaX > scrollLeftMax
        ) { 
          event.preventDefault();
        }
      };
  
      element.addEventListener("wheel", handleWheel, { passive: false });
  
      return () => {
        element.removeEventListener("wheel", handleWheel);
      };
    }, [ref]);
  }