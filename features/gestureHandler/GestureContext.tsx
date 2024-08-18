// @/features/gestureHandler/GestureContext.tsx
"use client";

import { createContext, useContext } from 'react';

interface GestureContextType {
  goUp: () => void;
  goLeft: () => void;
  goRight: () => void;
  goDown: () => void;
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