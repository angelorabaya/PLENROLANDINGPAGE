/**
 * Cloudflare Pages Function — Gemini API Chat Proxy with Retrieval-Augmented
 * Knowledge Base.
 *
 * This is the SINGLE production path for POST /api/chat. The app is deployed
 * as a static export on Cloudflare Pages, so this function is what actually
 * serves the endpoint (the legacy Next.js App Router route handler was removed
 * because it is incompatible with `output: 'export'`).
 *
 * Environment variables (set in the Cloudflare Pages dashboard or .env.local
 * for local development):
 *  - GEMINI_API_KEY       (required) — server-side Gemini API key. NEVER use a
 *                        NEXT_PUBLIC_ prefix for secrets.
 *  - GEMINI_MODELS        (optional) — comma-separated model IDs to try in order.
 *  - RATE_LIMIT_KV        (optional) — KV namespace binding for durable
 *                        per-IP rate limiting. Falls back to in-memory.
 */

import {
  sanitizeInput,
  chunkKnowledge,
  retrieveTopK,
  buildContents,
  buildSystemPrompt,
  isRateLimited,
  resolveModels,
} from '../lib/chat-core.mjs';

// Knowledge files served from public/knowledge/ and loaded through ASSETS.
// Add new `.txt` files here AND under public/knowledge/ to include them.
const KNOWLEDGE_FILES = ['ordinances.txt', 'republic act 7942 chapter 8.txt'];

// CORS helper to lock origin to plenro.pages.dev, subdomains, and local dev.
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

/**
 * Load every knowledge file listed in KNOWLEDGE_FILES from the static assets.
 * Falls back to /ordinance.txt when nothing loads.
 * @param {any} env
 * @param {Request} request
 * @returns {Promise<string>}
 */
async function getKnowledgeBaseContent(env, request) {
  let knowledgeText = '';

  try {
    if (env.ASSETS && typeof env.ASSETS.fetch === 'function') {
      for (const file of KNOWLEDGE_FILES) {
        const url = new URL(`/knowledge/${encodeURIComponent(file)}`, request.url);
        const res = await env.ASSETS.fetch(url);
        if (res.ok) {
          knowledgeText += `\n--- FILE: ${file} ---\n` + (await res.text()) + `\n`;
        }
      }
    }
  } catch (e) {
    console.warn('ASSETS fetch failed for knowledge base:', e);
  }

  // Fallback if knowledge base wasn't loaded dynamically.
  if (!knowledgeText.trim()) {
    try {
      const url = new URL('/ordinance.txt', request.url);
      if (env.ASSETS) {
        const res = await env.ASSETS.fetch(url);
        if (res.ok) {
          knowledgeText += `\n--- FILE: ordinance.txt ---\n` + (await res.text()) + `\n`;
        }
      }
    } catch (e) {
      console.warn('Fallback ordinance fetch failed:', e);
    }
  }

  return knowledgeText.trim();
}

/** Build a JSON Response with the proper CORS + content-type headers. */
function jsonResponse(payload, status, corsHeaders) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const corsHeaders = getCorsHeaders(request);

  // Durable rate limiting (KV-backed when bound, in-memory otherwise).
  const clientIp = request.headers.get('cf-connecting-ip') || 'unknown';
  if (await isRateLimited(env, clientIp)) {
    return jsonResponse(
      { error: 'Too many requests. Please try again later.' },
      429,
      corsHeaders
    );
  }

  try {
    const { message, chatHistory, website } = await request.json();

    // Honeypot field check (bot protection). `website` is an invisible input
    // that legitimate users never fill in; only automated bots do.
    if (website) {
      return jsonResponse(
        { error: 'Potential automated activity detected.' },
        400,
        corsHeaders
      );
    }

    // Input validation.
    if (!message || typeof message !== 'string') {
      return jsonResponse({ error: 'Message is required.' }, 400, corsHeaders);
    }

    const sanitizedMessage = sanitizeInput(message);
    if (sanitizedMessage.length === 0) {
      return jsonResponse({ error: 'Message cannot be empty.' }, 400, corsHeaders);
    }

    if (sanitizedMessage.length > 500) {
      return jsonResponse(
        { error: 'Message exceeds maximum length of 500 characters.' },
        400,
        corsHeaders
      );
    }

    // Server-side only secret. Never expose a NEXT_PUBLIC_ prefixed key.
    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return jsonResponse(
        { error: 'Gemini API key is not configured in the environment.' },
        500,
        corsHeaders
      );
    }

    // Retrieve the relevant knowledge sections for this specific query (RAG).
    const knowledgeBase = await getKnowledgeBaseContent(env, request);
    const chunks = chunkKnowledge(knowledgeBase);
    const relevantChunks = retrieveTopK(sanitizedMessage, chunks, 6);

    const systemPrompt = buildSystemPrompt(relevantChunks);

    // Bound history server-side and always append the current message once.
    const contents = buildContents(chatHistory, sanitizedMessage, 6);

    // Candidate models in preference order (overridable via GEMINI_MODELS).
    const candidateModels = resolveModels(env.GEMINI_MODELS);

    let lastStatus = 500;

    for (const model of candidateModels) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

      try {
        const geminiRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Prefer the header over a query param so the key never leaks
            // into request logs / URLs.
            'x-goog-api-key': apiKey,
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemPrompt }],
            },
            contents: contents,
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 4096,
            },
          }),
        });

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (replyText) {
            return jsonResponse({ answer: replyText, modelUsed: model }, 200, corsHeaders);
          }
        } else {
          lastStatus = geminiRes.status;
          const errorText = await geminiRes.text();
          console.warn(`Gemini model ${model} failed with status ${geminiRes.status}:`, errorText);
        }
      } catch (err) {
        console.warn(`Error calling Gemini model ${model}:`, err);
      }
    }

    return jsonResponse(
      { error: `Gemini API responded with status: ${lastStatus}` },
      502,
      corsHeaders
    );
  } catch (error) {
    console.error('Chat proxy error:', error);
    return jsonResponse(
      { error: 'Failed to process communication with Gemini API' },
      500,
      corsHeaders
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
