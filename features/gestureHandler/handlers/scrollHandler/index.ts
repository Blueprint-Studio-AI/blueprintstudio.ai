import { useEffect, useContext } from 'react';
import { processScroll } from './scrollProcessor';
import { classifyScrollGesture } from './scrollClassifier';
import { debounceScrollDirection } from './debounceScrollDirection';
import { doubleScrollHandler } from '@/features/GestureHandler/Handlers/scrollHandler/doubleScrollHandler';
import { useGestureContext } from '../../useGestureContext';


export function useScrollHandler(containerRef: React.RefObject<HTMLElement>) {
  const { goUp, goLeft, goRight, goDown } = useGestureContext();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (event: WheelEvent) => {
      const scrollData = processScroll(event);
      // console.log(scrollData);
      
      if (scrollData) {
        const direction = classifyScrollGesture(scrollData);
        // console.log(direction)
        
        // doubleScrollHandler(scrollData, direction); This is a bitch

        debounceScrollDirection(direction, (debouncedDirection) => {
          if (debouncedDirection === 'up') goUp();
          if (debouncedDirection === 'left') goLeft();
          if (debouncedDirection === 'right') goRight();
          if (debouncedDirection === 'down') goDown();
        });
      }

    }

    container.addEventListener('wheel', handleWheel);

    return () => {
      container.removeEventListener('wheel', handleWheel);
    }

  }, [containerRef])
}