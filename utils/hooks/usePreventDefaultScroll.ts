import { useEffect } from 'react';

export function usePreventDefaultScroll() {
  useEffect(() => {
    const preventDefault = (e: Event) => {
      e.preventDefault();
    };

    document.body.addEventListener('touchmove', preventDefault, { passive: false });
    document.body.addEventListener('wheel', preventDefault, { passive: false });

    return () => {
      document.body.removeEventListener('touchmove', preventDefault);
      document.body.removeEventListener('wheel', preventDefault);
    };
  }, []);
}