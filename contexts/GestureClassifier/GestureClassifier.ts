import { useState, useCallback } from 'react';

export type GestureType = 'idle' | 'vertical' | 'horizontal';
export type Direction = 'up' | 'down' | 'left' | 'right' | null;

export interface GestureContextType {
  gestureType: GestureType;
  direction: Direction;
}

export function useGestureClassifier() {
  const [gestureType, setGestureType] = useState<GestureType>('idle');
  const [direction, setDirection] = useState<Direction>(null);

  const classifyGesture = useCallback((offsetX: number, offsetY: number) => {
    const initialThreshold = 10;

    if (Math.abs(offsetX) > Math.abs(offsetY) && Math.abs(offsetX) > initialThreshold) {
      setGestureType('horizontal');
      setDirection(offsetX > 0 ? 'right' : 'left');
    } else if (Math.abs(offsetY) > Math.abs(offsetX) && Math.abs(offsetY) > initialThreshold) {
      setGestureType('vertical');
      setDirection(offsetY > 0 ? 'down' : 'up');
    } else {
      setGestureType('idle');
      setDirection(null);
    }
  }, []);

  return { gestureType, direction, classifyGesture };
}