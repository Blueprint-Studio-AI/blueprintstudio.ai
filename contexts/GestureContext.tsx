// @/contexts/GestureContext.tsx
"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useMotionValue, useTransform, PanInfo, MotionValue } from 'framer-motion';

type GestureType = 'idle' | 'vertical' | 'horizontal';
type Direction = 'up' | 'down' | 'left' | 'right' | null;

interface GestureContextType {
  gestureType: GestureType;
  direction: Direction;
  x: MotionValue<number>;
  y: MotionValue<number>;
  progress: number;
  handlePanStart: () => void;
  handlePan: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
  handlePanEnd: () => void;
  lastScrollEvent: { deltaX: number; deltaY: number } | null;
  onThresholdReached: (callback: () => void) => void;
}

const GestureContext = createContext<GestureContextType | undefined>(undefined);

export const GestureProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gestureType, setGestureType] = useState<GestureType>('idle');
  const [direction, setDirection] = useState<Direction>(null);
  const [progress, setProgress] = useState(0);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [lastScrollEvent, setLastScrollEvent] = useState<{ deltaX: number; deltaY: number } | null>(null);
  const [thresholdReachedCallback, setThresholdReachedCallback] = useState<(() => void) | null>(null);

  const threshold = 100; // Distance required to trigger a full swipe (in pixels)

  const handlePanStart = useCallback(() => {
    setGestureType('idle');
    setDirection(null);
    setProgress(0);
  }, []);

  const handlePan = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset } = info;
    const initialThreshold = 10; // Initial threshold to determine gesture type

    if (gestureType === 'idle') {
      if (Math.abs(offset.x) > Math.abs(offset.y) && Math.abs(offset.x) > initialThreshold) {
        setGestureType('horizontal');
      } else if (Math.abs(offset.y) > Math.abs(offset.x) && Math.abs(offset.y) > initialThreshold) {
        setGestureType('vertical');
      }
    }

    if (gestureType === 'horizontal') {
      setDirection(offset.x > 0 ? 'left' : 'right');
      x.set(offset.x);
      setProgress(Math.min(Math.abs(offset.x) / threshold, 1));
    } else if (gestureType === 'vertical') {
      setDirection(offset.y > 0 ? 'up' : 'down');
      y.set(offset.y);
      setProgress(Math.min(Math.abs(offset.y) / threshold, 1));
    }
  }, [gestureType, x, y, threshold]);

  const handlePanEnd = useCallback(() => {
    const currentX = x.get();
    const currentY = y.get();

    if (Math.abs(currentX) >= threshold || Math.abs(currentY) >= threshold) {
      console.log("Threshold reached, change item");
      if (thresholdReachedCallback) {
        thresholdReachedCallback();
      }
    } else {
      // Threshold not reached, animate back to starting position
      x.set(0, true);
      y.set(0, true);
    }

    setGestureType('idle');
    setDirection(null);
    setProgress(0);
  }, [x, y, threshold, thresholdReachedCallback]);

  const handleScroll = useCallback((event: WheelEvent) => {
    event.preventDefault();
    const { deltaX, deltaY } = event;
    setLastScrollEvent({ deltaX, deltaY });

    const scrollThreshold = 5;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > scrollThreshold) {
      setGestureType('horizontal');
      setDirection(deltaX > 0 ? 'right' : 'left');
      x.set(deltaX);
      setProgress(Math.min(Math.abs(deltaX) / threshold, 1));
    } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > scrollThreshold) {
      setGestureType('vertical');
      setDirection(deltaY > 0 ? 'down' : 'up');
      y.set(deltaY);
      setProgress(Math.min(Math.abs(deltaY) / threshold, 1));
    }

    setTimeout(() => {
      setGestureType('idle');
      setDirection(null);
      x.set(0);
      y.set(0);
      setProgress(0);
    }, 100);
  }, [x, y, threshold]);

  useEffect(() => {
    window.addEventListener('wheel', handleScroll, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [handleScroll]);

  const onThresholdReached = useCallback((callback: () => void) => {
    setThresholdReachedCallback(() => callback);
  }, []);

  return (
    <GestureContext.Provider value={{ 
      gestureType, direction, x, y, progress,
      handlePanStart, handlePan, handlePanEnd, lastScrollEvent,
      onThresholdReached
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

export const useVerticalGesture = () => {
  const { gestureType, direction, y, progress } = useGesture();
  return { active: gestureType === 'vertical', direction, y, progress };
};

export const useHorizontalGesture = () => {
  const { gestureType, direction, x, progress } = useGesture();
  return { active: gestureType === 'horizontal', direction, x, progress };
};