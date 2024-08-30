// @/features/GestureHandler/Handlers/touchHandler/processTouch.ts

import { GestureData } from "../../types";

let startTouch: Touch | null = null;

export function processTouch(event: TouchEvent): void {
    switch (event.type) {
      case 'touchstart':
        if (event.touches.length > 0) {
          startTouch = event.touches[0];
          console.log('Start touch:', startTouch);
        }
        break;
  
      case 'touchmove':
        if (startTouch && event.touches.length > 0) {
          const currentTouch = event.touches[0];
          const deltaX = currentTouch.clientX - startTouch.clientX;
          const deltaY = currentTouch.clientY - startTouch.clientY;
          const gestureData: GestureData = { x: deltaX, y: deltaY, isActive: true };
          console.log('Gesture data:', gestureData);
        }
        break;
  
      case 'touchend':
        console.log('Touch ended');
        startTouch = null;
        break;
    }
  }