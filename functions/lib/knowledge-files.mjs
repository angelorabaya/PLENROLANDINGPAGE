/**
 * Single source of truth for the AI knowledge-base file list.
 *
 * Both the Cloudflare Pages Function (functions/api/chat.js) and the dev-only
 * Next.js route handler (src/app/api/chat/route.ts) import this array so new
 * knowledge files are registered in exactly one place.
 *
 * Files live under public/knowledge/ and are loaded at request time:
 *  - Cloudflare Pages Function loads them via `env.ASSETS`.
 *  - Next.js dev route handler reads them from disk with `fs`.
 *
 * Keep this list in sync with the actual files in public/knowledge/.
 */
export const KNOWLEDGE_FILES = [
  'ordinances.txt',
  'republic act 7942 chapter 8.txt',
];
