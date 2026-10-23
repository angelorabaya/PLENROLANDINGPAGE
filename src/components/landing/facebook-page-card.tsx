'use client'

import { motion } from 'framer-motion'
import { BadgeCheck, ExternalLink } from 'lucide-react'

import { FACEBOOK_PAGE_NAME, FACEBOOK_PAGE_URL } from '@/lib/announcements'

/**
 * Static pointer to the official Facebook Page.
 *
 * Deliberately does NOT embed the Page plugin or call the Graph API: no access
 * token to expire, no Meta scripts/cookies on this site, and it renders even on
 * networks that block facebook.com.
 */
export default function FacebookPageCard() {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full lg:max-w-sm mx-auto rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/60 shadow-lg shadow-gray-200/50 dark:shadow-none p-6"
      aria-label="Official Facebook Page"
    >
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shrink-0">
          <svg
            className="w-5 h-5 text-white"
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
          <p className="text-sm font-semibold text-gray-900 dark:text-white leading-snug">
            {FACEBOOK_PAGE_NAME}
          </p>
          <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            <BadgeCheck size={12} aria-hidden="true" />
            Official Facebook Page
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        Real-time updates, regulatory announcements, and field implementation
        photos are posted on our official Facebook Page. This website lists only
        selected announcements.
      </p>

      <a
        href={FACEBOOK_PAGE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex w-full items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 hover:scale-[1.02] active:scale-95 cursor-pointer"
      >
        Visit our official Facebook Page
        <ExternalLink size={15} aria-hidden="true" />
      </a>

      <p className="mt-3 text-[11px] text-gray-400 dark:text-gray-500 text-center leading-relaxed">
        Opens facebook.com in a new tab. No Facebook content is loaded on this
        website.
      </p>
    </motion.aside>
  )
}
