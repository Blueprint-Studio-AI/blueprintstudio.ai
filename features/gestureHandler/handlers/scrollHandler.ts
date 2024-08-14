// src/features/gestureHandler/handlers/scrollHandler.ts

import { GestureData } from '../types';

const DEBOUNCE_DELAY = 150; // milliseconds

let debounceTimer: NodeJS.Timeout | null = null;
let isScrollActive = false;

function debounceScroll(): void {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  
  isScrollActive = true;
  
  debounceTimer = setTimeout(() => {
    isScrollActive = false;
  }, DEBOUNCE_DELAY);
}

export function handleScroll(event: WheelEvent): GestureData {
  const x = event.deltaX;
  const y = event.deltaY;

  debounceScroll();

  return {
    x,
    y,
    isActive: isScrollActive
  };
}