'use client'

import { motion } from 'framer-motion'
import { ArrowRight, CalendarDays, ExternalLink } from 'lucide-react'

import {
  formatAnnouncementDate,
  getAnnouncements,
} from '@/lib/announcements'

/**
 * Curated announcements. Content lives in src/lib/announcements.ts — no network
 * request, so the section can never show a "failed to load" state.
 */
export default function AnnouncementsList() {
  const items = getAnnouncements()

  if (items.length === 0) return null

  return (
    <ul className="space-y-3">
      {items.map((item, index) => {
        const isExternal = item.external ?? item.href.startsWith('http')
        return (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.3) }}
          >
            <a
              href={item.href}
              {...(isExternal
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
              className="group block rounded-2xl border border-gray-200/70 dark:border-gray-700/70 bg-white dark:bg-gray-800/50 p-5 hover:border-emerald-500/40 dark:hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 hover:scale-[1.01] active:scale-[0.995] transition-all duration-300"
            >
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wide">
                {item.tag && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                    {item.tag}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-gray-400 dark:text-gray-500 font-medium normal-case tracking-normal">
                  <CalendarDays size={12} aria-hidden="true" />
                  {formatAnnouncementDate(item.date)}
                </span>
              </div>

              <h4 className="mt-2 text-base font-display font-bold text-gray-900 dark:text-white leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                {item.title}
              </h4>

              <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {item.summary}
              </p>

              <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {item.hrefLabel || 'Read more'}
                {isExternal ? (
                  <ExternalLink
                    size={12}
                    aria-hidden="true"
                    className="transition-transform group-hover:-translate-y-0.5"
                  />
                ) : (
                  <ArrowRight
                    size={12}
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                )}
              </span>
            </a>
          </motion.li>
        )
      })}
    </ul>
  )
}
