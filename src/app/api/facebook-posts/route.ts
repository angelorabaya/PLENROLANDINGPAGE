import { NextResponse } from 'next/server';

import { fetchPagePosts } from '../../../../functions/lib/facebook-posts.mjs';

/**
 * DEV-ONLY Next.js App Router Route Handler for POST /api/facebook-posts.
 *
 * `npm run dev` does NOT run Cloudflare Pages Functions, so this handler
 * mirrors the production Cloudflare function (functions/api/facebook-posts.js)
 * so the carousel works locally too. Both reuse the same logic in
 * functions/lib/facebook-posts.mjs.
 *
 * NOTE: The site is deployed as a static export (`output: 'export'`), so this
 * route is NOT part of the production static output. On Cloudflare Pages the
 * endpoint is served exclusively by functions/api/facebook-posts.js. It is a
 * POST handler so it does not conflict with static export (same pattern as the
 * chat endpoint).
 */

export async function POST() {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;

  if (!pageId || !accessToken) {
    return NextResponse.json(
      { error: 'Facebook feed is not configured (missing FACEBOOK_PAGE_ID or FACEBOOK_ACCESS_TOKEN).' },
      { status: 500 }
    );
  }

  try {
    const { posts } = await fetchPagePosts(pageId, accessToken, { limit: 10 });
    return NextResponse.json({ posts });
  } catch (err) {
    console.error('Facebook posts route error:', err);
    return NextResponse.json(
      { error: 'Failed to load Facebook posts. Please try again later.' },
      { status: 502 }
    );
  }
}
