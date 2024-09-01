// @/components/home/GestureTestBox2.tsx
"use client";

import { useGestureContext } from '@/features/GestureHandler/useGestureContext';
import { useGestureAction } from '@/features/GestureHandler/useGestureAction';
import { motion } from 'framer-motion';
import { useCallback } from 'react';

export default function GestureTestBox2() {
  const { goUp, goLeft, goRight, goDown, x, y } = useGestureContext();

  const handleUp = useCallback(() => {
    console.log('Gesture went up!');
    // Add your custom logic here
  }, []);

  const handleLeft = useCallback(() => {
    console.log('Gesture went left!');
    // Add your custom logic here
  }, []);

  const handleRight = useCallback(() => {
    console.log('Gesture went right!');
    // Add your custom logic here
  }, []);

  const handleDown = useCallback(() => {
    console.log('Gesture went down!');
    // Add your custom logic here
  }, []);

  useGestureAction('up', handleUp);
  useGestureAction('left', handleLeft);
  useGestureAction('right', handleRight);
  useGestureAction('down', handleDown);

  return (
    <div className="h-svh w-screen flex flex-col items-center justify-center bg-gray-100">
      <motion.div style={{ x, y }} className="absolute w-32 h-32 bg-red-500 rounded-full"/>
      <div className="w-64 h-64 bg-blue-500 rounded-lg flex flex-col items-center justify-center text-white text-center">
        <button onClick={goUp}>Go Up</button>
        <button onClick={goLeft}>Go Left</button>
        <button onClick={goRight}>Go Right</button>
        <button onClick={goDown}>Go Down</button>
      </div>
    </div>
  );
}