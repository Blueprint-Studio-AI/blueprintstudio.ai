import { GestureDirection, GestureData } from '@/features/gestureHandler/types';

const THRESHOLD = 10; // ms for judgement

export function classifyScrollGesture(data: GestureData): GestureDirection {
  if (Math.abs(data.x) > Math.abs(data.y)) {
    return data.x > THRESHOLD ? 'right' : data.x < -THRESHOLD ? 'left' : null;
  } else {
    return data.y > THRESHOLD ? 'down' : data.y < -THRESHOLD ? 'up' : null;
  }
}