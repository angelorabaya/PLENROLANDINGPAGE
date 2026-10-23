# Official Facebook Page Section

The home page has a dedicated **Official Facebook Page** section (`#facebook`).
It does not show posts, embed a plugin, or call the Graph API. It renders a
static card that links out to
<https://www.facebook.com/789005134298348>.

## Why there is no live feed

The previous carousel called the Graph API with a Page Access Token. Those
tokens expire (the configured one expired on 2026-10-10) and Meta also retires
each Graph API version after ~2 years, so the section kept breaking for reasons
outside the site's control. A link-only section has:

- no token, no expiry, no rate limit, nothing to renew;
- no Meta scripts or cookies loaded on `plenro.pages.dev` (safer under the Data
  Privacy Act — visitors reach Facebook only when they click);
- guaranteed rendering on networks that block Facebook;
- zero maintenance: nothing to re-verify after a Facebook or Meta change.

## Files

| Item | File |
| --- | --- |
| Section (heading + layout, anchors `#facebook`) | [`src/components/landing/facebook-section.tsx`](../src/components/landing/facebook-section.tsx) |
| Card UI (brand band, features, button) | [`src/components/landing/facebook-page-card.tsx`](../src/components/landing/facebook-page-card.tsx) |
| Page name, description, URL, handle | [`src/lib/facebook-page.ts`](../src/lib/facebook-page.ts) |

## Changing the page details

Edit [`src/lib/facebook-page.ts`](../src/lib/facebook-page.ts):

```ts
export const FACEBOOK_PAGE_URL = 'https://www.facebook.com/789005134298348'
export const FACEBOOK_PAGE_NAME = 'PLENRO Misamis Oriental'
export const FACEBOOK_PAGE_DESCRIPTION =
  'Provincial Local Environment and Natural Resources Office — ...'
export const FACEBOOK_PAGE_HANDLE = 'facebook.com/789005134298348'
```

All four are used by the card, so updating the file is enough. The card also
appears in:

- the navbar — `{ label: 'Facebook', href: '#facebook' }` in
  [`navbar.tsx`](../src/components/landing/navbar.tsx),
- the footer quick links — `Official Facebook Page` → `#facebook` in
  [`footer.tsx`](../src/components/landing/footer.tsx).

## Deploying

```bash
npm run build   # static export; the card is baked into the HTML
```

Then commit and push to `master`; the GitHub Action in
[`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) deploys `out/`
to Cloudflare Pages.

## Legacy code

`facebook-carousel.tsx`, `functions/api/facebook-posts.js`,
`functions/lib/facebook-posts.mjs`, `src/app/api/facebook-posts/route.ts` and
their tests are retained but no longer rendered/needed. The `FACEBOOK_*`
environment variables are unused. See
[`facebook-feed-setup.md`](./facebook-feed-setup.md) only if you want to bring
the live feed back.
