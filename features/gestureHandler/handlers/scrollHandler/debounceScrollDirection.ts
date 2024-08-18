import { GestureDirection } from "@/features/gestureHandler/types";

let lastDirection: GestureDirection = null;
let lastCallTime = 0;
const DEBOUNCE_DELAY = 10; // Callback delay in milliseconds
const IGNORE_PERIOD = 25; // Period to ignore redundant events in milliseconds

export function debounceScrollDirection(
  direction: GestureDirection, 
  callback: (debouncedDirection: GestureDirection) => void
): void {
  const now = Date.now();

  if (direction !== lastDirection && now - lastCallTime > IGNORE_PERIOD) {
    lastDirection = direction;
    lastCallTime = now;

    setTimeout(() => {
      callback(direction);
    }, DEBOUNCE_DELAY);
  }
}