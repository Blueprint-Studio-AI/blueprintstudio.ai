// components/AutoplayVideo.tsx
import { useEffect, useRef, useState } from 'react';
import { motion } from "framer-motion";
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils'

interface AutoplayVideoProps {
  src: string;
  className?: string;
}

const animateVideoReset = (
  videoElement: HTMLVideoElement, 
  startTime: number,
  duration: number = 500
) => {
  const startTimestamp = performance.now();

  const animate = (currentTimestamp: number) => {
    const elapsed = currentTimestamp - startTimestamp;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out cubic function for smooth deceleration
    const easeOut = 1 - Math.pow(1 - progress, 3);
    videoElement.currentTime = startTime * (1 - easeOut);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

// Update AutoplayVideo component:
export function AutoplayVideo({ src, className }: AutoplayVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [containerRef, isIntersecting] = useIntersectionObserver({
    threshold: 0.5,
  });

  useEffect(() => {
    const video = videoRef.current;
    const fadeElement = fadeRef.current;
    if (!video || !fadeElement) return;

    if (isIntersecting) {
      fadeElement.style.opacity = '0';
      video.play().catch(error => {
        console.log('Autoplay failed:', error);
      });
    } else {
      fadeElement.style.opacity = '1';
      video.pause();
      animateVideoReset(video, video.currentTime);
    }
  }, [isIntersecting]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleReady = () => setIsLoading(false);

    video.addEventListener('loadeddata', handleReady);
    video.addEventListener('canplay', handleReady);
    video.addEventListener('playing', handleReady);

    if (video.readyState >= 3) {
      handleReady();
    }

    return () => {
      video.removeEventListener('loadeddata', handleReady);
      video.removeEventListener('canplay', handleReady);
      video.removeEventListener('playing', handleReady);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div 
        className={cn(
          "absolute inset-0 bg-gray-100/80 backdrop-blur-sm transition-opacity duration-500",
          isLoading ? "opacity-100" : "opacity-0"
        )}
      />
      <video
        ref={videoRef}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-500",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        src={src}
        playsInline
        muted
        loop
        preload="metadata"
      />
      <div 
        ref={fadeRef}
        className="absolute inset-0 bg-background/80 pointer-events-none transition-opacity duration-500"
        style={{ opacity: 0 }}
      />
    </div>
  );
}