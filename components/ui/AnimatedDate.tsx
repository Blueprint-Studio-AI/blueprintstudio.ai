'use client';

import { useState, useEffect, useRef } from 'react';

const SCRAMBLE_CHARS = '0123456789./-';
const SCRAMBLE_DURATION = 600;

interface AnimatedDateProps {
  startDelay?: number;
}

export default function AnimatedDate({ startDelay = 0 }: AnimatedDateProps) {
  const [displayText, setDisplayText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const scrambleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const targetDate = new Date().toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '.');

  // Scramble animation function
  const scrambleText = (from: string, to: string, duration: number) => {
    const startTime = Date.now();
    const fromLength = from.length;
    const toLength = to.length;
    const maxLength = Math.max(fromLength, toLength);

    if (scrambleIntervalRef.current) {
      clearInterval(scrambleIntervalRef.current);
    }

    scrambleIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      if (progress === 1) {
        setDisplayText(to);
        if (scrambleIntervalRef.current) {
          clearInterval(scrambleIntervalRef.current);
        }
        return;
      }

      // Create scrambled text
      let scrambled = '';
      for (let i = 0; i < maxLength; i++) {
        const targetChar = i < toLength ? to[i] : '';
        const sourceChar = i < fromLength ? from[i] : '';

        // Progressively reveal characters
        const charProgress = (progress * maxLength - i) / 1;

        if (charProgress >= 1) {
          scrambled += targetChar;
        } else if (charProgress > 0) {
          // Scrambling zone
          if (Math.random() < 0.8) {
            scrambled += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          } else {
            scrambled += targetChar;
          }
        } else {
          scrambled += sourceChar;
        }
      }

      setDisplayText(scrambled);
    }, 25);
  };

  // Initialize with scramble animation after delay
  useEffect(() => {
    const scrambledStart = targetDate.split('').map(() =>
      SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
    ).join('');

    setTimeout(() => {
      setIsVisible(true);
      setDisplayText(scrambledStart);
      setTimeout(() => {
        scrambleText(scrambledStart, targetDate, SCRAMBLE_DURATION);
      }, 150); // Slight delay after city animation starts
    }, startDelay);
  }, [startDelay, targetDate]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (scrambleIntervalRef.current) {
        clearInterval(scrambleIntervalRef.current);
      }
    };
  }, []);

  return (
    <span
      className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{
        fontFeatureSettings: '"tnum"'
      }}
    >
      {displayText}
    </span>
  );
}