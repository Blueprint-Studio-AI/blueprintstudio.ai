// src/features/gestureHandler/types.ts
import { MotionValue } from 'framer-motion';
import { MutableRefObject } from 'react';

export type InputType = 'wheel' | 'touch' | 'mouse';

export interface GestureData {
  x: number;
  y: number;
  isActive: boolean;
}

export interface HandlerProps {
  onGestureChange: (data: GestureData) => void;
  activeInput: (inputType: InputType) => void;
}

export interface GestureContextType {
  x: number;
  y: number;
  isActive: MutableRefObject<boolean>;
  activeInputs: Set<InputType>;
}