/**
 * Cloudflare Pages Function — Contact form inquiry submission.
 *
 * Serves POST /api/contact by validating the form payload and emailing the
 * inquiry to the office through the Resend API. The Resend API key and the
 * destination address are read from the environment server-side only.
 * (POST is used so it matches the dev-only Next.js route handler, which must be
 * POST to remain compatible with the site's static `output: 'export'`.)
 *
 * Environment variables (Cloudflare Pages dashboard or .env.local for dev):
 *  - RESEND_API_KEY       (required) — Resend API key (https://resend.com/api-keys)
 *  - CONTACT_TO_EMAIL     (required) — inbox that receives the inquiries
 *                        (e.g. enro@misamisoriental.gov.ph)
 *  - CONTACT_FROM_EMAIL   (optional) — verified sender address in Resend.
 *                        Defaults to PLENRO Website <onboarding@resend.dev>
 *                        (Resend's test sender, which can only reach your own
 *                        account inbox). Use a verified domain for real sends.
 *
 * See README.md → "Contact Form" for setup instructions.
 */

import { isRateLimited } from '../lib/chat-core.mjs';
import {
  normalizeContactPayload,
  buildContactEmail,
  sendContactEmail,
} from '../lib/contact.mjs';
import { getCorsHeaders, jsonResponse, optionsResponse, readJsonBody } from '../lib/http.mjs';
import { verifyTurnstile } from '../lib/turnstile.mjs';

// Default Resend sender (test-only: can only deliver to your account inbox).
const DEFAULT_FROM_EMAIL = 'onboarding@resend.dev';

export async function onRequestPost(context) {
  const { request, env } = context;
  const corsHeaders = getCorsHeaders(request, { cacheControl: 'no-store' });

  // Durable rate limiting (KV-backed when bound, in-memory otherwise).
  const clientIp = request.headers.get('cf-connecting-ip') || 'unknown';
  if (await isRateLimited(env, clientIp, 'contact')) {
    return jsonResponse(
      { error: 'Too many requests. Please try again later.' },
      429,
      corsHeaders
    );
  }

  const body = await readJsonBody(request, 8192);
  if (!body.ok) {
    return jsonResponse({ error: body.error }, body.status, corsHeaders);
  }

  const normalized = normalizeContactPayload(body.data);

  // Honeypot field check (bot protection). Reject bots as a success so they
  // learn nothing about the form.
  if (normalized.honeypotFilled) {
    return jsonResponse({ ok: true }, 200, corsHeaders);
  }

  if (!normalized.ok) {
    return jsonResponse({ errors: normalized.errors }, 400, corsHeaders);
  }

  // Verify Turnstile when a secret is configured; skip otherwise so the form
  // still works before the site owner adds the keys.
  const turnstileSecret = env.CF_TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const token =
      body.data && typeof body.data.turnstileToken === 'string'
        ? body.data.turnstileToken
        : '';
    const verified = await verifyTurnstile(token, turnstileSecret, clientIp);
    if (!verified) {
      return jsonResponse(
        { error: 'Bot verification failed. Please try again.' },
        400,
        corsHeaders
      );
    }
  }

  const apiKey = env.RESEND_API_KEY;
  const toEmail = env.CONTACT_TO_EMAIL;
  const fromEmail = env.CONTACT_FROM_EMAIL || DEFAULT_FROM_EMAIL;

  if (!apiKey || apiKey === 'your_resend_api_key_here') {
    return jsonResponse(
      { error: 'The contact form is not configured (missing RESEND_API_KEY).' },
      500,
      corsHeaders
    );
  }

  if (!toEmail) {
    return jsonResponse(
      { error: 'The contact form is not configured (missing CONTACT_TO_EMAIL).' },
      500,
      corsHeaders
    );
  }

  try {
    const emailPayload = buildContactEmail({
      data: normalized.data,
      toEmail,
      fromEmail,
    });

    await sendContactEmail({ apiKey, emailPayload });
    return jsonResponse({ ok: true }, 200, corsHeaders);
  } catch (err) {
    console.error('Contact form email error:', err);
    return jsonResponse(
      { error: 'Failed to send your message. Please try again later.' },
      502,
      corsHeaders
    );
  }
}

export async function onRequestOptions(context) {
  const { request } = context;
  const corsHeaders = getCorsHeaders(request, { cacheControl: 'no-store' });
  return optionsResponse(corsHeaders);
}
