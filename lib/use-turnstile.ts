"use client";
// lib/use-turnstile.ts
// Loads an invisible Cloudflare Turnstile widget on the newsletter forms.
// Inert (no script load, no token) unless NEXT_PUBLIC_TURNSTILE_SITE_KEY is set.

import { useEffect, useRef, useState, type RefObject } from 'react';

export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      remove: (widgetId: string) => void;
    };
  }
}

let turnstileScriptPromise: Promise<void> | null = null;

/** Loads the Turnstile script once. No-op when no site key is configured. */
function loadTurnstileScript(): Promise<void> {
  if (!TURNSTILE_SITE_KEY) return Promise.resolve();
  if (turnstileScriptPromise) return turnstileScriptPromise;

  turnstileScriptPromise = new Promise((resolve, reject) => {
    if (window.turnstile) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Turnstile'));
    document.head.appendChild(script);
  });

  return turnstileScriptPromise;
}

/** Renders an invisible Turnstile widget and returns its token once solved. Inert when unconfigured. */
export function useTurnstileToken(): { token: string; containerRef: RefObject<HTMLDivElement> } {
  const [token, setToken] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !containerRef.current) return;

    let widgetId: string | undefined;
    let cancelled = false;

    loadTurnstileScript()
      .then(() => {
        if (cancelled || !window.turnstile || !containerRef.current) return;
        widgetId = window.turnstile.render(containerRef.current, {
          sitekey: TURNSTILE_SITE_KEY, // make it an Invisible widget in the Cloudflare dashboard
          callback: (t: string) => setToken(t),
          'expired-callback': () => setToken(''),
        });
      })
      .catch((err) => console.error('Turnstile load error:', err));

    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, []);

  return { token, containerRef };
}
