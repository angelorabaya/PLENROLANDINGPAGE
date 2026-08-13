# Facebook Feed Carousel — App & Token Setup Guide

This guide shows how to display your **PLENRO Facebook Page posts** as a carousel on the *Latest Activities & Implementations* section.

The website fetches posts through a **server-side proxy** (`/api/facebook-posts`) that calls the Facebook **Graph API**, so your access token is **never exposed to visitors**. You only need to do the steps below **once** to generate the credentials.

---

## Prerequisites

- You are an **Admin of the PLENRO Facebook Page**.
- You have (or can create) a personal Facebook account.
- A web browser.

> The page ID is the one returned by the Graph API for your page. For the PLENRO page it is **`789005134298348`** (verify with `GET /me?fields=id,name` using your Page token — the ID in the page's URL is NOT the Graph API page ID).

---

## Step 1 — Create a Facebook App

> ⚠️ **Important — pick the RIGHT app type.** In the "Create App" screen you will see several options such as **Business**, **Consumer**, **Gaming**, and possibly **Meta Model API** (or "Meta Llama"). **Do NOT select "Meta Model API"** — that is Meta's AI model service for running LLM inference, and it is **not** what reads your Facebook page posts. We need the **Graph API** to fetch page content.
>
> Choose **Business** (recommended for reading a Page you manage) or **Consumer**.

1. Go to <https://developers.facebook.com/> and **log in** with your Facebook account.
2. Click **My Apps** (top-right) → **Create App**.
3. Enter an **App name** (e.g., `PLENRO Feed Reader`), your contact email, and click **Create App**.
4. When asked *"Add products to your app?"*, add **Facebook Login for Business** (or **Facebook Login**) — do **not** add the Model API / Llama product.
   - You do **not** need to fully implement login — this just enables the required permissions.

---

## 🧭 What you have vs. what you need

This is the most common point of confusion. There are **three different secrets** in Meta's dashboard — only one of them is what the website needs.

| Credential | Where to find it | Looks like | Do you need it? |
| --- | --- | --- | --- |
| **App ID** | Settings → Basic | `1234567890123456` (number) | No — used only when generating the token. |
| **App Secret** | Settings → Basic (click Show) | `a1b2c3...` (alphanumeric) | No — only used to *extend* a token's lifetime. |
| **Threads secret** / other product secrets | product settings | varies | **No** — ignore it. You did **not** create a Threads app; this is a leftover product tab. |
| **Page Access Token** ⭐ | **Graph API Explorer** (NOT in Settings) | `EAA...` (long string) | **YES — this is the one** you put in `FACEBOOK_ACCESS_TOKEN`. |

> The **Page Access Token is never shown in Settings → Basic**. It does **not** come from the App Secret. You must generate it in the **Graph API Explorer** as described below. The App ID/Secret/Threads-secret you found are not what the carousel needs.

---

## Step 2 — Find your App ID and App Secret (only needed for Step 5)

1. In the app dashboard, open **Settings → Basic**.
2. Note down (you will use these only to extend the token in Step 5):
   - **App ID** (e.g., `1234567890123456`)
   - **App Secret** (click *Show* and verify your password). Keep it secret — never put it in client code.

> If your app is still in **Development mode**, the token you generate will only work for the app's admins/testers — which is fine because you are an admin. For a public production feed read by all visitors, the server-side proxy uses the token, so Development mode is acceptable for read-only page posts.

---

## Step 3 — Get a Page Access Token (this is the key step)

The fastest way to get the Page Access Token is directly from the **Graph API Explorer** — no coding, and it does **not** require the App Secret.

1. Open the **Graph API Explorer**: <https://developers.facebook.com/tools/explorer/>
2. Top-right dropdown: select your **PLENRO Feed Reader** app (the one you just created).
3. In the **token / permissions** area, click **Add permissions** (or the "Generate Access Token" flow) and add:
   - `pages_read_engagement` (required to read your Page's posts)
   - `pages_show_list` (to list the pages you manage)
4. Click **Generate Access Token**, log in with the account that **manages the PLENRO page**, and allow the requested permissions.
5. This generates a **User Access Token**. To turn it into a **Page Access Token**, set the **node/edge** field (top-left, next to the token box) to:
   ```
   me/accounts
   ```
   and click **Submit** (or the blue "Submit" / refresh button).
6. In the JSON response, find your **PLENRO** page object. It contains:
   - `id` (the real page ID, e.g. `789005134298348`) — use this for `FACEBOOK_PAGE_ID`
   - `access_token` — a long string starting with `EAA...` — **this is the Page Access Token**.
7. Copy that `access_token` value into `FACEBOOK_ACCESS_TOKEN`. It is scoped only to your page.

> **Having trouble with `me/accounts`?** If it returns *"Tried accessing nonexisting field (accounts)"*, your token is a **Page token**, not a User token — that's fine. Instead run `GET /me?fields=id,name` with the same token to get your page's `id` and confirm the token works.

> **Still not finding it?** Check that the account you're logged into in the Explorer is an **admin** of the PLENRO page, and that `me/accounts` returned your page. If it returned an empty `data` array, you're logged into an account that doesn't manage that page.

---

## Step 4 — (Optional) Verify the Page Access Token

Paste this into your browser (replace the token) — it should return the page name and id:
```
https://graph.facebook.com/v21.0/789005134298348?fields=name,id&access_token=EAA...
```
If it returns `{"name": "...", "id": "789005134298348"}` your token works.

---

## Step 5 — Make the token long-lived (optional but recommended)

Page tokens generated from a **long-lived** user token do not expire. To extend:

1. Take your **short-lived User token** from Step 3.
2. Visit this URL in your browser (replace placeholders):
   ```
   https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id={APP_ID}&client_secret={APP_SECRET}&fb_exchange_token={SHORT_LIVED_USER_TOKEN}
   ```
3. The response contains a `access_token` (long-lived User token, ~60 days).
4. Now exchange that **long-lived User token** for a **Page token** (Step 3 again, using the long-lived user token). The resulting Page token is long-lived.
5. Optionally, set **Settings → Advanced → App Mode** to **Live** once ready.

---

## Step 6 — Save the credentials

You need two values:

| Variable | Value | Where |
| --- | --- | --- |
| `FACEBOOK_PAGE_ID` | `789005134298348` | Page ID (from `GET /me` with the Page token) |
| `FACEBOOK_ACCESS_TOKEN` | `EAA...` (long string) | Page Access Token from Step 3 (and Step 5 for the long-lived version) |

- **Local dev:** add both to `.env.local`
- **Production (Cloudflare Pages):** add both under **Settings → Environment Variables** (or via `wrangler.toml` `[vars]`)

> The token starts with `EAA` (or `EAAG...`) and is long. Treat it like a password — never commit it to Git (`.env.local` is already git-ignored).

---

## Step 7 — Test the API (optional)

After the code is implemented, the endpoint is a **POST** request (the carousel calls it automatically):
- Local: `http://localhost:3000/api/facebook-posts`
- Production: `https://plenro.pages.dev/api/facebook-posts`

POST is used so the endpoint works both under `npm run dev` (via the Next.js route handler) and in production (via the Cloudflare Pages Function) without conflicting with the site's static export.

You can test it from a terminal (replace with your token):
```bash
curl -X POST http://localhost:3000/api/facebook-posts -H "Content-Type: application/json" -d "{}"
```

It returns JSON like:
```json
{
  "posts": [
    {
      "id": "789005134298348_1234567890",
      "message": "PLENRO joins the Provincial Bamboo Reforestation...",
      "full_picture": "https://scontent.fcgd1-1.fna.fbcdn.net/...",
      "permalink_url": "https://www.facebook.com/...",
      "created_time": "2026-08-01T09:30:00+0000"
    }
  ]
}
```

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `(#10) To use 'Page Public Content Access'...` | Your app/token lacks the read permission; confirm `pages_read_engagement` and that you are a Page admin. |
| Empty `posts` array | The page may have no public posts, or the token is a User token not a Page token. Re-check Step 3 (get the page's `access_token` from `me/accounts`). |
| Token expires | If you used a short-lived token, repeat Step 5 to get a long-lived Page token. |
| `App not set up` / permissions denied | Ensure the app is in Development mode with you as an admin (works for page reads), or move to Live mode. |
| You only see App ID / App Secret / Threads secret | Those are **not** the access token. The **Page Access Token** (`EAA...`) is generated in the **Graph API Explorer** (`me/accounts`), not in Settings. See the "What you have vs. what you need" table above. |
| `(190) Error validating access token: The session is invalid because the user logged out` | The token is invalid/expired. You likely copied the **User token from the top of the Explorer** instead of the **Page token inside `me/accounts`**, or you logged out of the Facebook session that issued it. Generate a fresh token (Step 3), copy the page's `access_token` from the `me/accounts` JSON, and keep that Facebook session logged in. Make it long-lived (Step 5) so it survives 60 days. |
