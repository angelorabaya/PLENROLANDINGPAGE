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
  },
  {
    image: '/images/checkpoint-enforcement.jpg',
    category: 'Enforcement',
    categoryClasses: 'bg-red-500/10 text-red-600',
    date: 'May 2026',
    title: 'Joint Anti-Illegal Mining Enforcement',
    description:
      'Successful joint checkpoint operations with law enforcement to intercept unauthorized mineral ore shipments, including recent operations in Barangay Limonda, Opol.',
  },
  {
    image: '/images/bamboo-reforestation.jpg',
    category: 'Reforestation',
    categoryClasses: 'bg-teal-500/10 text-teal-600',
    date: 'April 2026',
    title: 'Provincial Bamboo Reforestation Drive',
    description:
      'Orientation and planting programs in Gitagum and Libertad addressing environmental erosion while creating sustainable community livelihoods through bamboo cultivation.',
  },
  {
    image: '/images/ecotourism-coastal.jpg',
    category: 'Ecotourism',
    categoryClasses: 'bg-cyan-500/10 text-cyan-600',
    date: 'March 2026',
    title: 'Ecotourism & Coastal Management Realignment',
    description:
      'PLENRO partnership with DENR-10 to expand green ecotourism and streamline tenurial instruments for sustainable coastal development.',
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
                  href="#"
                  className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400 group-hover:gap-2 transition-all"
                >
                  Read More
                  <ArrowRight size={14} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
