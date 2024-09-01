// @/features/GestureHandler/Handlers/touchHandler/displayTouchMotion.ts
import { GestureData } from "../../types";

interface DisplayPosition {
    x: number;
    y: number;
}

export function displayTouchMotion(gestureData: GestureData, direction: 'horizontal' | 'vertical'): DisplayPosition {
  if (direction === 'horizontal') {
    return { x: gestureData.x, y: 0 };
  } else {
    return { x: 0, y: gestureData.y };
  }
}