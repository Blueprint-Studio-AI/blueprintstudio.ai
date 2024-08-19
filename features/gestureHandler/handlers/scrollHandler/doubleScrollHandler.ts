type ScrollData = { x: number; y: number; isActive: boolean };
type Direction = 'up' | 'down' | 'left' | 'right';

export function doubleScrollHandler(
  scrollData: ScrollData,
  currentDirection: Direction,
  callback: (direction: Direction) => void
) {
  // State to be preserved between function calls
  let prevScrollData: ScrollData | null = null;
  let prevDirection: Direction | null = null;
  let consecutiveScrolls = 0;

  // Constants
  const DIP_THRESHOLD = 0.5; // Adjust this value based on your needs
  const CONSECUTIVE_SCROLL_THRESHOLD = 2; // Number of consecutive scrolls to trigger callback

  return function() {
    if (!prevScrollData) {
      prevScrollData = scrollData;
      prevDirection = currentDirection;
      return;
    }

    const isDip = (
      Math.abs(scrollData.x) < Math.abs(prevScrollData.x) * DIP_THRESHOLD ||
      Math.abs(scrollData.y) < Math.abs(prevScrollData.y) * DIP_THRESHOLD
    );

    if (isDip && currentDirection === prevDirection) {
      consecutiveScrolls++;
      if (consecutiveScrolls >= CONSECUTIVE_SCROLL_THRESHOLD) {
        callback(currentDirection);
        consecutiveScrolls = 0; // Reset after callback
      }
    } else {
      consecutiveScrolls = 0; // Reset on direction change or no dip
    }

    prevScrollData = scrollData;
    prevDirection = currentDirection;
  };
}