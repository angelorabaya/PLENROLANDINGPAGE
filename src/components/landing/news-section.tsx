'use client'

import { motion } from 'framer-motion'

import AnnouncementsList from './announcements-list'
import FacebookPageCard from './facebook-page-card'

export default function NewsSection() {
  return (
    <section id="news" className="py-24 px-6 bg-white dark:bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 rounded-full mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            Latest Activities & Implementations
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base font-medium">
            Stay updated with our real-world programs driving regulatory compliance, environmental protection, and community development.
          </p>
        </motion.div>

        {/* Centered: Announcements heading + caption */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h3 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-gray-900 dark:text-white">
            Announcements and official updates
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed text-sm md:text-base font-medium mt-3">
            Selected announcements are published here. For real-time field updates, regulatory
            advisories, and photos, visit our official Facebook Page.
          </p>
        </motion.div>

        {/* Announcements + official Facebook page pointer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-8 items-start"
        >
          <AnnouncementsList />
          <FacebookPageCard />
        </motion.div>
      </div>
    </section>
  )
}
