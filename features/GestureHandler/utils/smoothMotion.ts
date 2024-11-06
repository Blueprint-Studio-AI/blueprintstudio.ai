// @/features/GestureHandler/utils/smoothMotion.ts
import { MotionValue, animate, AnimationPlaybackControls, Spring, Tween } from "framer-motion";

const THRESHOLD = 400; //px

export function smoothMotion(
  value: MotionValue<number>,
  target: number
): AnimationPlaybackControls { 

  const currentValue = value.get();
  const difference = Math.abs(target - currentValue);

  // Choose animation based on difference
  const animation: Spring | Tween = difference > THRESHOLD
    ? {
        // For big motions
        type: 'spring',
        stiffness: 300,
        damping: 30,
        duration: 0.2
      }
    : {
        // For small motions
        type: "tween",
        duration: 0.1,
        ease: "linear"
      };

  return animate(value, target, animation);
}