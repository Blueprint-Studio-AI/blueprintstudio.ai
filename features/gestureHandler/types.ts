// src/features/gestureHandler/types.ts
import { MotionValue } from 'framer-motion';

export type InputType = 'wheel' | 'trackpad' | 'touch' | 'drag';

export interface GestureContextType {
  gestureType: string;
  direction: string;
  x: MotionValue<number>;
  y: MotionValue<number>;
  activeInputs: Set<InputType>;
}

export interface HandlerProps {
  x: MotionValue<number>;
  y: MotionValue<number>;
  activateInput: (inputType: InputType) => void;
  onGestureChange: () => void;
}