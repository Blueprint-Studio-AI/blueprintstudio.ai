import { Lethargy } from 'lethargy-ts';
import { GestureData } from '../../types';

// Setup to properly work with big scrolls, no slow small ones
const lethargy = new Lethargy({
  sensitivity: 2,
  delay: 20,
  increasingDeltasThreshold: 12,
});

let accumulatorX = 0;
let accumulatorY = 0;
let gestureTimeout: NodeJS.Timeout | null = null;
let isActive = false;

export function processScroll(event: WheelEvent): GestureData | null {
  const isIntentional = lethargy.check(event);

  if (isIntentional) {
    accumulatorX += event.deltaX;
    accumulatorY += event.deltaY;
    isActive = true;

    if (gestureTimeout) clearTimeout(gestureTimeout);
    gestureTimeout = setTimeout(completeGesture, 150);
  }

  return isActive ? { x: accumulatorX, y: accumulatorY, isActive: true } : null;
}

function completeGesture(): void {
  accumulatorX = 0;
  accumulatorY = 0;
  isActive = false;
}

//Currently unused
export function getScrollState(): GestureData | null {
  return isActive ? { x: accumulatorX, y: accumulatorY, isActive } : null;
}