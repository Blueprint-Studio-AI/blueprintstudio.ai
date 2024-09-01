// src/features/gestureHandler/types.ts
export type InputType = 'wheel' | 'touch' | 'mouse' | 'key' | null;

export type GestureDirection = 'up' | 'down' | 'left' | 'right' | null;

export interface GestureData {
  x: number;
  y: number;
  isActive: boolean;
}