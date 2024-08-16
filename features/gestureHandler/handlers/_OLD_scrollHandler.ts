// src/features/gestureHandler/handlers/scrollHandler.ts
import { GestureData, HandlerProps } from '../types';

const DEBOUNCE_DELAY = 150; //miliseconds

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

function handleScroll(event: WheelEvent, props: HandlerProps): void {
  // console.log(event.deltaX, event.deltaY, isScrollActive);
  const gestureData: GestureData = {
    x: event.deltaX,
    y: event.deltaY,
    isActive: isScrollActive
  };

  debounceScroll();

  props.onGestureChange(gestureData);
  props.activeInput('wheel');
}

export function setupScrollHandler(container: HTMLElement, props: HandlerProps) {
  const scrollHandler = (event: WheelEvent) => handleScroll(event, props);

  container.addEventListener('wheel', scrollHandler);

  return () => {
    container.removeEventListener('wheel', scrollHandler);
  }
}