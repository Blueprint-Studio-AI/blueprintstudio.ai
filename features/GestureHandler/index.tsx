// @/features/GestureHandler/index.tsx
import { ReactNode, useCallback, useRef } from "react";
import { GestureContext, GestureContextValue } from "./GestureContext";
import Handlers from './Handlers';
import { AnimationPlaybackControls, useMotionValue } from "framer-motion";
import { smoothMotion } from "./utils/smoothMotion";
import { GestureDirection } from "./types";
import React from 'react';

export default function GestureHandler({ children }: {children: ReactNode}) {

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const isActive = useMotionValue(false);

    const subscribersRef = useRef<Map<GestureDirection, Set<() => void>>>(new Map());

    const triggerSubscribers = useCallback((action: GestureDirection) => {
        const subscribers = subscribersRef.current.get(action);
        subscribers?.forEach(callback => callback());
      }, []);

    const xAnimation = useRef<AnimationPlaybackControls | null>(null);
    const yAnimation = useRef<AnimationPlaybackControls | null>(null);

    const goUp = useCallback(() => {
      console.log('Go Up');
      triggerSubscribers('up');
    }, [triggerSubscribers]);
  
    const goLeft = useCallback(() => {
      console.log('Go Left');
      triggerSubscribers('left');
    }, [triggerSubscribers]);
  
    const goRight = useCallback(() => {
      console.log('Go Right');
      triggerSubscribers('right');
    }, [triggerSubscribers]);
  
    const goDown = useCallback(() => {
      console.log('Go Down');
      triggerSubscribers('down');
    }, [triggerSubscribers]);

    const updateGesturePosition = useCallback((newX: number, newY: number) => {
         // Stop any ongoing animations
        xAnimation.current?.stop();
        yAnimation.current?.stop();

        if (isActive.get()) {
            // If gesture is active, update immediately
            x.set(newX);
            y.set(newY);
        } else {
            // If gesture is not active (i.e., returning to origin)

            xAnimation.current = smoothMotion(x, newX);
            yAnimation.current = smoothMotion(y, newY);

            // xAnimation.current = animate(x, newX, {
            //     type: "tween",
            //     duration: 0.1,
            //     ease: "linear"
            // });
            // yAnimation.current = animate(y, newY, {
            //     type: "tween",
            //     duration: 0.1,
            //     ease: "linear"
            // });
        }
    }, [x, y, isActive]);

    const setGestureActive = useCallback((active: boolean) => {
        isActive.set(active);
        if (active) {
            // If a new gesture starts, stop any ongoing return-to-origin animations
            xAnimation.current?.stop();
            yAnimation.current?.stop();
        }
    }, [isActive]);

    const subscribeToGesture = useCallback((action: GestureDirection, callback: () => void) => {
        if (!subscribersRef.current.has(action)) {
          subscribersRef.current.set(action, new Set());
        }
        subscribersRef.current.get(action)!.add(callback);
    
        return () => {
          subscribersRef.current.get(action)?.delete(callback);
        };
      }, []);

    const gestureContextValue: GestureContextValue = {
    x,
    y,
    isActive,
    goUp,
    goLeft,
    goRight,
    goDown,
    setGestureActive,
    updateGesturePosition,
    subscribeToGesture
    };

    return (
        <GestureContext.Provider value={gestureContextValue}>
            <Handlers>
                {children}
            </Handlers>
        </GestureContext.Provider>
    );
}