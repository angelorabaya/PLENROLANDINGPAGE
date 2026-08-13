'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Truck, AlertTriangle, ChevronDown } from 'lucide-react'
import { permitTypes, registrationFeesData, finesData } from '@/lib/regulatory-data.mjs'

const tabs = [
  { key: 'permits', label: 'Permit Types', icon: FileText },
  { key: 'logistics', label: 'Vehicle and Equipment Registration Fee', icon: Truck },
  { key: 'compliance', label: 'Fines & Compliance', icon: AlertTriangle },
] as const

type TabKey = (typeof tabs)[number]['key']

export default function RegulatorySection() {
  const [activeTab, setActiveTab] = useState<TabKey>('permits')
  const [expandedPermit, setExpandedPermit] = useState<string | null>(null)

  return (
    <section
      id="regulatory-framework"
      className="py-24 px-6"
    >
      <div className="max-w-7xl mx-auto">
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
            Regulatory Framework &amp; Fees
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base font-medium">
            Public transparency portal — Access permit fees, logistics guidelines, and compliance requirements.
          </p>
        </motion.div>

        {/* Tab Bar */}
        <div className="flex gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800 max-w-2xl mx-auto mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-gray-700 shadow-md text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'permits' && (
            <motion.div
              key="permits"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                {permitTypes.map((permit, index) => {
                  const isExpanded = expandedPermit === permit.name
                  const hasDefinition = !!permit.definition

                  return (
                    <motion.div
                      key={permit.name}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.08 }}
                      layout
                      className={`rounded-xl bg-white dark:bg-gray-800/40 border transition-all duration-300 ${
                        isExpanded
                          ? 'border-emerald-500/40 dark:border-emerald-500/30 shadow-xl shadow-emerald-500/5 md:col-span-2 lg:col-span-3'
                          : 'border-gray-200 dark:border-gray-700/50 hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-500/35 dark:hover:border-emerald-500/25 hover:scale-[1.03] active:scale-[0.99]'
                      } ${hasDefinition ? 'cursor-pointer' : ''}`}
                      onClick={() => {
                        if (hasDefinition) {
                          setExpandedPermit(isExpanded ? null : permit.name)
                        }
                      }}
                    >
                      <div className="p-5 flex flex-col justify-between min-h-[140px]">
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-display font-bold text-gray-900 dark:text-white text-base">
                            {permit.name}
                          </p>
                          {hasDefinition && (
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                              className="flex-shrink-0 mt-0.5"
                            >
                              <ChevronDown className="w-4.5 h-4.5 text-emerald-500 dark:text-emerald-400" />
                            </motion.div>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-auto pt-3">
                          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Validity:</span>
                          <span className={`text-sm font-bold px-2.5 py-1 rounded-lg ${
                            permit.validity.includes('5')
                              ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-500/20'
                              : 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20'
                          }`}>
                            {permit.validity}
                          </span>
                          {hasDefinition && !isExpanded && (
                            <span className="ml-auto text-xs text-emerald-600/60 dark:text-emerald-400/50 font-medium">
                              Tap to learn more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Expandable Definition */}
                      <AnimatePresence>
                        {isExpanded && permit.definition && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5">
                              <div className="border-t border-gray-200/70 dark:border-gray-700/50 pt-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                                  Definition
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                                  {permit.definition}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'logistics' && (
            <motion.div
              key="logistics"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              {/* Table */}
              <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <table className="w-full">
                  <caption className="sr-only">
                    Vehicle and equipment registration fees
                  </caption>
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Particulars / Vehicle & Equipment Type
                      </th>
                      <th className="text-right px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Registration Fee / Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {registrationFeesData.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {item.particular}
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-emerald-600 dark:text-emerald-400 font-semibold whitespace-nowrap">
                          {item.fee}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Note */}
              <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center leading-relaxed">
                All vehicles hauling or transporting quarry resources must be registered and carry valid vehicle stickers.
              </p>
            </motion.div>
          )}

          {activeTab === 'compliance' && (
            <motion.div
              key="compliance"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="max-w-5xl mx-auto"
            >
              <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <caption className="sr-only">
                      Fines and penalties
                    </caption>
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Fines
                        </th>
                        <th className="text-right px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Charge
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {finesData.map((item, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            <div className="flex flex-col md:flex-row md:items-center gap-2">
                              <span className="inline-block px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-gray-600 dark:text-gray-400 w-fit shrink-0">
                                {item.section}
                              </span>
                              <span className="text-gray-700 dark:text-gray-300 font-medium">
                                {item.fine}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-right text-red-600 dark:text-red-400 font-semibold whitespace-nowrap">
                            {item.charge}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
