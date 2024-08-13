// @/components/home/GestureTestBox2.tsx
"use client";

import { motion } from 'framer-motion';
import { useGestureContext } from '@/features/gestureHandler';
import { InputType } from '@/features/gestureHandler/types';

export default function GestureTestBox2() {
  const { gestureType, direction, x, y, activeInputs } = useGestureContext();

  const InputIndicator = ({ type }: { type: InputType }) => (
    <div className={`w-4 h-4 rounded-full ${activeInputs.has(type) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
  );

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-100">
      <motion.div
        className="w-64 h-64 bg-blue-500 rounded-lg flex flex-col items-center justify-center text-white text-center"
        style={{ x, y }}
      >
        <p>Gesture: {gestureType}</p>
        <p>Direction: {direction}</p>
        <p>X: {x.get().toFixed(2)}</p>
        <p>Y: {y.get().toFixed(2)}</p>
      </motion.div>
      <div className="mt-4 flex space-x-4">
        <div className="flex items-center">
          <InputIndicator type="wheel" />
          <span className="ml-2">Wheel</span>
        </div>
        <div className="flex items-center">
          <InputIndicator type="trackpad" />
          <span className="ml-2">Trackpad</span>
        </div>
        <div className="flex items-center">
          <InputIndicator type="touch" />
          <span className="ml-2">Touch</span>
        </div>
        <div className="flex items-center">
          <InputIndicator type="drag" />
          <span className="ml-2">Drag</span>
        </div>
      </div>
    </div>
  );
}