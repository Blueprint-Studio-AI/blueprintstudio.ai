// src/features/gestureHandler/handlers/scrollHandler.ts
import { HandlerProps } from '../types';

export function setupScrollHandler(
  element: HTMLElement,
  { x, y }: Pick<HandlerProps, 'x' | 'y'>
) {
  const handleWheel = (e: WheelEvent) => {
    x.set(x.get() + e.deltaX);
    y.set(y.get() + e.deltaY);
  };

  element.addEventListener('wheel', handleWheel);

  return () => {
    element.removeEventListener('wheel', handleWheel);
  };
}