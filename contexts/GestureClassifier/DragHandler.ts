import { useCallback } from 'react';
import { PanInfo } from 'framer-motion';

export function useDragHandler(onDrag: (offsetX: number, offsetY: number) => void) {
  const handleDragStart = useCallback(() => {
    // Reset any necessary state
  }, []);

  const handleDrag = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset } = info;
    onDrag(offset.x, offset.y);
  }, [onDrag]);

  const handleDragEnd = useCallback(() => {
    // Perform any necessary cleanup
  }, []);

  return { handleDragStart, handleDrag, handleDragEnd };
}