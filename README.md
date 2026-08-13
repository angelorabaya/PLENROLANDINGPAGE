# PLENRO Misamis Oriental — Official Website

Official landing page and **AI Ordinance Assistant** for the Provincial Local Environment and Natural Resources Office (PLENRO) of Misamis Oriental, Philippines.

Built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **Framer Motion**. The site is exported as a **static site** (`output: 'export'`) and deployed to **Cloudflare Pages**, where a **Pages Function** powers the Gemini-based AI chat.

## ✨ Features

- Single-page landing: Hero, Department Head Message, Mandate, Team, Regulatory Framework & Fees, News & Activities (Facebook feed), Process Flow lightbox, Public Resources & Downloads, Location & Contact.
- **Contact form** in the Location & Contact section that emails inquiries to the office via the **Resend** API (server-side, secret key never exposed).
- Dark/light theme with system-preference detection.
- **PLENRO AI Assistant** chat widget grounded on official ordinances via **retrieval-augmented generation (RAG)**.
- Privacy-friendly Cloudflare Web Analytics (optional).
- Full SEO metadata, JSON-LD `GovernmentOffice` schema, `sitemap.xml`, and `robots.txt`.
- Accessibility: dialog semantics, focus trap, `aria-live` regions, and `prefers-reduced-motion` support.

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ (Node 18.17+ minimum for Next.js 16)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example and fill in your real values:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
| --- | --- | --- |
| `GEMINI_API_KEY` | Yes | Server-side Gemini API key. Create one at [AI Studio](https://aistudio.google.com/apikey). **Never** use a `NEXT_PUBLIC_` prefix — it is a server-only secret. |
| `GEMINI_MODELS` | No | Comma-separated Gemini model IDs to try in order. Defaults to `gemini-2.5-flash, gemini-2.0-flash, gemini-2.0-flash-lite, gemini-1.5-flash`. |
| `NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN` | No | Cloudflare Web Analytics token (inlined at build). Enables cookie-less analytics. |
| `FACEBOOK_PAGE_ID` | No* | Facebook Page ID for the News carousel (e.g. `789005134298348`). |
| `FACEBOOK_ACCESS_TOKEN` | No* | Facebook **Page Access Token** (server-side). Required to display the feed carousel; without it the section shows a "not configured" state. See [docs/facebook-feed-setup.md](docs/facebook-feed-setup.md). |
| `RESEND_API_KEY` | No* | Resend API key for the contact form (starts with `re_`). Create one at [resend.com/api-keys](https://resend.com/api-keys). Without it the form reports a "not configured" error. |
| `CONTACT_TO_EMAIL` | No* | Inbox that receives contact-form inquiries (e.g. `enro@misamisoriental.gov.ph`). |
| `CONTACT_FROM_EMAIL` | No | Verified Resend sender address, e.g. `no-reply@plenro.gov.ph`. Defaults to Resend's test sender `onboarding@resend.dev`, which can **only** deliver to your own account inbox. Add a verified domain in Resend for real sends. |

> `GEMINI_API_KEY` is read **only** by the Cloudflare Pages Function at request time — it is never bundled into the client. For local function testing it is read from `.env.local`.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The AI chat endpoint (`/api/chat`) is served locally by the dev-only App Router route handler at [`src/app/api/chat/route.ts`](src/app/api/chat/route.ts), which reuses the same shared chat logic. To test the exact production behavior (the Cloudflare Pages Function), use Cloudflare's local runtime:

```bash
npm run build
npx wrangler pages dev out
```

## 🧱 Project Structure

```
├── functions/
│   ├── api/chat.js          # Cloudflare Pages Function — POST /api/chat (SINGLE production path)
│   ├── api/contact.js       # Cloudflare Pages Function — POST /api/contact (contact form → Resend)
│   ├── api/facebook-posts.js# Cloudflare Pages Function — POST /api/facebook-posts (feed carousel)
│   └── lib/
│       ├── chat-core.mjs    # Pure, testable chat logic (sanitize, chunk, retrieve, prompt, rate-limit)
│       ├── chat-core.test.mjs
│       ├── contact.mjs      # Pure, testable contact validation + Resend send logic
│       ├── contact.test.mjs
│       ├── facebook-posts.mjs   # Pure, testable Graph API fetch + sanitize logic
│       └── facebook-posts.test.mjs
├── public/
│   ├── knowledge/           # ★ SINGLE SOURCE OF TRUTH for the AI knowledge base (.txt files)
│   └── *.pdf                # Downloadable public documents
└── src/
    ├── app/                 # Next.js App Router (layout, page, globals.css)
    │   └── api/             # Dev-only route handlers (chat + contact + facebook-posts) for npm run dev
    ├── components/landing/  # Landing sections, chat widget, contact form, Facebook feed carousel
    └── lib/
        └── regulatory-data.mjs  # ★ SINGLE SOURCE for fees/fines/permit tables (UI + prompt)
```

### ⚙️ Architecture note: the chat endpoint

The site is a **static export**, so Next.js App Router Route Handlers are **not** included in the production output (see [Next.js docs](https://nextjs.org/docs/app/guides/static-exports)). The `/api/chat` endpoint in production is served by the **Cloudflare Pages Function** at [`functions/api/chat.js`](functions/api/chat.js). For local development (`npm run dev`), the dev-only route handler at [`src/app/api/chat/route.ts`](src/app/api/chat/route.ts) serves the same endpoint using the same shared logic. Both:

1. Validate and sanitize input (HTML stripped, ≤ 500 chars, honeypot check).
2. Load the knowledge base from `public/knowledge/*.txt`.
3. **Retrieve the most relevant sections** for the query (RAG — term-overlap scoring, no external embedding service).
4. Send only the relevant context + bounded chat history (last 6 turns) to Gemini.
5. Authenticate via the `x-goog-api-key` header (never in the URL) and fail over across the configured model list.

> ⚠️ **API key format**: A valid Google Gemini API key starts with `AIza` and is ~39 characters long. If your key looks different (e.g., a long base64/OAuth-style string), it will not authenticate and the chat returns an error. Generate a key at [AI Studio](https://aistudio.google.com/apikey) and set it as `GEMINI_API_KEY` in `.env.local` (dev) and in the Cloudflare Pages dashboard (production).

## 📚 Maintaining the AI Knowledge Base

The knowledge base lives in [`public/knowledge/`](public/knowledge) as plain `.txt` files. Each file is a static asset on Cloudflare Pages.

To add or update knowledge:

1. Add/edit `.txt` files under `public/knowledge/`.
2. Register new files in the `KNOWLEDGE_FILES` array in [`functions/api/chat.js`](functions/api/chat.js) (the edge runtime cannot list directories).
3. Keep the structured tables in [`src/lib/regulatory-data.mjs`](src/lib/regulatory-data.mjs) in sync with the ordinance text — this single module drives **both** the website tables and the AI prompt.

Current files:

- `ordinances.txt` — Excerpts of Ordinance No. 1571-2022 (taxes, fees, fines for quarry/mineral resources).
- `republic act 7942 chapter 8.txt` — RA 7942, Chapter VIII (Quarry Resources).

## 📮 Contact Form (Resend)

The contact form in the **Office Location & Contact** section posts to `/api/contact`, which is served in production by the Cloudflare Pages Function at [`functions/api/contact.js`](functions/api/contact.js) and in dev by the route handler at [`src/app/api/contact/route.ts`](src/app/api/contact/route.ts). Both share the validation/email logic in [`functions/lib/contact.mjs`](functions/lib/contact.mjs).

The server:

1. Rate-limits per IP (same limiter as the chat endpoint).
2. Validates and sanitizes every field (HTML stripped, whitespace collapsed, length-bounded) and runs a honeypot bot check.
3. Builds a plain-text **and** HTML email (user input HTML-escaped) with the sender's address as `reply_to`.
4. Sends it through the Resend API using `RESEND_API_KEY` (never exposed to the client).

### Setup

1. Create an API key at [resend.com/api-keys](https://resend.com/api-keys) (starts with `re_`).
2. Set the environment variables (`.env.local` for dev, Cloudflare Pages dashboard → Settings → Environment Variables for production):

   | Variable | Purpose |
   | --- | --- |
   | `RESEND_API_KEY` | Resend API key (required). |
   | `CONTACT_TO_EMAIL` | Inbox that receives inquiries, e.g. `enro@misamisoriental.gov.ph` (required). |
   | `CONTACT_FROM_EMAIL` | Verified sender address (optional). |

3. **Verify a domain in Resend** (Resend → Domains) and use an address on it as `CONTACT_FROM_EMAIL` (e.g. `no-reply@plenro.gov.ph`). Until then the default test sender `onboarding@resend.dev` can only deliver to your own Resend account inbox — `CONTACT_TO_EMAIL` must then be the email you signed up with.

## 🚢 Deployment (Cloudflare Pages)

1. Push the repo to GitHub.
2. In the Cloudflare dashboard → **Workers & Pages** → **Create → Pages → Connect to Git**.
3. Build command: `npm run build` · Build output directory: `out`
4. Add the **`GEMINI_API_KEY`** environment variable (Settings → Environment Variables).
5. (Optional) Enable durable rate limiting: create a KV namespace and bind it as `RATE_LIMIT_KV` (Settings → Functions → KV namespace bindings). Without it, the function falls back to an in-memory limiter.

See [`wrangler.toml`](wrangler.toml) for a reference configuration.

## 🔒 Security Notes

- `GEMINI_API_KEY` is server-only; there is intentionally **no** `NEXT_PUBLIC_GEMINI_API_KEY` fallback.
- The Gemini API key is sent via the `x-goog-api-key` header so it never leaks into request URLs/logs.
- CORS is locked to `plenro.pages.dev`, its subdomains, and local development.
- A honeypot field, input sanitization, and per-IP rate limiting mitigate abuse.

## 🧪 Testing & Quality

```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm test            # Node built-in test runner (functions/lib/)
npm run build       # Production static export
```

A GitHub Actions workflow (`.github/workflows/ci.yml`) runs lint, type check, unit tests, and the production build on every push/PR.

## 📄 License

© Provincial Local Environment and Natural Resources Office — Misamis Oriental. All rights reserved.
