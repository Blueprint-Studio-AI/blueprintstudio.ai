// @/features/GestureHandler/Handlers/touchHandler/tapHandler.ts

const CLICK_THRESHOLD = 10; // pixels
const CLICK_TIMEOUT = 200; // milliseconds

interface TapHandlerResult {
  isTap: boolean;
  isClickableElement: boolean;
}

export function handleTap(event: TouchEvent): TapHandlerResult {
  const touch = event.touches[0] || event.changedTouches[0];
  const isClickableElement = (event.target as HTMLElement).tagName.toLowerCase() === 'button' ||
                             (event.target as HTMLElement).tagName.toLowerCase() === 'a';

  if (event.type === 'touchstart') {
    (event.currentTarget as any).touchStartX = touch.clientX;
    (event.currentTarget as any).touchStartY = touch.clientY;
    (event.currentTarget as any).touchStartTime = Date.now();
    return { isTap: false, isClickableElement };
  }

  if (event.type === 'touchend') {
    const deltaX = Math.abs(touch.clientX - (event.currentTarget as any).touchStartX);
    const deltaY = Math.abs(touch.clientY - (event.currentTarget as any).touchStartY);
    const deltaTime = Date.now() - (event.currentTarget as any).touchStartTime;

    const isTap = deltaX < CLICK_THRESHOLD && deltaY < CLICK_THRESHOLD && deltaTime < CLICK_TIMEOUT;

    return { isTap, isClickableElement };
  }

  return { isTap: false, isClickableElement };
}