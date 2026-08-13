/**
 * Precompute vector embeddings for the AI knowledge base.
 *
 * Generates `public/knowledge/embeddings.json`, which the chat endpoints use
 * for optional embedding-based retrieval. Without this file the assistant
 * falls back to keyword retrieval automatically, so running this script is
 * strictly optional.
 *
 * Usage:
 *   GEMINI_API_KEY=... node scripts/build-embeddings.mjs
 *
 * The `GEMINI_EMBEDDINGS_MODEL` env var overrides the default model
 * (`text-embedding-004`). Keep this file committed and regenerate it whenever
 * the `.txt` files under public/knowledge/ change.
 */

import fs from 'node:fs';
import path from 'node:path';

import { chunkKnowledge } from '../functions/lib/chat-core.mjs';
import { KNOWLEDGE_FILES } from '../functions/lib/knowledge-files.mjs';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey || apiKey === 'your_gemini_api_key_here') {
  throw new Error('Set GEMINI_API_KEY before running this script.');
}

const model = process.env.GEMINI_EMBEDDINGS_MODEL || 'text-embedding-004';
const root = process.cwd();

let combined = '';
for (const file of KNOWLEDGE_FILES) {
  const filePath = path.join(root, 'public', 'knowledge', file);
  if (fs.existsSync(filePath)) {
    combined += `\n--- FILE: ${file} ---\n${fs.readFileSync(filePath, 'utf-8')}\n`;
  } else {
    console.warn(`Knowledge file not found: ${file}`);
  }
}

const chunks = chunkKnowledge(combined.trim());
if (chunks.length === 0) {
  throw new Error('No knowledge chunks produced; check public/knowledge/.');
}

const index = { version: 1, model, chunks: [] };

for (const chunk of chunks) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({ content: { parts: [{ text: chunk.text }] } }),
  });

  if (!res.ok) {
    throw new Error(`Embedding failed (${res.status}): ${await res.text()}`);
  }

  const data = await res.json();
  const values = data && data.embedding && data.embedding.values;
  if (!Array.isArray(values) || values.length === 0) {
    throw new Error('Embedding API returned no vector.');
  }

  index.chunks.push({ source: chunk.source, embedding: values });
  process.stdout.write(`.`);
}

const outPath = path.join(root, 'public', 'knowledge', 'embeddings.json');
fs.writeFileSync(outPath, JSON.stringify(index));
console.log(`\nWrote ${index.chunks.length} embeddings (${model}) to ${path.relative(root, outPath)}`);
