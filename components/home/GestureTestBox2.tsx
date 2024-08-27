// @/components/home/GestureTestBox2.tsx
"use client";

// import { GestureContext, GestureContextValue } from '@/features/gestureHandler/GestureContext';
import { GestureDirection, InputType } from '@/features/GestureHandler/types';
import { useEffect, useState, useContext, useRef } from 'react';
import { useScrollHandler } from '@/features/GestureHandler/Handlers/scrollHandler';
import { GestureContext } from '@/features/GestureHandler/GestureContext';

export default function GestureTestBox2() {
  const { goUp, goLeft, goRight, goDown } = useContext(GestureContext);

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