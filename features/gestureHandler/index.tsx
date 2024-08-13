// src/features/gestureHandler/index.tsx
"use client";

import { createContext, useContext } from 'react';
import { GestureProvider as GestureProviderComponent } from './GestureProvider';
import { GestureContextType } from './types';

// Context
export const GestureContext = createContext<GestureContextType | undefined>(undefined);

// Provider
export const GestureProvider = GestureProviderComponent;

// Hook
export const useGestureContext = () => {
  const context = useContext(GestureContext);
  if (context === undefined) {
    throw new Error('useGestureContext must be used within a GestureProvider');
  }
  return context;
};

// Types
export type { GestureContextType, InputType } from './types';