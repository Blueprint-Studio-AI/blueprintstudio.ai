// @/features/gestureHandler/handlers/keyHandler.ts

import { useEffect, useContext } from 'react';
import { GestureContext } from '../../GestureContext';

export const useKeyHandler = () => {
  const { goUp, goLeft, goRight, goDown } = useContext(GestureContext);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          goUp();
          break;
        case 'ArrowDown':
          event.preventDefault();
          goDown();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          goLeft();
          break;
        case 'ArrowRight':
          event.preventDefault();
          goRight();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [goUp, goDown, goLeft, goRight]);
};