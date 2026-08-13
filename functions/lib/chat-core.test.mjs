/**
 * Unit tests for the shared chat-core helpers.
 * Run with: `node --test functions/lib/`
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  sanitizeInput,
  chunkKnowledge,
  retrieveTopK,
  collectSources,
  cosineSimilarity,
  retrieveTopKEmbeddings,
  buildContents,
  buildSystemPrompt,
  isRateLimited,
  resolveModels,
  DEFAULT_MODELS,
} from './chat-core.mjs';

test('sanitizeInput strips HTML tags and trims', () => {
  // Tags are removed but text between them is preserved.
  assert.equal(sanitizeInput('<script>alert(1)</script> hello '), 'alert(1) hello');
  assert.equal(sanitizeInput('<b>bold</b> text'), 'bold text');
  assert.equal(sanitizeInput('   plain text   '), 'plain text');
  assert.equal(sanitizeInput(''), '');
  assert.equal(sanitizeInput(null), '');
  assert.equal(sanitizeInput(123), '');
});

test('chunkKnowledge splits by FILE markers with source attribution', () => {
  const text = `
--- FILE: ordinances.txt ---
Section A content.
More content here.

--- FILE: republic act 7942 chapter 8.txt ---
SEC. 43. Quarry Permit.
Details about quarry.
`;
  const chunks = chunkKnowledge(text);
  const sources = new Set(chunks.map((c) => c.source));
  assert.ok(sources.has('ordinances.txt'));
  assert.ok(sources.has('republic act 7942 chapter 8.txt'));
  assert.ok(chunks.every((c) => c.text.length > 0));
});

test('chunkKnowledge falls back to a single chunk when no markers exist', () => {
  const chunks = chunkKnowledge('Some plain knowledge text without markers.');
  assert.equal(chunks.length, 1);
  assert.equal(chunks[0].source, 'knowledge');
});

test('retrieveTopK ranks relevant chunks higher', () => {
  const chunks = [
    { source: 'a.txt', text: 'Tax rate for sand and gravel is ten percent.' },
    { source: 'b.txt', text: 'Office hours are eight to five, Monday to Friday.' },
    { source: 'c.txt', text: 'Quarry permits require a governor approval.' },
  ];
  const top = retrieveTopK('sand gravel tax rate', chunks, 2);
  assert.equal(top[0].source, 'a.txt');
  assert.ok(top.length <= 2);
  assert.ok(top[0].score >= 0);
});

test('retrieveTopK returns topK chunks for an empty query', () => {
  const chunks = [
    { source: 'a', text: 'One' },
    { source: 'b', text: 'Two' },
    { source: 'c', text: 'Three' },
  ];
  const top = retrieveTopK('', chunks, 2);
  assert.equal(top.length, 2);
});

test('retrieveTopK expands domain acronyms and synonyms', () => {
  const chunks = [
    { source: 'a.txt', text: 'A Commercial Sand and Gravel Permit requires application fees.' },
    { source: 'b.txt', text: 'Office hours are eight to five, Monday to Friday.' },
  ];
  const top = retrieveTopK('CSAG fees', chunks, 2);
  assert.equal(top[0].source, 'a.txt');
});

test('collectSources returns unique sources in retrieval order', () => {
  const chunks = [
    { source: 'b.txt', text: 'x' },
    { source: 'a.txt', text: 'y' },
    { source: 'b.txt', text: 'z' },
  ];
  assert.deepEqual(collectSources(chunks), ['b.txt', 'a.txt']);
});

test('cosineSimilarity computes correct values', () => {
  assert.equal(cosineSimilarity([1, 0], [1, 0]), 1);
  assert.equal(cosineSimilarity([1, 0], [0, 1]), 0);
  assert.equal(cosineSimilarity([1], [1, 2]), 0);
});

test('retrieveTopKEmbeddings ranks by cosine similarity', () => {
  const chunks = [
    { source: 'a', text: 'x' },
    { source: 'b', text: 'y' },
  ];
  const top = retrieveTopKEmbeddings([1, 0], chunks, [[1, 0], [0, 1]], 2);
  assert.equal(top[0].source, 'a');
});

test('buildContents always appends the current message exactly once', () => {
  const history = [
    { role: 'user', text: 'Hello' },
    { role: 'bot', text: 'Hi there!' },
  ];
  const contents = buildContents(history, 'What fees apply?', 6);

  // history mapped + current message
  assert.equal(contents.length, 3);
  assert.equal(contents[0].role, 'user');
  assert.equal(contents[1].role, 'model');
  assert.equal(contents[2].role, 'user');
  assert.equal(contents[2].parts[0].text, 'What fees apply?');
});

test('buildContents bounds history to maxTurns', () => {
  const history = [];
  for (let i = 0; i < 20; i++) {
    history.push({ role: 'user', text: `u${i}` });
    history.push({ role: 'bot', text: `b${i}` });
  }
  const contents = buildContents(history, 'final', 3);
  // 3 turns = 6 history messages + 1 current
  assert.equal(contents.length, 7);
  assert.equal(contents[contents.length - 1].parts[0].text, 'final');
});

test('buildContents ignores empty/invalid history items', () => {
  const contents = buildContents([null, { role: 'user', text: '' }, { role: 'bot', text: 'ok' }], 'current');
  assert.equal(contents[0].role, 'model');
  assert.equal(contents[0].parts[0].text, 'ok');
});

test('buildSystemPrompt includes knowledge sources and structured summary', () => {
  const prompt = buildSystemPrompt([
    { source: 'ordinances.txt', text: 'Ten percent tax on sand and gravel.' },
  ]);
  assert.ok(prompt.includes('ordinances.txt'));
  assert.ok(prompt.includes('PERMIT TYPES AND VALIDITY'));
  assert.ok(prompt.includes('VEHICLE AND EQUIPMENT REGISTRATION FEES'));
  assert.ok(prompt.includes('FINES AND PENALTIES'));
});

test('buildSystemPrompt includes citation, multilingual, and guardrail guidance', () => {
  const prompt = buildSystemPrompt([
    { source: 'ordinances.txt', text: 'Ten percent tax on sand and gravel.' },
  ]);
  assert.ok(prompt.includes('[REF 1]'));
  assert.ok(prompt.includes('SOURCE FILES'));
  assert.ok(prompt.includes('Cite your sources'));
  assert.ok(prompt.includes('Filipino (Tagalog)'));
  assert.ok(prompt.includes('Cebuano (Bisaya)'));
  assert.ok(prompt.includes('Security'));
});

test('resolveModels parses env list and falls back to defaults', () => {
  assert.deepEqual(resolveModels('gemini-a, gemini-b'), ['gemini-a', 'gemini-b']);
  assert.deepEqual(resolveModels(''), DEFAULT_MODELS);
  assert.deepEqual(resolveModels(undefined), DEFAULT_MODELS);
  assert.deepEqual(resolveModels('   '), DEFAULT_MODELS);
});

test('isRateLimited uses memory fallback when no KV binding', async () => {
  const env = {}; // no RATE_LIMIT_KV
  // First 10 requests allowed, 11th blocked.
  let blocked = false;
  for (let i = 0; i < 11; i++) {
    const result = await isRateLimited(env, '203.0.113.10');
    if (result) blocked = true;
  }
  assert.equal(blocked, true);
});
