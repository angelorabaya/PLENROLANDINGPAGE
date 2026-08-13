/**
 * Pure, testable chat helper logic shared by the Cloudflare Pages Function
 * and Node unit tests. No platform-specific APIs are used here so the same
 * module can run in the Worker runtime (bundled by Wrangler) and in Node's
 * test runner.
 */

import { buildRegulatorySummary } from '../../src/lib/regulatory-data.mjs';

/** Strip HTML tags and trim surrounding whitespace. */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input.replace(/<\/?[^>]+(>|$)/g, '').trim();
}

const STOPWORDS = new Set(
  (
    'a an and are as at be but by for from has have how i in is it its of on or the to was what when where which who will with you your please can could should would may might do does did not no we our us they them this that these those their there here'
  ).split(' ')
);

/** Simple word tokenizer used for query/chunk overlap scoring. */
function tokenize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .filter((word) => !STOPWORDS.has(word) && word.length > 1);
}

/**
 * Split combined knowledge text (with `--- FILE: name ---` markers) into
 * retrievable chunks, each with a source attribution.
 * @param {string} knowledgeText
 * @param {number} [maxLength]
 * @returns {{ source: string; text: string }[]}
 */
export function chunkKnowledge(knowledgeText, maxLength = 1800) {
  if (!knowledgeText) return [];

  // Split on file markers first.
  const fileParts = knowledgeText.split(/---\s*FILE:\s*(.+?)\s*---/g);
  const chunks = [];

  for (let i = 1; i < fileParts.length; i += 2) {
    const source = (fileParts[i] || 'knowledge').trim();
    const body = fileParts[i + 1] || '';
    const paragraphs = body
      .split(/\n\s*\n|\n(?=[A-Z][A-Z ]{3,})/)
      .map((p) => p.trim())
      .filter(Boolean);

    let current = '';
    for (const para of paragraphs) {
      // Start a new chunk if adding this paragraph would exceed maxLength.
      if (current && (current + '\n' + para).length > maxLength) {
        chunks.push({ source, text: current });
        current = para;
      } else {
        current = current ? current + '\n' + para : para;
      }
    }
    if (current) chunks.push({ source, text: current });
  }

  // Fallback: no FILE markers found — treat the whole text as one chunk.
  if (chunks.length === 0 && knowledgeText.trim()) {
    chunks.push({ source: 'knowledge', text: knowledgeText.trim() });
  }

  return chunks;
}

/**
 * Retrieve the top-K most relevant chunks for a query using lightweight
 * term-overlap scoring (no external embedding service required).
 * @param {string} query
 * @param {{ source: string; text: string }[]} chunks
 * @param {number} [topK]
 * @returns {{ source: string; text: string; score: number }[]}
 */
export function retrieveTopK(query, chunks, topK = 6) {
  const queryTerms = tokenize(query);
  if (queryTerms.length === 0) {
    return chunks.slice(0, topK).map((c) => ({ ...c, score: 0 }));
  }

  const scored = chunks.map((chunk) => {
    const chunkTerms = tokenize(chunk.text);
    const termFreq = new Map();
    for (const term of chunkTerms) {
      termFreq.set(term, (termFreq.get(term) || 0) + 1);
    }
    let score = 0;
    for (const term of queryTerms) {
      if (termFreq.has(term)) score += 1 + Math.log(termFreq.get(term));
    }
    // Slight bonus for shorter chunks to avoid boilerplate wins.
    score += Math.min(1, 40 / (chunk.text.length || 1));
    return { ...chunk, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

/**
 * Build Gemini `contents` from the chat history plus the current message.
 * History is bounded to `maxTurns` most recent user/model exchanges.
 * The current user message is always appended exactly once.
 * @param {{ role: 'user' | 'bot'; text: string }[]} chatHistory
 * @param {string} currentMessage
 * @param {number} [maxTurns]
 * @returns {{ role: string; parts: { text: string }[] }[]}
 */
export function buildContents(chatHistory, currentMessage, maxTurns = 6) {
  const contents = [];
  const history = Array.isArray(chatHistory) ? chatHistory.slice(-maxTurns * 2) : [];

  for (const item of history) {
    if (!item || typeof item.text !== 'string' || !item.text) continue;
    if (item.role === 'user') {
      contents.push({ role: 'user', parts: [{ text: item.text }] });
    } else if (item.role === 'bot') {
      contents.push({ role: 'model', parts: [{ text: item.text }] });
    }
  }

  const trimmed = currentMessage && typeof currentMessage === 'string' ? currentMessage.trim() : '';
  if (trimmed) {
    contents.push({ role: 'user', parts: [{ text: trimmed }] });
  }

  return contents;
}

/**
 * Build the system instruction grounding the model on the provided
 * knowledge chunks and the structured regulatory summary.
 * @param {{ source: string; text: string }[]} chunks
 * @returns {string}
 */
export function buildSystemPrompt(chunks) {
  const regulatorySummary = buildRegulatorySummary();
  const knowledgeBlock = chunks.length
    ? chunks
        .map((c) => `--- SOURCE: ${c.source} ---\n${c.text}`)
        .join('\n\n')
    : 'No external knowledge files loaded. Use official ordinance knowledge base if known.';

  return `You are PLENRO AI Assistant, an expert, polite, and helpful assistant specializing in local town ordinances, quarry permits, environment regulations, tax rates, and administrative fees for Misamis Oriental / PLENRO.

Your primary directive is to answer user questions accurately based on the official knowledge base files provided below.

=== KNOWLEDGE BASE (RETRIEVED SECTIONS) ===
${knowledgeBlock}
======================

=== STRUCTURED REGULATORY SUMMARY (matches website tables) ===
${regulatorySummary}
======================

GUIDELINES:
1. Ground your answers in the official knowledge base provided above.
2. Be polite, professional, and clear. Give THOROUGH, detailed answers: explain the context, list every relevant fee, requirement, penalty, or condition with its exact amount or figure, and include the applicable section or ordinance reference when known.
3. If a question is outside the scope of PLENRO ordinances and regulations, politely state that you specialize in PLENRO ordinances and suggest contacting the Provincial Environment and Natural Resources Office.
4. Provide complete, well-structured, and substantive answers. Aim for 3-8 paragraphs or a detailed bulleted breakdown, not one-liners. Always ensure every sentence, list, or bullet point is fully finished and complete without getting cut off.
5. If the user asks for the requirements of all permits, permit applications, or downloadable forms, kindly direct them to visit the "Public Resources & Downloads" section of the website or click "Resources" in the main navigation menu.`;
}

/**
 * Durable rate limiter backed by Cloudflare KV when the RATE_LIMIT_KV binding
 * is available; otherwise falls back to a per-isolate in-memory cache.
 */
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10;

// In-memory fallback (per-isolate; reset when the isolate is recycled).
const ipCache = new Map();
let lastCleanup = Date.now();

export function cleanupMemoryCache() {
  const now = Date.now();
  if (now - lastCleanup > 5 * 60 * 1000) {
    for (const [ip, data] of ipCache.entries()) {
      if (now - data.firstRequestTime > WINDOW_MS) ipCache.delete(ip);
    }
    lastCleanup = now;
  }
}

function isRateLimitedMemory(ip) {
  if (!ip) return false;
  const now = Date.now();
  const data = ipCache.get(ip) || { count: 0, firstRequestTime: now };
  if (now - data.firstRequestTime > WINDOW_MS) {
    data.count = 1;
    data.firstRequestTime = now;
  } else {
    data.count += 1;
  }
  ipCache.set(ip, data);
  return data.count > MAX_REQUESTS;
}

/**
 * KV-backed rate limiter. Returns true when the request should be blocked.
 * @param {{ RATE_LIMIT_KV?: any }} env
 * @param {string} ip
 * @returns {Promise<boolean>}
 */
export async function isRateLimited(env, ip) {
  if (!ip) return false;
  const kv = env && env.RATE_LIMIT_KV;
  if (!kv || typeof kv.get !== 'function' || typeof kv.put !== 'function') {
    cleanupMemoryCache();
    return isRateLimitedMemory(ip);
  }

  const key = `ratelimit:${ip}`;
  const now = Date.now();
  try {
    const stored = await kv.get(key, 'json');
    const data = stored && typeof stored === 'object' ? stored : null;

    if (!data || now - data.firstRequestTime > WINDOW_MS) {
      await kv.put(key, JSON.stringify({ count: 1, firstRequestTime: now }), {
        expirationTtl: 120,
      });
      return false;
    }

    data.count += 1;
    await kv.put(key, JSON.stringify(data), { expirationTtl: 120 });
    return data.count > MAX_REQUESTS;
  } catch (err) {
    console.warn('KV rate limiter failed, falling back to memory:', err);
    cleanupMemoryCache();
    return isRateLimitedMemory(ip);
  }
}

/** Known-stable public Gemini model IDs (overridable via GEMINI_MODELS env). */
export const DEFAULT_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash',
];

/** Parse a comma-separated GEMINI_MODELS env var into a clean list. */
export function resolveModels(envModels) {
  if (typeof envModels === 'string' && envModels.trim()) {
    const parsed = envModels
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean);
    if (parsed.length) return parsed;
  }
  return DEFAULT_MODELS;
}
