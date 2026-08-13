'use client'

import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import FacebookCarousel from './facebook-carousel'

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

        {/* Centered: Live updates heading + caption */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h3 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-gray-900 dark:text-white">
            Live updates directly from the field
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed text-sm md:text-base font-medium mt-3">
            We regularly post updates, regulatory announcements, and field implementation photos on our official Facebook Page. Check the live feed below to see our latest works.
          </p>
        </motion.div>

        {/* Centered: Facebook Posts Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex justify-center"
        >
          <FacebookCarousel />
        </motion.div>

        {/* Centered: Follow button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center mt-10"
        >
          <a
            href="https://www.facebook.com/789005134298348"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 hover:scale-105 active:scale-95 text-sm cursor-pointer"
          >
            Follow our Facebook Page
            <ExternalLink size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
