// src/features/gestureHandler/GestureProvider.tsx
"use client";

import React, { useRef, useState, useCallback } from 'react';
import { useMotionValue } from 'framer-motion';
import { GestureContext } from './index';
import { GestureContextType, InputType } from './types';
import { useGestureHandlers } from './handlers';
import { classifyGesture } from './utils/gestureClassifier';

export const GestureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [gestureType, setGestureType] = useState('none');
  const [direction, setDirection] = useState('none');
  const [activeInputs, setActiveInputs] = useState<Set<InputType>>(new Set());

  const activateInput = useCallback((inputType: InputType) => {
    setActiveInputs(prev => new Set(prev).add(inputType));
    setTimeout(() => {
      setActiveInputs(prev => {
        const newSet = new Set(prev);
        newSet.delete(inputType);
        return newSet;
      });
    }, 500);
  }, []);

  const handleGestureChange = useCallback(() => {
    const { gestureType: newGestureType, direction: newDirection } = classifyGesture(x, y);
    setGestureType(newGestureType);
    setDirection(newDirection);
  }, [x, y]);

  useGestureHandlers(containerRef, {
    x,
    y,
    activateInput,
    onGestureChange: handleGestureChange,
  });

  const value: GestureContextType = {
    gestureType,
    direction,
    x,
    y,
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