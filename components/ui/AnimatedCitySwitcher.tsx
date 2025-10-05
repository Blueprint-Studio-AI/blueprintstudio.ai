'use client';

import { useState, useEffect, useRef } from 'react';

interface City {
  name: string;
  state: string;
  coordinates: {
    lat: string;
    lng: string;
  };
}

const cities: City[] = [
  {
    name: "Los Angeles",
    state: "California",
    coordinates: {
      lat: "34.0522°N",
      lng: "118.2437°W"
    }
  },
  {
    name: "New York",
    state: "New York",
    coordinates: {
      lat: "40.7128°N",
      lng: "74.0060°W"
    }
  },
  {
    name: "San Francisco",
    state: "California",
    coordinates: {
      lat: "37.7749°N",
      lng: "122.4194°W"
    }
  },
  {
    name: "Salt Lake City",
    state: "Utah",
    coordinates: {
      lat: "40.7608°N",
      lng: "111.8910°W"
    }
  }
];

const SCRAMBLE_CHARS = '0123456789.°NW-';
const TRANSITION_DURATION = 300;
const SCRAMBLE_DURATION = 500;
const CYCLE_INTERVAL = 6000;

interface AnimatedCitySwitcherProps {
  startDelay?: number;
}

export default function AnimatedCitySwitcher({ startDelay = 0 }: AnimatedCitySwitcherProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const scrambleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const currentCity = cities[currentIndex];
  const targetText = isHovering
    ? `${currentCity.coordinates.lat}, ${currentCity.coordinates.lng}`
    : `${currentCity.name}, ${currentCity.state}`;

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

  // Handle hover state
  useEffect(() => {
    const from = displayText || `${cities[0].name}, ${cities[0].state}`;
    setIsTransitioning(true);
    scrambleText(from, targetText, isHovering ? SCRAMBLE_DURATION : TRANSITION_DURATION);
  }, [isHovering, currentIndex]);

  // Auto-cycle through cities
  useEffect(() => {
    if (!isHovering) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % cities.length);
      }, CYCLE_INTERVAL);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovering]);

  // Initialize with scramble animation after delay
  useEffect(() => {
    const initialText = `${cities[0].name}, ${cities[0].state}`;
    const scrambledStart = initialText.split('').map(() =>
      SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
    ).join('');

    setTimeout(() => {
      setIsVisible(true);
      setDisplayText(scrambledStart);
      setTimeout(() => {
        scrambleText(scrambledStart, initialText, SCRAMBLE_DURATION);
      }, 100);
    }, startDelay);
  }, [startDelay]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (scrambleIntervalRef.current) {
        clearInterval(scrambleIntervalRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Hidden elements for SEO */}
      <div className="sr-only">
        {cities.map((city, idx) => (
          <span key={idx}>{city.name}, {city.state}</span>
        ))}
      </div>

      {/* Visible animated text */}
      <span
        className={`inline-block cursor-pointer transition-opacity duration-500 ${
          isVisible ? (isTransitioning ? 'opacity-90' : 'opacity-100') : 'opacity-0'
        }`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{
          fontFeatureSettings: '"tnum"',
          letterSpacing: isHovering ? '-0.32px' : '-0.24px',
          minWidth: '200px'
        }}
      >
        {displayText}
      </span>
    </>
  );
}