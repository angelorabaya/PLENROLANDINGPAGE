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
import { isRateLimited } from '../lib/chat-core.mjs';
import { getCorsHeaders, jsonResponse, optionsResponse } from '../lib/http.mjs';

const POSTS_CACHE_KEY = 'plenro:facebook-posts:v1';
const POSTS_CACHE_TTL_SECONDS = 300;

function getPostsCache() {
  try {
    return (typeof caches !== 'undefined' && caches.default) || null;
  } catch {
    return null;
  }
}

async function readCachedPosts() {
  const cache = getPostsCache();
  if (!cache) return null;
  try {
    const res = await cache.match(POSTS_CACHE_KEY);
    if (!res) return null;
    const data = await res.json();
    return Array.isArray(data) ? data : null;
  } catch (e) {
    console.warn('Facebook posts cache read failed:', e);
    return null;
  }
}

async function writeCachedPosts(posts) {
  const cache = getPostsCache();
  if (!cache) return;
  try {
    await cache.put(
      POSTS_CACHE_KEY,
      new Response(JSON.stringify(posts), {
        headers: { 'Content-Type': 'application/json' },
      }),
      { expirationTtl: POSTS_CACHE_TTL_SECONDS }
    );
  } catch (e) {
    console.warn('Facebook posts cache write failed:', e);
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const corsHeaders = getCorsHeaders(request, {
    cacheControl: 'public, max-age=300, stale-while-revalidate=600',
  });

  // Durable rate limiting (KV-backed when bound, in-memory otherwise).
  const clientIp = request.headers.get('cf-connecting-ip') || 'unknown';
  if (await isRateLimited(env, clientIp, 'facebook')) {
    return jsonResponse(
      { error: 'Too many requests. Please try again later.' },
      429,
      corsHeaders
    );
  }

  const pageId = env.FACEBOOK_PAGE_ID;
  const accessToken = env.FACEBOOK_ACCESS_TOKEN;

  if (!pageId || !accessToken) {
    return jsonResponse(
      { error: 'Facebook feed is not configured (missing FACEBOOK_PAGE_ID or FACEBOOK_ACCESS_TOKEN).' },
      500,
      corsHeaders
    );
  }

  // Serve from the edge cache when possible so repeat visits do not re-hit
  // the Graph API on every client request.
  const cached = await readCachedPosts();
  if (cached) {
    return jsonResponse({ posts: cached }, 200, corsHeaders);
  }

  try {
    const { posts } = await fetchPagePosts(pageId, accessToken, { limit: 10 });
    await writeCachedPosts(posts);
    return jsonResponse({ posts }, 200, corsHeaders);
  } catch (err) {
    console.error('Facebook posts proxy error:', err);
    return jsonResponse(
      { error: 'Failed to load Facebook posts. Please try again later.' },
      502,
      corsHeaders
    );
  }
}

export async function onRequestOptions(context) {
  const { request } = context;
  const corsHeaders = getCorsHeaders(request);
  return optionsResponse(corsHeaders);
}
