'use client'

import { motion } from 'framer-motion'
import { BadgeCheck, Bell, ExternalLink, Image as ImageIcon, Megaphone } from 'lucide-react'

import {
  FACEBOOK_PAGE_DESCRIPTION,
  FACEBOOK_PAGE_HANDLE,
  FACEBOOK_PAGE_NAME,
  FACEBOOK_PAGE_URL,
} from '@/lib/facebook-page'

const highlights = [
  {
    icon: Megaphone,
    title: 'Regulatory advisories',
    text: 'Issuances, reminders, and office announcements.',
  },
  {
    icon: ImageIcon,
    title: 'Field updates',
    text: 'Monitoring, enforcement, and community activities.',
  },
  {
    icon: Bell,
    title: 'Real-time posts',
    text: 'Published on Facebook the moment they happen.',
  },
]

/**
 * The official Facebook Page showcase.
 *
 * Deliberately does NOT embed the Page plugin or call the Graph API: no access
 * token to expire, no Meta scripts/cookies on this site, and it renders even on
 * networks that block facebook.com.
 */
export default function FacebookPageCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mx-auto w-full max-w-3xl rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/60 shadow-xl shadow-gray-200/60 dark:shadow-none overflow-hidden"
    >
      {/* Brand band */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 px-6 py-5 sm:px-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center shrink-0">
            <svg
              className="w-6 h-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-base sm:text-lg font-display font-bold text-white leading-snug">
              {FACEBOOK_PAGE_NAME}
            </p>
            <p className="mt-1 inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-blue-50/90">
              <BadgeCheck size={13} aria-hidden="true" />
              Official Facebook Page
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-6 sm:px-8 sm:py-8">
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {FACEBOOK_PAGE_DESCRIPTION}. All live updates, regulatory
          announcements, and field implementation photos are posted on the
          official Facebook Page.
        </p>

        <ul className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {highlights.map((item) => (
            <li
              key={item.title}
              className="rounded-xl border border-gray-100 dark:border-gray-700/60 bg-gray-50/70 dark:bg-gray-900/30 p-4"
            >
              <item.icon
                size={16}
                className="text-emerald-600 dark:text-emerald-400"
                aria-hidden="true"
              />
              <p className="mt-2 text-xs font-semibold text-gray-900 dark:text-white">
                {item.title}
              </p>
              <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                {item.text}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <a
            href={FACEBOOK_PAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            Visit our official Facebook Page
            <ExternalLink size={15} aria-hidden="true" />
          </a>
          <span className="text-[11px] sm:text-xs text-gray-400 dark:text-gray-500 font-medium">
            {FACEBOOK_PAGE_HANDLE}
          </span>
        </div>

        <p className="mt-4 text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed">
          Opens facebook.com in a new tab. No Facebook content or tracking is
          loaded on this website.
        </p>
      </div>
    </motion.div>
  )
}
