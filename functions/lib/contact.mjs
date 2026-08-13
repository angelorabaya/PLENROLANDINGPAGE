/**
 * Pure, testable contact-form helper logic shared by the Cloudflare Pages
 * Function and the dev-only Next.js route handler.
 *
 * No platform-specific APIs are used here so the same module runs in the
 * Worker runtime (bundled by Wrangler) and in Node's test runner / Next dev
 * route. Outbound delivery uses the Resend HTTP API (https://resend.com).
 */

const RESEND_API_URL = 'https://api.resend.com/emails';

/** Max lengths enforced server-side for each contact field. */
export const CONTACT_LIMITS = {
  name: 100,
  email: 200,
  subject: 150,
  message: 2000,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Strip HTML tags, collapse whitespace, trim, and bound a text field to
 * `maxLength` characters. Returns a safe plain string.
 * @param {unknown} value
 * @param {number} [maxLength]
 * @returns {string}
 */
export function sanitizeContactField(value, maxLength = 500) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

/**
 * Normalize + validate a raw contact-form payload.
 *
 * Returns either `{ ok: true, data }` where `data` is a safe, sanitized shape,
 * or `{ ok: false, errors }` with human-readable messages. The honeypot check
 * is reported separately so the caller can reject bots without leaking details.
 *
 * @param {Record<string, unknown>} [payload]
 * @returns {{ ok: true; data: { name: string; email: string; subject: string; message: string }; honeypotFilled: boolean } | { ok: false; errors: string[]; honeypotFilled: boolean }}
 */
export function normalizeContactPayload(payload = {}) {
  const data = {
    name: sanitizeContactField(payload.name, CONTACT_LIMITS.name),
    email: sanitizeContactField(payload.email, CONTACT_LIMITS.email),
    subject: sanitizeContactField(payload.subject, CONTACT_LIMITS.subject),
    message: sanitizeContactField(payload.message, CONTACT_LIMITS.message),
  };

  const honeypotFilled =
    typeof payload.website === 'string' && payload.website.length > 0;

  const errors = [];
  if (!data.name) errors.push('Name is required.');
  if (!EMAIL_RE.test(data.email)) errors.push('A valid email address is required.');
  if (!data.subject) errors.push('Subject is required.');
  if (!data.message) errors.push('Message is required.');
  else if (data.message.length < 10) errors.push('Message must be at least 10 characters.');

  if (errors.length > 0) {
    return { ok: false, errors, honeypotFilled };
  }

  return { ok: true, data, honeypotFilled };
}

/**
 * Build the Resend API email payload for an inquiry. Escaping is done here so
 * the HTML body can never be used to inject markup from user input.
 * @param {{ data: { name: string; email: string; subject: string; message: string }; toEmail: string; fromEmail: string; fromName?: string }} params
 * @returns {{ from: string; to: string[]; reply_to: string; subject: string; text: string; html: string }}
 */
export function buildContactEmail({ data, toEmail, fromEmail, fromName = 'PLENRO Website' }) {
  const from = fromName && fromName.trim() ? `${fromName} <${fromEmail}>` : fromEmail;

  const subject = `Website Inquiry: ${data.subject}`;

  const text = [
    'A new inquiry was submitted through the PLENRO Misamis Oriental website contact form.',
    '',
    `From: ${data.name} <${data.email}>`,
    `Subject: ${data.subject}`,
    '',
    'Message:',
    data.message,
    '',
    '----------------------',
    `Please reply directly to ${data.email}.`,
    'This email was sent from the official PLENRO website.',
  ].join('\n');

  // Escape HTML-significant characters. Single quotes are intentionally left
  // untouched: they need no escaping in HTML text content.
  const escapeHtml = (s) =>
    s
      .replace(/&/g, '&')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '"');

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#0f172a;max-width:600px;margin:0 auto;">
      <h2 style="color:#059669;margin-bottom:8px;">New Website Inquiry</h2>
      <p style="color:#475569;margin-top:0;">Submitted through the PLENRO Misamis Oriental contact form.</p>
      <table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr>
          <td style="padding:8px 12px;background:#f0fdf4;font-weight:bold;color:#059669;border:1px solid #dcfce7;">From</td>
          <td style="padding:8px 12px;border:1px solid #dcfce7;">${escapeHtml(data.name)} <${escapeHtml(data.email)}></td>
        </tr>
        <tr>
          <td style="padding:8px 12px;background:#f0fdf4;font-weight:bold;color:#059669;border:1px solid #dcfce7;">Subject</td>
          <td style="padding:8px 12px;border:1px solid #dcfce7;">${escapeHtml(data.subject)}</td>
        </tr>
        <tr>
          <td style="padding:8px 12px;background:#f0fdf4;font-weight:bold;color:#059669;border:1px solid #dcfce7;vertical-align:top;">Message</td>
          <td style="padding:8px 12px;border:1px solid #dcfce7;white-space:pre-wrap;">${escapeHtml(data.message)}</td>
        </tr>
      </table>
      <p style="color:#64748b;font-size:12px;margin-top:16px;">
        Reply directly to <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a>.
        This email was sent from the official PLENRO website.
      </p>
    </div>
  `.trim();

  return {
    from,
    to: [toEmail],
    reply_to: data.email,
    subject,
    text,
    html,
  };
}

/**
 * Send an email through the Resend API.
 * @param {{ apiKey: string; emailPayload: object; fetchFn?: typeof fetch }} params
 * @returns {Promise<{ id?: string }>} Resend response body
 */
export async function sendContactEmail({ apiKey, emailPayload, fetchFn = fetch }) {
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured.');
  }

  const res = await fetchFn(RESEND_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(emailPayload),
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const detail =
      (body && body.message) || `Resend API returned status ${res.status}.`;
    throw new Error(detail);
  }

  return body;
}
