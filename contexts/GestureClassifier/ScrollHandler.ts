import { useEffect, useCallback } from 'react';

export function useScrollHandler(onScroll: (deltaX: number, deltaY: number) => void) {
  const handleScroll = useCallback((event: WheelEvent) => {
    event.preventDefault();
    onScroll(event.deltaX, event.deltaY);
  }, [onScroll]);

  useEffect(() => {
    window.addEventListener('wheel', handleScroll, { passive: false });
    return () => window.removeEventListener('wheel', handleScroll);
  }, [handleScroll]);
}