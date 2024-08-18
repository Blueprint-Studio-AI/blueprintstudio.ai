import { useEffect, useContext } from 'react';
import { processScroll } from './scrollProcessor';
import { classifyScrollGesture } from './scrollClassifier';
import { useGestureContext } from '@/features/gestureHandler/GestureContext';

export function useScrollHandler(containerRef: React.RefObject<HTMLElement>) {
  const { setDirection, setActiveInput } = useGestureContext();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleWheel = (event: WheelEvent) => {
      const scrollData = processScroll(event);
      if (scrollData) {
        const direction = classifyScrollGesture(scrollData);
        setDirection(direction);
        setActiveInput('wheel');

        clearTimeout(scrollTimeout); // Clear any existing timeout

        scrollTimeout = setTimeout(() => { // Set a new timeout
          setDirection(null);
          setActiveInput(null);
        }, 150); // ms
      }
    };

    container.addEventListener('wheel', handleWheel);

    return () => {
      container.removeEventListener('wheel', handleWheel);
    }

  }, [containerRef, setDirection, setActiveInput])
}