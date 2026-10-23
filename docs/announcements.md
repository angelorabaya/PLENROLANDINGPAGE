# Announcements Section — How to Update

The **Latest Activities & Implementations** section of the home page no longer
loads a live Facebook feed. It now shows:

1. a short, hand-curated **announcements list**, and
2. an **Official Facebook Page** card that links out to
   <https://www.facebook.com/789005134298348>.

No access token, no Graph API version, no rate limiting, and no third-party
scripts — so the section cannot fail to load.

## Where the content lives

| Item | File |
| --- | --- |
| Announcement entries | [`src/lib/announcements.ts`](../src/lib/announcements.ts) |
| Announcements UI | [`src/components/landing/announcements-list.tsx`](../src/components/landing/announcements-list.tsx) |
| Facebook page card | [`src/components/landing/facebook-page-card.tsx`](../src/components/landing/facebook-page-card.tsx) |
| Section layout | [`src/components/landing/news-section.tsx`](../src/components/landing/news-section.tsx) |

## Adding or editing an announcement

Open [`src/lib/announcements.ts`](../src/lib/announcements.ts) and add an object
to the `announcements` array:

```ts
{
  id: 'unique-slug',                 // React key; must be unique
  date: '2026-10-06',                // ISO date
  title: 'Short headline',           // 1 line
  summary: 'One or two sentences.',  // plain text, no HTML
  href: '/quarry.pdf',               // local file OR a Facebook post URL
  hrefLabel: 'See requirements',     // optional link text
  external: false,                   // optional; auto-detected for http(s) links
  tag: 'Permits',                    // optional small label
  image: '/images/hero-landscape.webp', // optional, unused by default layout
}
```

Rules of thumb:

- Keep the list to **~5 items**; the newest date is shown first automatically
  (see `getAnnouncements()`).
- Prefer official documents already hosted on this site
  (`/citizencharter.pdf`, `/ordinance.pdf`, `/quarry.pdf`, `/sag.pdf`,
  `/renewal.pdf`, `/application.pdf`, …) for anything regulatory.
- Use a Facebook **post permalink** (not the page URL) when the announcement is
  about a specific field activity.
- Only ASCII/typographic apostrophes and plain text — no markdown, no HTML.

## Deploying

```bash
npm run build
```

The site is a static export (`output: 'export'`), so the list is baked into the
HTML at build time. Announcements therefore appear after a rebuild/redeploy, not
instantly.

## Facebook integration status

- `POST /api/facebook-posts`, [`functions/api/facebook-posts.js`](../functions/api/facebook-posts.js),
  [`functions/lib/facebook-posts.mjs`](../functions/lib/facebook-posts.mjs) and
  [`src/components/landing/facebook-carousel.tsx`](../src/components/landing/facebook-carousel.tsx)
  are **retained but no longer rendered**. They still work if you want to switch
  the live feed back on.
- The `FACEBOOK_PAGE_ID`, `FACEBOOK_ACCESS_TOKEN`, and `FACEBOOK_API_VERSION`
  environment variables are no longer required. You may remove them from
  `.env.local` and from Cloudflare Pages → Settings → Environment Variables.
- See [`facebook-feed-setup.md`](./facebook-feed-setup.md) if you ever need to
  regenerate a token and re-enable the carousel.
