// @/features/gestureHandler/GestureContext.ts
"use client";

import { createContext } from 'react';
import { MotionValue } from 'framer-motion';
import { GestureDirection } from './types';

export interface GestureContextValue {
  x: MotionValue<number>;
  y: MotionValue<number>;
  isActive: MotionValue<boolean>;
  setGestureActive: (active: boolean) => void;
  updateGesturePosition: (x: number, y: number) => void;
  goUp: () => void;
  goLeft: () => void;
  goRight: () => void;
  goDown: () => void;
  subscribeToGesture: (action: GestureDirection, callback: () => void) => () => void;
}

export const GestureContext = createContext<GestureContextValue | null>(null);