/**
 * Cloudflare Pages Function — Facebook Page posts proxy.
 *
 * Serves POST /api/facebook-posts by fetching the page's latest posts through
 * the Facebook Graph API server-side, keeping the access token secret.
 * (POST is used so it matches the dev-only Next.js route handler, which must be
 * POST to remain compatible with the site's static `output: 'export'`.)
 *
 * Environment variables (Cloudflare Pages dashboard or .env.local for dev):
 *  - FACEBOOK_PAGE_ID        (required) — e.g. 789005134298348
 *  - FACEBOOK_ACCESS_TOKEN   (required) — Page Access Token (EAA...)
 *
 * See docs/facebook-feed-setup.md for how to create the app + token.
 */

import { fetchPagePosts } from '../lib/facebook-posts.mjs';

// CORS helper — same origin policy as the chat function.
function getCorsHeaders(request) {
  const origin = request.headers.get('Origin');
  let corsOrigin = 'https://plenro.pages.dev';
  if (origin) {
    if (
      origin.startsWith('http://localhost:') ||
      origin.startsWith('http://127.0.0.1:') ||
      origin === 'https://plenro.pages.dev' ||
      /\.plenro\.pages\.dev$/.test(origin)
    ) {
      corsOrigin = origin;
    }
  }
  return {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
  };
}

function jsonResponse(payload, status, corsHeaders) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const corsHeaders = getCorsHeaders(request);

  const pageId = env.FACEBOOK_PAGE_ID;
  const accessToken = env.FACEBOOK_ACCESS_TOKEN;

  if (!pageId || !accessToken) {
    return jsonResponse(
      { error: 'Facebook feed is not configured (missing FACEBOOK_PAGE_ID or FACEBOOK_ACCESS_TOKEN).' },
      500,
      corsHeaders
    );
  }

  try {
    const { posts } = await fetchPagePosts(pageId, accessToken, { limit: 10 });
    return jsonResponse({ posts }, 200, corsHeaders);
  } catch (err) {
    console.error('Facebook posts proxy error:', err);
    return jsonResponse(
      { error: err instanceof Error ? err.message : 'Failed to load Facebook posts.' },
      502,
      corsHeaders
    );
  }
}

export async function onRequestOptions(context) {
  const { request } = context;
  const corsHeaders = getCorsHeaders(request);
  return new Response(null, { status: 204, headers: corsHeaders });
}
