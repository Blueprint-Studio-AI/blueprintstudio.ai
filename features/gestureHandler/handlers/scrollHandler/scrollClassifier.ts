import { GestureDirection, GestureData } from '@/features/GestureHandler/types';

const THRESHOLD = 25; //Classification threshold

export function classifyScrollGesture(data: GestureData): GestureDirection {
  if (Math.abs(data.x) > Math.abs(data.y)) {
    return data.x > THRESHOLD ? 'right' : data.x < -THRESHOLD ? 'left' : null;
  } else {
    return data.y > THRESHOLD ? 'down' : data.y < -THRESHOLD ? 'up' : null;
  }
}