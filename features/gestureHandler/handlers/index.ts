// src/features/gestureHandler/handlers/index.ts
import { RefObject, useEffect } from 'react';
import { HandlerProps } from '../types';
import { setupScrollHandler } from './scrollHandler';

export const useGestureHandlers = (
  containerRef: RefObject<HTMLDivElement>,
  props: HandlerProps
) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cleanupFunctions = [
      setupScrollHandler(container, props),
      // Add other handler setup functions here as they are created
    ];

    const handleGesture = () => {
      props.activateInput('wheel'); // Or the appropriate input type
      props.onGestureChange();
    };

    container.addEventListener('wheel', handleGesture);

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
      container.removeEventListener('wheel', handleGesture);
    };
  }, [containerRef, props]);
};