/**
 * Cloudflare Turnstile server-side verification helper.
 *
 * Used by the contact form to reject automated submissions before emailing.
 * Verification is skipped when no secret is configured so the form keeps
 * working until the site owner adds CF_TURNSTILE_SECRET_KEY.
 */

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/**
 * @param {string} token
 * @param {string} secret
 * @param {string} [remoteIp]
 * @param {typeof fetch} [fetchFn]
 * @returns {Promise<boolean>}
 */
export async function verifyTurnstile(token, secret, remoteIp = '', fetchFn = fetch) {
  if (!token || !secret) return false;

  try {
    const params = new URLSearchParams({ secret, response: token });
    if (remoteIp) params.set('remoteip', remoteIp);

    const res = await fetchFn(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data && data.success === true);
  } catch (e) {
    console.warn('Turnstile verification failed:', e);
    return false;
  }
}
