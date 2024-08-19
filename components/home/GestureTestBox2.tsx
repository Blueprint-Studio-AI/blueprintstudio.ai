// @/components/home/GestureTestBox2.tsx
"use client";

// import { GestureContext, GestureContextValue } from '@/features/gestureHandler/GestureContext';
import { GestureDirection, InputType } from '@/features/gestureHandler/types';
import { useEffect, useState, useContext, useRef } from 'react';
import { GestureContext } from '@/app/page';
import { useScrollHandler } from '@/features/gestureHandler/handlers/scrollHandler';

export default function GestureTestBox2() {
  const { goUp, goLeft, goRight, goDown } = useContext(GestureContext);

  const viewportRef = useRef<HTMLDivElement>(null);

  useScrollHandler(viewportRef);

  return (
    <div ref={viewportRef} className="h-screen w-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-64 h-64 bg-blue-500 rounded-lg flex flex-col items-center justify-center text-white text-center">
        <button onClick={goUp}>Go Up</button>
        <button onClick={goLeft}>Go Left</button>
        <button onClick={goRight}>Go Right</button>
        <button onClick={goDown}>Go Down</button>
      </div>
    </div>
  );
}

// const containerRef = useRef<HTMLDivElement>(null);
// useScrollHandler(containerRef);