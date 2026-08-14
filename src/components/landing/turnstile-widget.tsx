'use client';

import { useEffect, useRef } from 'react';

const SITE_KEY = process.env.NEXT_PUBLIC_CF_TURNSTILE_SITE_KEY;

type TurnstileApi = {
  render: (
    element: HTMLElement,
    options: { sitekey: string; callback: (token: string) => void }
  ) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

interface TurnstileWidgetProps {
  onToken: (token: string) => void;
}

/**
 * Loads and renders the Cloudflare Turnstile widget. When no site key is
 * configured the component renders nothing and the contact form continues to
 * work with honeypot + rate limiting only.
 */
export default function TurnstileWidget({ onToken }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onTokenRef = useRef(onToken);

  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    if (!SITE_KEY || !containerRef.current) return;

    let widgetId: string | undefined;
    let scriptEl: HTMLScriptElement | undefined;

    const renderWidget = () => {
      if (!window.turnstile || !containerRef.current) return;
      widgetId = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        callback: (token: string) => onTokenRef.current(token),
      });
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      scriptEl = document.createElement('script');
      scriptEl.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      scriptEl.async = true;
      scriptEl.defer = true;
      scriptEl.onload = renderWidget;
      document.head.appendChild(scriptEl);
    }

    return () => {
      if (widgetId && window.turnstile) {
        try {
          window.turnstile.remove(widgetId);
        } catch {
          // widget may already be gone
        }
      }
      if (scriptEl && scriptEl.parentNode) {
        scriptEl.parentNode.removeChild(scriptEl);
      }
    };
  }, []);

  if (!SITE_KEY) return null;

  return <div ref={containerRef} className="mt-4" aria-hidden="true" />;
}
