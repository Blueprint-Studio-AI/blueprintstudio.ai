// components/AutoplayVideo.tsx
import { useEffect, useRef } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils'

interface AutoplayVideoProps {
  src: string;
  className?: string;
}

// Move animation function outside and make it reusable
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

export function AutoplayVideo({ src, className }: AutoplayVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const [containerRef, isIntersecting] = useIntersectionObserver({
    threshold: 0.5,
  });

  useEffect(() => {
    const videoElement = videoRef.current;
    const fadeElement = fadeRef.current;
    if (!videoElement || !fadeElement) return;

    if (isIntersecting) {
      fadeElement.style.opacity = '0';
      videoElement.play().catch(error => {
        console.log('Autoplay failed:', error);
      });
    } else {
      fadeElement.style.opacity = '1';
      videoElement.pause();
      
      // Call animation function with current video time
      animateVideoReset(videoElement, videoElement.currentTime);
    }
  }, [isIntersecting]);

  return (
    <div ref={containerRef} className="relative">
      <video
        ref={videoRef}
        className={cn("w-full h-auto", className)}
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