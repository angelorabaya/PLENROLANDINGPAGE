/**
 * Shared HTTP helpers for the Cloudflare Pages Functions.
 * Pure and platform-agnostic — only relies on a `request` object exposing
 * `headers.get`, so the same code runs in the Workers runtime and Node tests.
 */

const ALLOWED_ORIGIN = 'https://plenro.pages.dev';

function isAllowedOrigin(origin) {
  return (
    origin.startsWith('http://localhost:') ||
    origin.startsWith('http://127.0.0.1:') ||
    origin === ALLOWED_ORIGIN ||
    /\.plenro\.pages\.dev$/.test(origin)
  );
}

/**
 * Build CORS headers locked to plenro.pages.dev, its subdomains, and local
 * development. When `cacheControl` is provided it is added as a
 * Cache-Control header on the same response.
 * @param {{ headers: { get: (name: string) => string | null } }} [request]
 * @param {{ cacheControl?: string }} [options]
 * @returns {Record<string, string>}
 */
export function getCorsHeaders(request, { cacheControl } = {}) {
  const origin = request?.headers?.get?.('Origin') || '';
  const corsOrigin = isAllowedOrigin(origin) ? origin : ALLOWED_ORIGIN;

  const headers = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };

  if (cacheControl) {
    headers['Cache-Control'] = cacheControl;
  }

  return headers;
}

/**
 * Build a JSON Response with CORS + content-type headers.
 * @param {unknown} payload
 * @param {number} status
 * @param {Record<string, string>} corsHeaders
 * @returns {Response}
 */
export function jsonResponse(payload, status, corsHeaders) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

/**
 * Build a 204 Response for OPTIONS preflight requests.
 * @param {Record<string, string>} corsHeaders
 * @returns {Response}
 */
export function optionsResponse(corsHeaders) {
  return new Response(null, { status: 204, headers: corsHeaders });
}
