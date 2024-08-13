// src/features/gestureHandler/utils/gestureClassifier.ts
import { MotionValue } from 'framer-motion';

export function classifyGesture(x: MotionValue<number>, y: MotionValue<number>) {
  const deltaX = x.get();
  const deltaY = y.get();
  
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    return {
      gestureType: 'horizontal',
      direction: deltaX > 0 ? 'right' : 'left'
    };
  } else {
    return {
      gestureType: 'vertical',
      direction: deltaY > 0 ? 'down' : 'up'
    };
  }
}