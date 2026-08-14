import { NextRequest, NextResponse } from 'next/server';

import { isRateLimited } from '../../../../functions/lib/chat-core.mjs';
import {
  normalizeContactPayload,
  buildContactEmail,
  sendContactEmail,
} from '../../../../functions/lib/contact.mjs';

/**
 * DEV-ONLY Next.js App Router Route Handler for POST /api/contact.
 *
 * `npm run dev` does NOT run Cloudflare Pages Functions, so this handler
 * mirrors the production Cloudflare function (functions/api/contact.js) so the
 * contact form works locally too. Both reuse the same logic in
 * functions/lib/contact.mjs — keep them in sync.
 *
 * NOTE: The site is deployed as a static export (`output: 'export'`), so this
 * route is NOT part of the production static output. On Cloudflare Pages the
 * endpoint is served exclusively by functions/api/contact.js. It is a POST
 * handler so it does not conflict with static export (same pattern as the
 * chat endpoint).
 */

const DEFAULT_FROM_EMAIL = 'onboarding@resend.dev';

export async function POST(req: NextRequest) {
  const clientIp =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  if (await isRateLimited(process.env as Record<string, string>, clientIp)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const normalized = normalizeContactPayload(
    payload as Record<string, unknown>
  );

  // Honeypot field check (bot protection). Reject bots as a success so they
  // learn nothing about the form.
  if (normalized.honeypotFilled) {
    return NextResponse.json({ ok: true });
  }

  if (!normalized.ok) {
    return NextResponse.json({ errors: normalized.errors }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM_EMAIL;

  if (!apiKey || apiKey === 'your_resend_api_key_here') {
    return NextResponse.json(
      { error: 'The contact form is not configured (missing RESEND_API_KEY).' },
      { status: 500 }
    );
  }

  if (!toEmail) {
    return NextResponse.json(
      { error: 'The contact form is not configured (missing CONTACT_TO_EMAIL).' },
      { status: 500 }
    );
  }

  try {
    const emailPayload = buildContactEmail({
      data: normalized.data,
      toEmail,
      fromEmail,
    });

    await sendContactEmail({ apiKey, emailPayload });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Contact form email error:', err);
    return NextResponse.json(
      { error: 'Failed to send your message. Please try again later.' },
      { status: 502 }
    );
  }
}
