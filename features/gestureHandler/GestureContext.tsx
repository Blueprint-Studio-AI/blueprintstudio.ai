// @/features/gestureHandler/GestureContext.tsx
import React, { createContext, useState, useContext } from 'react';
import { GestureDirection, InputType } from './types';

interface GestureContextType {
  direction: GestureDirection;
  setDirection: (direction: GestureDirection) => void;
  activeInput: InputType;
  setActiveInput: (input: InputType) => void;
}

//context
const GestureContext = createContext<GestureContextType | undefined>(undefined);

//hook
export const useGestureContext = (): GestureContextType => {
  const context = useContext(GestureContext);
  if (context === undefined) {
    throw new Error('useGestureContext must be used within a GestureProvider');
  }
  return context;
};

export { GestureContext };