// @/features/GestureHandler/Handlers/touchHandler/processTouch.ts

import { GestureData } from "../../types";

let startTouch: Touch | null = null;

export function processTouch(event: TouchEvent): GestureData | null {
    switch (event.type) {
      case 'touchstart':
        if (event.touches.length > 0) {
          startTouch = event.touches[0];
          return { x: 0, y: 0, isActive: true };
        }
        break;
  
      case 'touchmove':
        if (startTouch && event.touches.length > 0) {
          const currentTouch = event.touches[0];
          const deltaX = currentTouch.clientX - startTouch.clientX;
          const deltaY = currentTouch.clientY - startTouch.clientY;
          return { x: deltaX, y: deltaY, isActive: true };
        }
        break;
  
      case 'touchend':
        startTouch = null;
        return { x: 0, y: 0, isActive: false};
    }

    return null;
  }