/**
 * Cloudflare Pages Function — Dify chat proxy
 * 
 * Cloudflare Pages static exports do NOT include Next.js API routes.
 * This serverless function handles POST /api/chat on the edge instead.
 * 
 * Environment variables DIFY_API_KEY and DIFY_API_URL must be set in
 * the Cloudflare dashboard under Settings → Environment Variables.
 */

// In-memory rate limit cache (resides in the worker isolate)
const ipCache = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; // Max 10 requests per minute

function isRateLimited(ip) {
  if (!ip) return false;
  const now = Date.now();
  const userData = ipCache.get(ip) || { count: 0, firstRequestTime: now };
  
  if (now - userData.firstRequestTime > RATE_LIMIT_WINDOW) {
    userData.count = 1;
    userData.firstRequestTime = now;
    ipCache.set(ip, userData);
    return false;
  }
  
  userData.count++;
  ipCache.set(ip, userData);
  return userData.count > MAX_REQUESTS;
}

// Clean up old entries from the rate limit cache
let lastCleanup = Date.now();
function cleanupCache() {
  const now = Date.now();
  if (now - lastCleanup > 5 * 60 * 1000) { // every 5 minutes
    for (const [ip, data] of ipCache.entries()) {
      if (now - data.firstRequestTime > RATE_LIMIT_WINDOW) {
        ipCache.delete(ip);
      }
    }
    lastCleanup = now;
  }
}

// CORS helper to lock origin to plenro.pages.dev, subdomains, and local dev environments
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
  };
}

// HTML tag remover & text trimmer
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input.replace(/<\/?[^>]+(>|$)/g, '').trim();
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const corsHeaders = getCorsHeaders(request);

  // Rate Limiting Check
  const clientIp = request.headers.get('cf-connecting-ip') || 'unknown';
  cleanupCache();
  if (isRateLimited(clientIp)) {
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please try again later.' }),
      { status: 429, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }

  try {
    const { message, conversationId, website } = await request.json();

    // Honeypot Field Check (bots usually auto-fill hidden input fields named 'website')
    if (website) {
      return new Response(
        JSON.stringify({ error: 'Potential automated activity detected.' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Input validation
    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Message is required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const sanitizedMessage = sanitizeInput(message);
    if (sanitizedMessage.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Message cannot be empty.' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    if (sanitizedMessage.length > 500) {
      return new Response(
        JSON.stringify({ error: 'Message exceeds the maximum length of 500 characters.' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const apiKey = env.DIFY_API_KEY;
    const apiUrl = env.DIFY_API_URL;

    if (!apiKey || !apiUrl) {
      return new Response(
        JSON.stringify({ error: 'Dify API credentials are missing from the environment.' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const difyResponse = await fetch(`${apiUrl}/chat-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {},
        query: sanitizedMessage,
        response_mode: 'blocking',
        conversation_id: conversationId || '',
        user: 'site_visitor_session',
      }),
    });

    if (!difyResponse.ok) {
      const errorText = await difyResponse.text();
      console.error('Dify API error:', difyResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: `Dify API responded with status: ${difyResponse.status}` }),
        { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const data = await difyResponse.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    console.error('Chat proxy error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process communication with Dify' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
}

/**
 * Handle OPTIONS preflight requests for CORS.
 */
export async function onRequestOptions(context) {
  const { request } = context;
  const corsHeaders = getCorsHeaders(request);
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}
