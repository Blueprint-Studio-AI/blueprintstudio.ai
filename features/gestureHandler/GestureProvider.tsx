// src/features/gestureHandler/GestureProvider.tsx
"use client";

import React, { useRef, useCallback, useState } from 'react';
// import { useMotionValue } from 'framer-motion';
import { GestureContext } from './index';
import { GestureContextType, GestureData, InputType } from './types';
import { useGestureHandlers } from './handlers';

export function GestureProvider({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const isActive = useRef(false);
  const [activeInputs, setActiveInputs] = useState<Set<InputType>>(new Set())

  const handleGestureChange = useCallback((data: GestureData) => {
    setX(data.x);
    setY(data.y);
    isActive.current = data.isActive;
  }, []);

  const activeInput = useCallback((inputType: InputType) => {
    setActiveInputs(prev => new Set(prev).add(inputType));
  }, [])

  useGestureHandlers(containerRef, {
    onGestureChange: handleGestureChange,
    activeInput,
  });

  const value: GestureContextType = {
    x,
    y,
    isActive,
    activeInputs,
  };

  return (
    <GestureContext.Provider value={value}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
        {children}
      </div>
    </GestureContext.Provider>
  );
};