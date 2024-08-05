import { useCallback } from 'react';

export function useTouchHandler(onTouch: (offsetX: number, offsetY: number) => void) {
  let startX = 0;
  let startY = 0;

  const handleTouchStart = useCallback((event: TouchEvent) => {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    const offsetX = event.touches[0].clientX - startX;
    const offsetY = event.touches[0].clientY - startY;
    onTouch(offsetX, offsetY);
  }, [onTouch]);

  return { handleTouchStart, handleTouchMove };
}