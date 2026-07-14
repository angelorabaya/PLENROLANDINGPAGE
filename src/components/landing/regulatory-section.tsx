'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Truck, AlertTriangle } from 'lucide-react'

const permitTypes = [
  { name: 'Commercial Sand and Gravel Permit (CSAG)', validity: '1 year' },
  { name: 'Industrial Sand and Gravel Permit (ISAG)', validity: '5 years' },
  { name: 'Special Waste Disposal Permit (SWDP)', validity: '6 months' },
  { name: 'Quarry Permit (QP)', validity: '5 years' },
  { name: 'Government Gratuitous Permit (GGP)', validity: '1 year' },
  { name: 'Special Permit (EMP)', validity: '6 months' },
]

const registrationFeesData = [
  { particular: 'Allowable Loading Capacity per Truckload', fee: '14 cu.m.' },
  { particular: 'Charges for Excess Load', fee: '₱500.00/cu.m.' },
  { particular: 'Payment for Vehicle Stickers', fee: '₱150.00' },
  { particular: 'Trucks with 10 to 14 Cubic Meters Maximum Capacity', fee: '₱850.00/Unit/Year' },
  { particular: 'Trucks with 7 to 9 Cubic Meters Capacity', fee: '₱750.00/Unit/Year' },
  { particular: 'Trucks with 5 to 9 Cubic Meters Maximum Capacity', fee: '₱500.00/Unit/Year' },
  { particular: 'Trucks/Vehicle with Below 5 Cubic Meters Maximum Capacity', fee: '₱300.00/Unit/Year' },
  { particular: 'Pay Loader', fee: '₱5,000.00/Unit/Year' },
  { particular: 'Bulldozer', fee: '₱5,000.00/Unit/Year' },
  { particular: 'Backhoe', fee: '₱5,000.00/Unit/Year' },
  { particular: 'Crane', fee: '₱5,000.00/Unit/Year' },
  { particular: 'Aggregates Crusher and/or Separator', fee: '₱5,000.00/Unit/Year' },
  { particular: 'Limestone Crusher and/or Pulverizer', fee: '₱2,500.00/Unit/Year' },
]

const finesData = [
  { section: 'Section 37 (a)', fine: 'Late Submission of Report', charge: '₱2,000.00' },
  { section: 'Section 37 (b)', fine: 'Non-Submission of Report (1 month from the prescribed period)', charge: '₱2,000.00' },
  { section: 'Section 37 (c)', fine: 'Failure to carry "Delivery Receipts" on the transport of sand and gravel and other quarry resources', charge: '₱5,000.00' },
  { section: 'Section 37 (d)', fine: 'Failure to carry "Ore Transport Permit" in the Transport/Delivery of Minerals', charge: '₱5,000.00' },
  { section: 'Section 37 (e)', fine: 'Extraction and/or Hauling of Sand and Gravel and other Quarry Resources without Permit', charge: '₱500.00' },
  { section: 'Section 37 (f)', fine: 'Extraction and/or Hauling of Minerals without Permit', charge: '₱1,500.00' },
  { section: 'Section 37 (g)', fine: 'Any unregistered vehicle/equipment used in the extraction/hauling/transport of mineral resources', charge: '₱3,000.00' },
  { section: 'Section 37 (h)', fine: 'Any Extraction and Removal or Sale of Materials Outside the Permit Area (Basic Fine)', charge: '₱5,000.00' },
  { section: 'Section 37 (i)', fine: 'Late Filing of Application for Renewal of Permit', charge: '₱5,000.00' },
  { section: 'Section 37 (j)', fine: 'Buying/Selling of Illegally-Sourced Quarry/Mineral Resource', charge: '₱5,000.00' },
  { section: 'Section 37 (k)', fine: 'Buying/Selling/Recycling/Misused of Required Transport/Delivery/Hauling Documents', charge: '₱5,000.00' },
  { section: 'Section 37 (l)', fine: 'Any Processor, Trader, Hauler, Dealer or Retailer Found to Process or Transport Quarry, Mineral Products and By-Products without required Governors Registration', charge: '₱5,000.00' },
  { section: 'Section 37 (m)', fine: 'Any Person Who Refuses, Obstruct or Hampers Lawful Inspection of the Quarrying/Mining Areas, Stockpile or Any Premises where Quarrying/Mineral/Mineral Products and By-Products are being stored stockpiled or dumped', charge: '₱5,000.00' },
  { section: 'Section 37 (n)', fine: 'Illegal Transport of Quarry/Mineral Resources imposable against the Owner and Driver of the Apprehended Trucks', charge: '₱5,000.00' },
  { section: 'Section 37 (o)', fine: 'Over Extraction based on the volume and type of materials computed on actual (Basic Fine)', charge: '₱5,000.00' },
  { section: 'Section 37 (p)', fine: 'Any transportation of processed mineral/mineral products without the required valid transport/hauling documents', charge: '₱5,000.00' },
  { section: 'Section 36 (i)', fine: 'Allowable Loading Capacity per Truckload - Charges for Excess Load', charge: '₱500.00' },
]

const tabs = [
  { key: 'permits', label: 'Permit Types', icon: FileText },
  { key: 'logistics', label: 'Vehicle and Equipment Registration Fee', icon: Truck },
  { key: 'compliance', label: 'Fines & Compliance', icon: AlertTriangle },
] as const

type TabKey = (typeof tabs)[number]['key']

export default function RegulatorySection() {
  const [activeTab, setActiveTab] = useState<TabKey>('permits')

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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Regulatory Framework & Fees
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
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
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  isActive
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-emerald-600'
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
                {permitTypes.map((permit, index) => (
                  <motion.div
                    key={permit.name}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    className="rounded-xl p-5 bg-white dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-md transition-shadow flex flex-col justify-between min-h-[140px]"
                  >
                    <p className="font-semibold text-gray-900 dark:text-white mb-3">
                      {permit.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-auto">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Validity:</span>
                      <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 px-2.5 py-1 rounded-lg">
                        {permit.validity}
                      </span>
                    </div>
                  </motion.div>
                ))}
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
