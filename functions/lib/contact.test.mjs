/**
 * Unit tests for the contact form helper.
 * Run with: `node --test functions/lib/`
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  sanitizeContactField,
  normalizeContactPayload,
  buildContactEmail,
  sendContactEmail,
} from './contact.mjs';

test('sanitizeContactField strips HTML, collapses whitespace, and trims', () => {
  assert.equal(sanitizeContactField('  Hello   <b>world</b>  '), 'Hello world');
  assert.equal(sanitizeContactField('<script>alert(1)</script>x'), 'alert(1)x');
  assert.equal(sanitizeContactField(''), '');
  assert.equal(sanitizeContactField(123), '');
  assert.equal(sanitizeContactField(null), '');
});

test('sanitizeContactField bounds length', () => {
  const value = 'x'.repeat(300);
  const out = sanitizeContactField(value, 100);
  assert.equal(out.length, 100);
});

test('normalizeContactPayload accepts a valid payload', () => {
  const result = normalizeContactPayload({
    name: 'Juan Dela Cruz',
    email: 'juan@example.com',
    subject: 'Quarry Permit Inquiry',
    message: 'I would like to ask about the requirements.',
  });
  assert.equal(result.ok, true);
  assert.equal(result.honeypotFilled, false);
  if (result.ok) {
    assert.equal(result.data.name, 'Juan Dela Cruz');
    assert.equal(result.data.email, 'juan@example.com');
    assert.equal(result.data.subject, 'Quarry Permit Inquiry');
    assert.equal(result.data.message, 'I would like to ask about the requirements.');
  }
});

test('normalizeContactPayload rejects missing/invalid fields with messages', () => {
  const result = normalizeContactPayload({
    name: '',
    email: 'not-an-email',
    subject: '',
    message: 'too short',
  });
  assert.equal(result.ok, false);
  assert.equal(result.honeypotFilled, false);
  if (!result.ok) {
    assert.ok(result.errors.includes('Name is required.'));
    assert.ok(result.errors.includes('A valid email address is required.'));
    assert.ok(result.errors.includes('Subject is required.'));
    assert.ok(result.errors.includes('Message must be at least 10 characters.'));
  }
});

test('normalizeContactPayload flags a filled honeypot', () => {
  const result = normalizeContactPayload({
    name: 'Bot',
    email: 'bot@example.com',
    subject: 'Spam',
    message: 'This is a spammy message body.',
    website: 'http://spam.example',
  });
  assert.equal(result.honeypotFilled, true);
  assert.equal(result.ok, true); // validation still passes; caller rejects on honeypot
});

test('normalizeContactPayload sanitizes malicious input', () => {
  const result = normalizeContactPayload({
    name: '<img src=x onerror=alert(1)>Juan',
    email: 'juan@example.com',
    subject: '<b>Subject</b>',
    message: 'Hello <script>alert(1)</script> this is a real message body.',
  });
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.ok(!result.data.name.includes('<'));
    assert.ok(!result.data.subject.includes('<'));
    assert.ok(!result.data.message.includes('<'));
  }
});

test('buildContactEmail produces a Resend-shaped payload with HTML escaping', () => {
  const ent = (name) => '&' + name + ';';
  const payload = buildContactEmail({
    data: {
      name: 'Jane "JJ" Doe',
      email: 'jane@example.com',
      subject: 'Feedback',
      message: 'Great site <3 & thanks!',
    },
    toEmail: 'enro@misamisoriental.gov.ph',
    fromEmail: 'onboarding@resend.dev',
  });

  assert.equal(payload.from, 'PLENRO Website <onboarding@resend.dev>');
  assert.deepEqual(payload.to, ['enro@misamisoriental.gov.ph']);
  assert.equal(payload.reply_to, 'jane@example.com');
  assert.equal(payload.subject, 'Website Inquiry: Feedback');
  assert.ok(payload.text.includes('Jane "JJ" Doe')); // plain-text body stays unescaped
  assert.ok(payload.html.includes('Jane ' + ent('quot') + 'JJ' + ent('quot') + ' Doe'));
  assert.ok(payload.html.includes('Great site ' + ent('lt') + '3 ' + ent('amp') + ' thanks!'));
  assert.ok(!payload.html.includes('<script>'));
});

test('buildContactEmail escapes HTML injection attempts', () => {
  const ent = (name) => '&' + name + ';';
  const payload = buildContactEmail({
    data: {
      name: 'Attacker',
      email: 'attacker@example.com',
      subject: 'Injection',
      message: '<img src=x onerror=alert(1)>',
    },
    toEmail: 'enro@misamisoriental.gov.ph',
    fromEmail: 'onboarding@resend.dev',
  });

  // The raw tag must be escaped so an email client renders it as text,
  // not as a live <img> element.
  assert.ok(payload.html.includes(ent('lt') + 'img src=x onerror=alert(1)' + ent('gt')));
  assert.ok(!payload.html.includes('<img'));
});

test('buildContactEmail honors a custom from name and email', () => {
  const payload = buildContactEmail({
    data: {
      name: 'A',
      email: 'a@example.com',
      subject: 'S',
      message: 'This is a sufficiently long message.',
    },
    toEmail: 'office@example.gov.ph',
    fromEmail: 'no-reply@plenro.gov.ph',
    fromName: 'PLENRO Misamis Oriental',
  });
  assert.equal(payload.from, 'PLENRO Misamis Oriental <no-reply@plenro.gov.ph>');
});

test('sendContactEmail posts to Resend and returns the id', async () => {
  let captured = null;
  const fakeFetch = async (url, init) => {
    captured = { url, init };
    return new Response(JSON.stringify({ id: 'email_123' }), { status: 200 });
  };

  const body = await sendContactEmail({
    apiKey: 're_test',
    emailPayload: { to: ['a@example.com'], subject: 'Hi' },
    fetchFn: fakeFetch,
  });

  assert.equal(body.id, 'email_123');
  assert.equal(captured.url, 'https://api.resend.com/emails');
  assert.equal(captured.init.method, 'POST');
  assert.equal(captured.init.headers.Authorization, 'Bearer re_test');
  assert.equal(JSON.parse(captured.init.body).subject, 'Hi');
});

test('sendContactEmail surfaces Resend API errors', async () => {
  const fakeFetch = async () =>
    new Response(JSON.stringify({ message: 'You can only send testing emails to your own account.' }), {
      status: 422,
    });

  await assert.rejects(
    () =>
      sendContactEmail({
        apiKey: 're_test',
        emailPayload: { to: ['x@example.com'] },
        fetchFn: fakeFetch,
      }),
    /You can only send testing emails/
  );
});

test('sendContactEmail throws when the API key is missing', async () => {
  await assert.rejects(
    () => sendContactEmail({ apiKey: '', emailPayload: { to: ['x@example.com'] } }),
    /RESEND_API_KEY/
  );
});
