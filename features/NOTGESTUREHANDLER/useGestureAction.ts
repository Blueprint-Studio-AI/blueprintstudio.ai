// @/features/GestureHandler/useGestureAction.ts
import { useEffect } from 'react';
import { useGestureContext } from './useGestureContext';
import { GestureDirection } from './types';

export function useGestureAction(action: GestureDirection, callback: () => void) {
  const { subscribeToGesture } = useGestureContext();

  useEffect(() => {
    const unsubscribe = subscribeToGesture(action, callback);
    return () => {
      unsubscribe();
    };
  }, [action, callback, subscribeToGesture]);
}