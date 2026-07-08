'use client'

import { motion } from 'framer-motion'
import { Calendar, ArrowRight, ExternalLink } from 'lucide-react'

const newsItems = [
  {
    image: '/images/mining-training.jpg',
    category: 'Capacity Building',
    categoryClasses: 'bg-emerald-500/10 text-emerald-600',
    date: 'June 2026',
    title: '2026 Small-Scale Mining Capacity Building',
    description:
      'A collaborative program between MGB-X and PLENRO providing Skills and Safety Training for miners in Opol and Manticao to enforce regulatory compliance inside Minahang Bayan areas.',
    url: 'https://www.facebook.com/profile.php?id=61581984893275',
  },
  {
    image: '/images/checkpoint-enforcement.jpg',
    category: 'Enforcement',
    categoryClasses: 'bg-red-500/10 text-red-600',
    date: 'May 2026',
    title: 'Joint Anti-Illegal Mining Enforcement',
    description:
      'Successful joint checkpoint operations with law enforcement to intercept unauthorized mineral ore shipments, including recent operations in Barangay Limonda, Opol.',
    url: 'https://www.facebook.com/profile.php?id=61581984893275',
  },
  {
    image: '/images/bamboo-reforestation.jpg',
    category: 'Reforestation',
    categoryClasses: 'bg-teal-500/10 text-teal-600',
    date: 'April 2026',
    title: 'Provincial Bamboo Reforestation Drive',
    description:
      'Orientation and planting programs in Gitagum and Libertad addressing environmental erosion while creating sustainable community livelihoods through bamboo cultivation.',
    url: 'https://www.facebook.com/profile.php?id=61581984893275',
  },
  {
    image: '/images/ecotourism-coastal.jpg',
    category: 'Ecotourism',
    categoryClasses: 'bg-cyan-500/10 text-cyan-600',
    date: 'March 2026',
    title: 'Ecotourism & Coastal Management Realignment',
    description:
      'PLENRO partnership with DENR-10 to expand green ecotourism and streamline tenurial instruments for sustainable coastal development.',
    url: 'https://www.facebook.com/profile.php?id=61581984893275',
  },
]

export default function NewsSection() {
  return (
    <section id="news" className="py-24 px-6 bg-gray-50/50 dark:bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Latest Activities &amp; Implementations
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Real-world programs driving regulatory compliance, environmental protection, and community development.
          </p>
        </motion.div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {newsItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group rounded-2xl overflow-hidden bg-white dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                {/* Category Badge */}
                <span
                  className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${item.categoryClasses}`}
                >
                  {item.category}
                </span>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                  <Calendar size={14} />
                  <span>{item.date}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                  {item.description}
                </p>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                >
                  Read on Facebook
                  <ExternalLink size={14} className="ml-1" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <a
            href="https://www.facebook.com/profile.php?id=61581984893275"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-semibold hover:scale-105 transition-all duration-300"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            View All Activities on Facebook
          </a>
        </motion.div>
      </div>
    </section>
  )
}
