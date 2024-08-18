// @/components/home/GestureTestBox2.tsx
"use client";

import { useGestureContext } from '@/features/gestureHandler/GestureContext';
import { GestureDirection, InputType } from '@/features/gestureHandler/types';
import { useEffect, useState } from 'react';

export default function GestureTestBox2() {
  const { goUp, goLeft, goRight, goDown } = useGestureContext();

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-64 h-64 bg-blue-500 rounded-lg flex flex-col items-center justify-center text-white text-center">
        <button onClick={goUp}>Go Up</button>
        <button onClick={goLeft}>Go Left</button>
        <button onClick={goRight}>Go Right</button>
        <button onClick={goDown}>Go Down</button>
      </div>
    </div>
  );
}