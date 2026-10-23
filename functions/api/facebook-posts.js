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
 *  - FACEBOOK_API_VERSION    (optional) — Graph API version, e.g. v23.0
 *
 * See docs/facebook-feed-setup.md for how to create the app + token.
 */

import { fetchPagePosts, resolveApiVersion } from '../lib/facebook-posts.mjs';
import { isRateLimited } from '../lib/chat-core.mjs';
import { getCorsHeaders, jsonResponse, optionsResponse } from '../lib/http.mjs';

const POSTS_CACHE_KEY = 'plenro:facebook-posts:v2';
// Long-lived copy served when the Graph API fails, so the section never goes
// blank because of an expired token or a Graph API outage.
const POSTS_STALE_CACHE_KEY = 'plenro:facebook-posts:stale:v2';
const POSTS_CACHE_TTL_SECONDS = 300;
const POSTS_STALE_TTL_SECONDS = 60 * 60 * 24 * 7;

function getPostsCache() {
  try {
    return (typeof caches !== 'undefined' && caches.default) || null;
  } catch {
    return null;
  }
}

async function readCache(key) {
  const cache = getPostsCache();
  if (!cache) return null;
  try {
    const res = await cache.match(key);
    if (!res) return null;
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : null;
  } catch (e) {
    console.warn('Facebook posts cache read failed:', e);
    return null;
  }
}

async function writeCache(key, posts, ttlSeconds) {
  const cache = getPostsCache();
  if (!cache || !Array.isArray(posts) || posts.length === 0) return;
  try {
    await cache.put(
      key,
      new Response(JSON.stringify(posts), {
        headers: { 'Content-Type': 'application/json' },
      }),
      { expirationTtl: ttlSeconds }
    );
  } catch (e) {
    console.warn('Facebook posts cache write failed:', e);
  }
}

const readCachedPosts = () => readCache(POSTS_CACHE_KEY);
const readStalePosts = () => readCache(POSTS_STALE_CACHE_KEY);

async function cachePosts(posts) {
  await Promise.all([
    writeCache(POSTS_CACHE_KEY, posts, POSTS_CACHE_TTL_SECONDS),
    writeCache(POSTS_STALE_CACHE_KEY, posts, POSTS_STALE_TTL_SECONDS),
  ]);
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const corsHeaders = getCorsHeaders(request, {
    cacheControl: 'public, max-age=300, stale-while-revalidate=600',
  });

  // Serve from the edge cache first so repeat visits never re-hit the Graph
  // API and cached reads are never blocked by the rate limiter.
  const cached = await readCachedPosts();
  if (cached) {
    return jsonResponse({ posts: cached, source: 'cache' }, 200, corsHeaders);
  }

  // Durable rate limiting (KV-backed when bound, in-memory otherwise).
  const clientIp = request.headers.get('cf-connecting-ip') || 'unknown';
  if (await isRateLimited(env, clientIp, 'facebook')) {
    const stale = await readStalePosts();
    if (stale) {
      return jsonResponse({ posts: stale, source: 'stale' }, 200, corsHeaders);
    }
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
      {
        error:
          'Facebook feed is not configured (missing FACEBOOK_PAGE_ID or FACEBOOK_ACCESS_TOKEN).',
        code: 'not_configured',
      },
      500,
      corsHeaders
    );
  }

  try {
    const { posts } = await fetchPagePosts(pageId, accessToken, {
      limit: 10,
      apiVersion: resolveApiVersion(env),
    });
    await cachePosts(posts);
    return jsonResponse({ posts, source: 'live' }, 200, corsHeaders);
  } catch (err) {
    console.error('Facebook posts proxy error:', err);

    // Last resort: keep showing the most recent successfully cached posts.
    const stale = await readStalePosts();
    if (stale) {
      return jsonResponse(
        { posts: stale, source: 'stale', warning: String(err?.message || err) },
        200,
        corsHeaders
      );
    }

    return jsonResponse(
      {
        error: 'Failed to load Facebook posts. Please try again later.',
        code: err?.code || 'graph_api_error',
        detail: String(err?.message || err),
      },
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
