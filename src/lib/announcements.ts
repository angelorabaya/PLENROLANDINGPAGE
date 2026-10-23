/**
 * Curated announcements shown in the "Latest Activities" section of the home
 * page.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * The section used to render a live Facebook Graph API feed. That required a
 * Page Access Token that expires (and an API version that Meta retires), which
 * repeatedly broke the section. Instead we keep a small, hand-curated list here
 * and point visitors to the official Facebook Page for the real-time feed.
 *
 * HOW TO UPDATE (no token, no build tooling beyond `npm run build`)
 * ---------------------------------------------------------------
 * 1. Add a new object to the TOP of the `announcements` array.
 * 2. `date`  — ISO date string, e.g. '2026-10-06' (used for sorting/display).
 * 3. `title` — short headline (1 line).
 * 4. `summary` — 1–2 sentences, plain text (no HTML).
 * 5. `href`  — where the card links. Use a Facebook post URL, or a local file
 *              such as '/quarry.pdf'.
 * 6. Optional: `image` (a file under /public, e.g. '/images/hero-landscape.webp'),
 *              `tag` (small label, e.g. 'Announcement'), `hrefLabel`.
 * 7. Keep the list to ~5 items; the list is intentionally short so the section
 *    stays scannable.
 *
 * Nothing here talks to Facebook, so the section cannot fail to load.
 */

export const FACEBOOK_PAGE_URL = 'https://www.facebook.com/789005134298348'
export const FACEBOOK_PAGE_NAME = 'PLENRO Misamis Oriental'

export type Announcement = {
  /** Stable unique id (used as the React key). */
  id: string
  /** ISO date, e.g. '2026-10-06'. */
  date: string
  title: string
  summary: string
  /** Target URL — a Facebook post permalink or a local file/route. */
  href: string
  /** Overrides the default "Read more" link text. */
  hrefLabel?: string
  /** Set true for links that leave the site. */
  external?: boolean
  /** Small label shown next to the date. */
  tag?: string
  /** Optional image under /public, e.g. '/images/hero-landscape.webp'. */
  image?: string
}

export const announcements: Announcement[] = [
  {
    id: 'citizen-charter-2026',
    date: '2026-10-06',
    title: "Updated Citizen's Charter now available",
    summary:
      "The office's current Citizen's Charter — including frontline services, requirements, and processing times — can be viewed and downloaded from our Downloads section.",
    href: '/citizencharter.pdf',
    hrefLabel: 'View the Citizen’s Charter',
    tag: 'Announcement',
  },
  {
    id: 'quarry-renewal-reminder',
    date: '2026-09-22',
    title: 'Reminder: quarry permit renewal requirements',
    summary:
      'Permit holders are reminded to file renewals early. The complete requirements and process flow for renewal of quarry and sand and gravel permits are published online.',
    href: '/renewal.pdf',
    hrefLabel: 'See renewal requirements',
    tag: 'Permits',
  },
  {
    id: 'ordinance-1571-2022',
    date: '2026-09-08',
    title: 'Ordinance No. 1571-2022 published',
    summary:
      'The full text of Ordinance No. 1571-2022 is available for download, together with the regulatory tables used across this website.',
    href: '/ordinance.pdf',
    hrefLabel: 'Download the ordinance',
    tag: 'Regulation',
  },
  {
    id: 'field-updates-on-facebook',
    date: '2026-08-27',
    title: 'Field implementation photos and updates',
    summary:
      'Photos and short updates from monitoring, enforcement, and community activities are posted as they happen on our official Facebook Page.',
    href: FACEBOOK_PAGE_URL,
    hrefLabel: 'See the latest posts',
    external: true,
    tag: 'Field updates',
  },
]

const DATE_FORMAT = new Intl.DateTimeFormat('en-PH', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

/** Format an ISO date for display; returns '' for invalid input. */
export function formatAnnouncementDate(iso: string): string {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? '' : DATE_FORMAT.format(date)
}

/** Announcements sorted newest-first (defensive: the array may be edited). */
export function getAnnouncements(): Announcement[] {
  return [...announcements].sort((a, b) => {
    const aTime = new Date(a.date).getTime()
    const bTime = new Date(b.date).getTime()
    return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime)
  })
}
