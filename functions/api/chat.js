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
  collectSources,
  getEmbedding,
  retrieveTopKEmbeddings,
  buildContents,
  buildSystemPrompt,
  isRateLimited,
  resolveModels,
} from '../lib/chat-core.mjs';
import { getCorsHeaders, jsonResponse, optionsResponse, readJsonBody } from '../lib/http.mjs';
import { KNOWLEDGE_FILES } from '../lib/knowledge-files.mjs';

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

/**
 * Load the optional precomputed embeddings index
 * (public/knowledge/embeddings.json). Returns null when absent so callers
 * fall back to keyword retrieval.
 */
async function loadEmbeddingsIndex(env, request) {
  try {
    if (!env.ASSETS || typeof env.ASSETS.fetch !== 'function') return null;
    const url = new URL('/knowledge/embeddings.json', request.url);
    const res = await env.ASSETS.fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.warn('Embeddings index load failed:', e);
    return null;
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const corsHeaders = getCorsHeaders(request, { cacheControl: 'no-store' });

  // Durable rate limiting (KV-backed when bound, in-memory otherwise).
  const clientIp = request.headers.get('cf-connecting-ip') || 'unknown';
  if (await isRateLimited(env, clientIp, 'chat')) {
    return jsonResponse(
      { error: 'Too many requests. Please try again later.' },
      429,
      corsHeaders
    );
  }

  try {
    const body = await readJsonBody(request, 16384);
    if (!body.ok) {
      return jsonResponse({ error: body.error }, body.status, corsHeaders);
    }

    const { message, chatHistory, website } = body.data;

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
    let relevantChunks = retrieveTopK(sanitizedMessage, chunks, 6);

    // Optional embedding-based retrieval when a precomputed index is present.
    const embeddingsIndex = await loadEmbeddingsIndex(env, request);
    if (
      embeddingsIndex &&
      Array.isArray(embeddingsIndex.chunks) &&
      embeddingsIndex.chunks.length === chunks.length
    ) {
      try {
        const queryEmbedding = await getEmbedding(sanitizedMessage, {
          apiKey,
          model: env.GEMINI_EMBEDDINGS_MODEL || 'text-embedding-004',
        });
        const vectors = embeddingsIndex.chunks.map((c) => c.embedding);
        relevantChunks = retrieveTopKEmbeddings(queryEmbedding, chunks, vectors, 6);
      } catch (e) {
        console.warn('Embedding retrieval failed, falling back to keyword retrieval:', e);
      }
    }

    const sources = collectSources(relevantChunks);
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
            safetySettings: [
              { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
              { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
              { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
              { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            ],
          }),
        });

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (replyText) {
            return jsonResponse({ answer: replyText, modelUsed: model, sources }, 200, corsHeaders);
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
  return optionsResponse(corsHeaders);
}
