// @/components/home/GestureTestBox2.tsx
"use client";

import { useGestureContext } from '@/features/gestureHandler/GestureContext';
import { GestureDirection, InputType } from '@/features/gestureHandler/types';
import { useEffect, useState } from 'react';

export default function GestureTestBox2() {
  const { direction, activeInput } = useGestureContext();

  const [lastDirection, setLastDirection] = useState<GestureDirection>(null);

  useEffect(() => {
    if (direction !== null) {
      setLastDirection(direction);
    }
  }, [direction]);

  const InputIndicator = ({ type }: { type: InputType }) => (
    <div className={`w-4 h-4 rounded-full ${activeInput === type ? 'bg-green-500' : 'bg-gray-300'}`}></div>
  );

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-64 h-64 bg-blue-500 rounded-lg flex flex-col items-center justify-center text-white text-center">
        <p>Current Direction: {direction || 'None'}</p>
        <p>Last Direction: {lastDirection || 'None'}</p>
        <p>Active Input: {activeInput || 'None'}</p>
      </div>
      <div className="mt-4 flex space-x-4">
        <div className="flex items-center">
          <InputIndicator type="wheel" />
          <span className="ml-2">Wheel</span>
        </div>
        <div className="flex items-center">
          <InputIndicator type="touch" />
          <span className="ml-2">Touch</span>
        </div>
        <div className="flex items-center">
          <InputIndicator type="mouse" />
          <span className="ml-2">Mouse</span>
        </div>
        <div className="flex items-center">
          <InputIndicator type="key" />
          <span className="ml-2">Keyboard</span>
        </div>
      </div>
    </div>
  );
}