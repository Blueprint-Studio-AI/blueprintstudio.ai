'use client';

import { useState, useEffect, useRef } from 'react';

const SCRAMBLE_CHARS = '0123456789./-';
const SCRAMBLE_DURATION = 600;
const HOVER_SCRAMBLE_DURATION = 400;

interface AnimatedDateProps {
  startDelay?: number;
}

export default function AnimatedDate({ startDelay = 0 }: AnimatedDateProps) {
  const [displayText, setDisplayText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const scrambleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const now = new Date();
  const targetDate = now.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '.');

  // Show Unix timestamp on hover
  const hoverText = Math.floor(now.getTime() / 1000).toString();

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
        setIsTransitioning(false);
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

  // Handle hover state change
  useEffect(() => {
    if (!isVisible) return; // Don't animate if not yet visible

    const newText = isHovering ? hoverText : targetDate;
    const from = displayText || targetDate;

    setIsTransitioning(true);
    scrambleText(from, newText, HOVER_SCRAMBLE_DURATION);
  }, [isHovering]);

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
      className={`cursor-default transition-opacity duration-500 ${
        isVisible ? (isTransitioning ? 'opacity-90' : 'opacity-100') : 'opacity-0'
      }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        fontFeatureSettings: '"tnum"',
        letterSpacing: isHovering ? '-0.32px' : '-0.24px',
        minWidth: '120px'
      }}
    >
      {displayText}
    </span>
  );
}