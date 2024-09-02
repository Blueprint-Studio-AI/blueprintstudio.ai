// @/features/GestureHandler/Handlers/touchHandler/classifyTouchDirection.ts
import { GestureData } from "../../types";

type Direction = 'horizontal' | 'vertical' | null;

export const createTouchDirectionClassifier = () => {
  let direction: Direction = null;
  let startTime: number | null = null;
  const DECISION_DELAY = 20; // milliseconds

  return (gestureData: GestureData): Direction => {
    if (!gestureData.isActive) {
      // Reset on touch end
      direction = null;
      startTime = null;
      return null;
    }

    if (direction === null) {
      if (startTime === null) {
        startTime = Date.now();
      } else if (Date.now() - startTime >= DECISION_DELAY) {
        // Decide direction after delay
        direction = Math.abs(gestureData.x) > Math.abs(gestureData.y) ? 'horizontal' : 'vertical';
      }
    }

    return direction;
  };
};