'use client'

import { motion } from 'framer-motion'
import { Download, FileText } from 'lucide-react'

const additionalDownloads = [
  {
    name: 'Download Ordinance No. 1571-2022',
    url: '/ordinance.pdf',
  },
  {
    name: 'Download Application Form',
    url: '/application.pdf',
  },
  {
    name: 'Requirements and Process Flow for New Application for Industrial and Commercial Sand and Gravel Permit',
    url: '/sag.pdf',
  },
  {
    name: 'Requirements and Process Flow for New Application for Quarry Permit',
    url: '/quarry.pdf',
  },
  {
    name: 'Requirements and Process Flow for Renewal Application of Quarry Permit, Commercial Sand and Industrial Sand and Gravel Permit',
    url: '/renewal.pdf',
  },
  {
    name: 'Application for Registration of Dealer, Trader or Retailer of Sand, Gravel, Other Quarry Resources, Its Products and By-Products',
    url: '/trader.pdf',
  },
  {
    name: 'Private Gratuitous Permit Application',
    url: '/privategratuitous.pdf',
  },
  {
    name: 'Requirements for Government Gratuitous Permit Application',
    url: '/publicgratuitous.pdf',
  },
]



export default function ResourcesSection() {
  return (
    <section id="resources" className="py-24 px-6">
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
            Public Resources &amp; Downloads
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Access official documents and regulatory guidelines.
          </p>
        </motion.div>

        {/* Centered Column - Downloads */}
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-4 text-center">
              Official Documents
            </h3>

            {/* Additional Downloads */}
            <div className="rounded-2xl p-4 bg-white dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50">
              {additionalDownloads.map((item, index) => (
                <a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group ${
                    index !== additionalDownloads.length - 1 ? 'border-b border-gray-100 dark:border-gray-700/50' : ''
                  }`}
                >
                  <FileText size={18} className="text-gray-500 dark:text-gray-400 shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{item.name}</span>
                  <Download size={14} className="text-gray-400 dark:text-gray-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors ml-auto shrink-0" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
