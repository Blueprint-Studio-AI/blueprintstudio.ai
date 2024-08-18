// @/features/gestureHandler/GestureProvider.tsx
"use client";

import React, { useRef, useState, useEffect } from 'react';
import { GestureContext } from './GestureContext';
import { useScrollHandler } from './handlers/scrollHandler';
import { GestureDirection, InputType } from './types';

export function GestureProvider({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const goUp = () => {
    console.log('Go Up');
  }

  const goLeft = () => {
    console.log('Go Left');
  }

  const goRight = () => {
    console.log('Go Right');
  }

  const goDown = () => {
    console.log('Go Down');
  }

  const value = {
    goUp,
    goLeft,
    goRight,
    goDown,
  };

  useScrollHandler(containerRef);

  return (
    <GestureContext.Provider value={value}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
        {children}
      </div>
    </GestureContext.Provider>
  );
}