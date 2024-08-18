// src/features/gestureHandler/types.ts
import { MutableRefObject } from 'react';

export type InputType = 'wheel' | 'touch' | 'mouse' | 'key' | null;

export type GestureDirection = 'up' | 'down' | 'left' | 'right' | null;

export interface GestureData {
  x: number;
  y: number;
  isActive: boolean;
}

export interface GestureContextType {
  direction: GestureDirection;
  activeInputs: Set<InputType>;
  containerRef: MutableRefObject<HTMLDivElement | null>;
}