"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { MotionValue } from 'framer-motion';
import { useMotionValue } from 'framer-motion';
import { GestureType, Direction, useGestureClassifier } from './GestureClassifier';
import { useThresholdManager } from './ThresholdManager';
import { useDebouncer } from './Debouncer';
import { useScrollHandler } from './ScrollHandler';
import { useDragHandler } from './DragHandler';
import { useTouchHandler } from './TouchHandler';

interface GestureContextType {
  gestureType: GestureType;
  direction: Direction;
  progress: number;
  x: MotionValue<number>;
  y: MotionValue<number>;
}

const GestureContext = createContext<GestureContextType | undefined>(undefined);

export const GestureProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { gestureType, direction, classifyGesture } = useGestureClassifier();
  const { progress, updateProgress, isThresholdReached } = useThresholdManager(100);
  const debouncedGestureType = useDebouncer(gestureType, 100);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleGesture = (offsetX: number, offsetY: number) => {
    classifyGesture(offsetX, offsetY);
    updateProgress(Math.max(Math.abs(offsetX), Math.abs(offsetY)));
    x.set(offsetX);
    y.set(offsetY);

    if (isThresholdReached()) {
      // Trigger your snap-to-next-section logic here
      console.log('Threshold reached, snap to next section');
    }
  };

  useScrollHandler(handleGesture);
  const { handleDragStart, handleDrag, handleDragEnd } = useDragHandler(handleGesture);
  const { handleTouchStart, handleTouchMove } = useTouchHandler(handleGesture);

  return (
    <GestureContext.Provider value={{
      gestureType: debouncedGestureType,
      direction,
      progress,
      x,
      y,
    }}>
      {children}
    </GestureContext.Provider>
  );
};

export const useGesture = () => {
  const context = useContext(GestureContext);
  if (context === undefined) {
    throw new Error('useGesture must be used within a GestureProvider');
  }
  return context;
};