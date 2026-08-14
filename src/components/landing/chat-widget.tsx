'use client';

import dynamic from 'next/dynamic';

const OrdinanceChat = dynamic(() => import('./ordinance-chat'), {
  ssr: false,
});

/**
 * Client-only loader for the floating chat widget. `ssr: false` keeps the
 * widget and its chunk out of the initial HTML/bundle, loading it on demand
 * after hydration instead.
 */
export default function ChatWidget() {
  return <OrdinanceChat />;
}
