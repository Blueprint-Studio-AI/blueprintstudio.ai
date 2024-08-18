// @/features/gestureHandler/GestureProvider.tsx
"use client";

import React, { useRef, useState } from 'react';
import { GestureContext } from './GestureContext';
import { useScrollHandler } from './handlers/scrollHandler';
import { GestureDirection, InputType } from './types';

export function GestureProvider({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState<GestureDirection>(null);
  const [activeInput, setActiveInput] = useState<InputType>(null);

  // useScrollHandler(containerRef);

  const value = {
    direction,
    setDirection,
    activeInput,
    setActiveInput,
  };

  return (
    <GestureContext.Provider value={value}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
        {children}
      </div>
    </GestureContext.Provider>
  );
}