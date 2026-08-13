import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

import {
  sanitizeInput,
  chunkKnowledge,
  retrieveTopK,
  buildContents,
  buildSystemPrompt,
  isRateLimited,
  resolveModels,
} from '../../../../functions/lib/chat-core.mjs';

/**
 * DEV-ONLY Next.js App Router Route Handler for POST /api/chat.
 *
 * `npm run dev` does NOT run Cloudflare Pages Functions, so this handler
 * mirrors the production Cloudflare function (functions/api/chat.js) so the
 * chatbot works locally too. Both reuse the same logic in
 * functions/lib/chat-core.mjs — keep them in sync.
 *
 * NOTE: The site is deployed as a static export (`output: 'export'`), so this
 * route is NOT part of the production static output. On Cloudflare Pages the
 * endpoint is served exclusively by functions/api/chat.js.
 */

// Knowledge files served from public/knowledge/. Add new `.txt` files here
// AND under public/knowledge/ to include them (must match functions/api/chat.js).
const KNOWLEDGE_FILES = ['ordinances.txt', 'republic act 7942 chapter 8.txt'];

/** Load knowledge text from public/knowledge/ (Node dev runtime). */
function loadKnowledgeBase(): string {
  const dir = path.join(process.cwd(), 'public', 'knowledge');
  let combined = '';
  if (fs.existsSync(dir)) {
    for (const file of KNOWLEDGE_FILES) {
      const filePath = path.join(dir, file);
      if (fs.existsSync(filePath)) {
        try {
          combined += `\n--- FILE: ${file} ---\n${fs.readFileSync(filePath, 'utf-8')}\n`;
        } catch (err) {
          console.error(`Error reading knowledge file ${file}:`, err);
        }
      }
    }
  }
  return combined.trim();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, chatHistory, website } = body;

    // Honeypot field check (bot protection).
    if (website) {
      return NextResponse.json(
        { error: 'Potential automated activity detected.' },
        { status: 400 }
      );
    }

    // Input validation.
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    const sanitizedMessage = sanitizeInput(message);
    if (sanitizedMessage.length === 0) {
      return NextResponse.json({ error: 'Message cannot be empty.' }, { status: 400 });
    }

    if (sanitizedMessage.length > 500) {
      return NextResponse.json(
        { error: 'Message exceeds maximum length of 500 characters.' },
        { status: 400 }
      );
    }

    // Durable rate limiting — in dev there is no KV binding, so the shared
    // helper falls back to its in-memory limiter.
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    if (await isRateLimited(process.env as Record<string, string>, clientIp)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Server-side only secret.
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return NextResponse.json(
        { error: 'Gemini API key is not configured in the environment.' },
        { status: 500 }
      );
    }

    // Retrieve the relevant knowledge sections for this query (RAG).
    const knowledgeBase = loadKnowledgeBase();
    const chunks = chunkKnowledge(knowledgeBase);
    const relevantChunks = retrieveTopK(sanitizedMessage, chunks, 6);

    const systemPrompt = buildSystemPrompt(relevantChunks);
    const contents = buildContents(chatHistory, sanitizedMessage, 6);

    const candidateModels = resolveModels(process.env.GEMINI_MODELS);
    let lastStatus = 500;

    for (const model of candidateModels) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

      try {
        const geminiRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: contents,
            generationConfig: { temperature: 0.4, maxOutputTokens: 4096 },
          }),
        });

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (replyText) {
            return NextResponse.json({ answer: replyText, modelUsed: model });
          }
        } else {
          lastStatus = geminiRes.status;
          const errText = await geminiRes.text();
          console.warn(`Gemini model ${model} failed with status ${geminiRes.status}:`, errText);
        }
      } catch (err) {
        console.warn(`Error calling Gemini model ${model}:`, err);
      }
    }

    return NextResponse.json(
      { error: `Gemini API responded with status: ${lastStatus}` },
      { status: 502 }
    );
  } catch (error) {
    console.error('Chat API Handler Error:', error);
    return NextResponse.json(
      { error: 'Internal server error processing Gemini chat' },
      { status: 500 }
    );
  }
}
