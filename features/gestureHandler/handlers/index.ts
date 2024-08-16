// src/features/gestureHandler/handlers/index.ts
import { RefObject, useEffect } from 'react';
import { HandlerProps } from '../types';
import { setupScrollHandler } from './scrollHandler';

export function useGestureHandlers(
  containerRef: RefObject<HTMLDivElement>,
  props: HandlerProps
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cleanupFunctions = [
      setupScrollHandler(container, props)
      //add others
    ];

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    }
  }, [containerRef, props])
};