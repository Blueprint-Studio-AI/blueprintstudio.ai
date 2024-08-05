// @/components/home/GestureTestBox.tsx
"use client";

import { motion } from 'framer-motion';
import { useGesture } from '@/contexts/GestureContext';
import { useEffect, useRef, useState } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right';
type Counts = Record<Direction, number>;

export default function GestureTestBox() {
  const { gestureType, direction, x, y, handlePanStart, handlePan, handlePanEnd, lastScrollEvent } = useGesture();
  const boxRef = useRef<HTMLDivElement>(null);
  const [counts, setCounts] = useState<Counts>({ up: 0, down: 0, left: 0, right: 0 });

  useEffect(() => {
    const box = boxRef.current;
    if (box) {
      box.style.transition = 'transform 0.1s ease-out';
    }
  }, []);

  useEffect(() => {
    const box = boxRef.current;
    if (box) {
      box.style.transform = `translate(${x.get()}px, ${y.get()}px)`;
    }

    // Increment counter based on direction
    if (direction) {
      setCounts(prev => ({
        ...prev,
        [direction]: prev[direction as Direction] + 1
      }));
    }
  }, [x, y, direction]);

  const CounterBox = ({ position, count }: { position: string; count: number }) => (
    <div className={`absolute ${position} w-16 h-16 bg-red-200 flex items-center justify-center text-2xl font-bold`}>
      {count}
    </div>
  );

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <div className="relative">
        <CounterBox position="top-0 left-1/2 -translate-x-1/2 -translate-y-full" count={counts.up} />
        <CounterBox position="bottom-0 left-1/2 -translate-x-1/2 translate-y-full" count={counts.down} />
        <CounterBox position="left-0 top-1/2 -translate-y-1/2 -translate-x-full" count={counts.left} />
        <CounterBox position="right-0 top-1/2 -translate-y-1/2 translate-x-full" count={counts.right} />
        
        <motion.div
          ref={boxRef}
          className="w-64 h-64 bg-blue-500 rounded-lg flex flex-col items-center justify-center text-white text-center"
          drag
          dragElastic={0.2}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          onDragStart={handlePanStart}
          onDrag={handlePan}
          onDragEnd={handlePanEnd}
        >
          <div>
            <p>Gesture: {gestureType}</p>
            <p>Direction: {direction || 'none'}</p>
            <p>X: {x.get().toFixed(2)}</p>
            <p>Y: {y.get().toFixed(2)}</p>
            {lastScrollEvent && (
              <div>
                <p>Last Scroll:</p>
                <p>deltaX: {lastScrollEvent.deltaX.toFixed(2)}</p>
                <p>deltaY: {lastScrollEvent.deltaY.toFixed(2)}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}