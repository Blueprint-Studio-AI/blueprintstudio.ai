import { useState, useCallback } from 'react';

export function useThresholdManager(threshold: number) {
  const [progress, setProgress] = useState(0);

  const updateProgress = useCallback((offset: number) => {
    setProgress(Math.min(Math.abs(offset) / threshold, 1));
  }, [threshold]);

  const isThresholdReached = useCallback(() => progress >= 1, [progress]);

  return { progress, updateProgress, isThresholdReached };
}