'use client';

import Script from 'next/script';

/**
 * Privacy-friendly Cloudflare Web Analytics beacon.
 *
 * Cloudflare Web Analytics is cookie-less and does not require a consent
 * banner. Set NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN in the build environment to
 * enable it (token is inlined at build time by Next.js for NEXT_PUBLIC_ vars).
 */
export default function Analytics() {
  const token = process.env.NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN;
  if (!token) return null;

  return (
    <Script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={`{"token": "${token}"}`}
      strategy="afterInteractive"
    />
  );
}
