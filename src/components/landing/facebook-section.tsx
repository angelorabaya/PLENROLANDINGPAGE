'use client'

import { motion } from 'framer-motion'

import FacebookPageCard from './facebook-page-card'

/**
 * Dedicated section for the office's official Facebook Page.
 *
 * The section is a pure pointer: it renders static markup and one outbound
 * link, so it has no loading/error state and never depends on the Graph API.
 */
export default function FacebookSection() {
  return (
    <section id="facebook" className="py-24 px-6 bg-white dark:bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 rounded-full mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            Official Facebook Page
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base font-medium">
            Follow PLENRO Misamis Oriental for real-time announcements, field updates, and
            implementation photos.
          </p>
        </motion.div>

        {/* Official page card */}
        <FacebookPageCard />
      </div>
    </section>
  )
}
