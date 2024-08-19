// @/features/gestureHandler/GestureContext.tsx
"use client";

import { createContext } from 'react';
import React from 'react';

export interface GestureContextValue {
  goUp: () => void;
  goLeft: () => void;
  goRight: () => void;
  goDown: () => void;
}

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

export const gestureContextValue = {
  goUp,
  goLeft,
  goRight,
  goDown,
};

// export const GestureContext = React.createContext<GestureContextValue>({goUp: ()=>{}, goLeft: ()=>{}, goRight: ()=>{}, goDown: ()=>{}, });