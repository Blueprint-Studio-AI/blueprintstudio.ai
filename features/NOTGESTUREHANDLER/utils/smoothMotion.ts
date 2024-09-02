// @/features/GestureHandler/utils/smoothMotion.ts
import { MotionValue, animate, AnimationPlaybackControls } from "framer-motion";

export function smoothMotion(
  value: MotionValue<number>,
  target: number,
  duration: number = 0.3
): AnimationPlaybackControls {
  return animate(value, target, {
    type: "spring",
    stiffness: 300,
    damping: 30,
    duration: duration,
  });
}