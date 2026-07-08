'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Truck, AlertTriangle, Search, ChevronDown } from 'lucide-react'

const permitTypes = [
  { name: 'Commercial Sand and Gravel Permit (CSAG)', validity: '1 year' },
  { name: 'Industrial Sand and Gravel Permit (ISAG)', validity: '5 years' },
  { name: 'Special Waste Disposal Permit (SWDP)', validity: '6 months' },
  { name: 'Quarry Permit (QP)', validity: '5 years' },
  { name: 'Government Gratuitous Permit (GGP)', validity: '1 year' },
  { name: 'Special Permit (EMP)', validity: '6 months' },
]

const truckData = [
  { type: 'Elf Truck (4-Wheeler)', maxLoad: '5 cu.m.', fee: '₱30.00/cu.m.' },
  { type: 'Forward Truck (6-Wheeler)', maxLoad: '7 cu.m.', fee: '₱30.00/cu.m.' },
  { type: 'Dump Truck (10-Wheeler)', maxLoad: '12 cu.m.', fee: '₱30.00/cu.m.' },
  { type: 'Trailer Truck (12-Wheeler)', maxLoad: '15 cu.m.', fee: '₱30.00/cu.m.' },
]

const complianceItems = [
  {
    title: 'Illegal Extraction or Quarrying',
    content:
      'Operating without a valid Special/Gratuitous Permit issued by PLENRO constitutes illegal extraction. Violators face confiscation of extracted materials, equipment seizure, and prosecution under provincial ordinance and national mining laws.',
  },
  {
    title: 'Operating Without Delivery Receipts',
    content:
      'All transported quarry materials must be accompanied by valid Delivery Receipts from authorized permit holders. Vehicles caught without proper documentation are subject to impoundment, and materials confiscated per provincial regulatory guidelines.',
  },
  {
    title: 'Exceeding Allowable Load Capacity',
    content:
      "Trucks exceeding the prescribed Maximum Allowable Load Capacity per vehicle type face fines and potential suspension of the quarry operator's permit. Refer to the Logistics Guidelines tab for specific limits.",
  },
  {
    title: 'Failure to Pay Ecosystem Services Fee',
    content:
      'Quarry permit holders are mandated to remit a Three (3) Percent Ecosystem Services Fee from gross sales. Non-compliance may result in permit revocation and disqualification from future permit applications.',
  },
  {
    title: 'Unauthorized Entry in Minahang Bayan Areas',
    content:
      'Only holders of valid Small-Scale Mining Permits (SSMPs) endorsed by the PMRB and PLENRO may conduct operations inside declared Minahang Bayan areas. Unauthorized entry is subject to immediate arrest and prosecution.',
  },
]

const tabs = [
  { key: 'permits', label: 'Permit Types', icon: FileText },
  { key: 'logistics', label: 'Logistics Guidelines', icon: Truck },
  { key: 'compliance', label: 'Fines & Compliance', icon: AlertTriangle },
] as const

type TabKey = (typeof tabs)[number]['key']

export default function RegulatorySection() {
  const [activeTab, setActiveTab] = useState<TabKey>('permits')
  const [searchQuery, setSearchQuery] = useState('')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const filteredTrucks = truckData.filter((truck) =>
    truck.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Public transparency portal — Access permit fees, logistics guidelines, and compliance requirements.
          </p>
        </motion.div>

        {/* Tab Bar */}
        <div className="flex gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800 max-w-lg mx-auto mb-8">
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
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
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
                      <span className="text-sm text-gray-500 dark:text-gray-400">Validity:</span>
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
              {/* Search Input */}
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-6 max-w-sm">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search truck type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
                />
              </div>

              {/* Table */}
              <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Truck Type
                      </th>
                      <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Max Load (cu.m.)
                      </th>
                      <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Regulatory Fee
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredTrucks.map((truck) => (
                      <tr
                        key={truck.type}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {truck.type}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {truck.maxLoad}
                        </td>
                        <td className="px-6 py-4 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                          {truck.fee}
                        </td>
                      </tr>
                    ))}
                    {filteredTrucks.length === 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-6 py-8 text-center text-sm text-gray-400"
                        >
                          No truck types match your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Note */}
              <p className="mt-4 text-xs text-gray-400 dark:text-gray-500 text-center leading-relaxed">
                All shipments require valid Delivery Receipts from authorized quarry permit holders. Basic regulatory fee of ₱30.00 per cubic meter applies universally.
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
              className="max-w-3xl mx-auto"
            >
              {complianceItems.map((item, index) => {
                const isOpen = openIndex === index
                return (
                  <div
                    key={index}
                    className="border border-gray-200/50 dark:border-gray-700/50 rounded-xl mb-3 overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full flex items-center justify-between p-4 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                          {item.title}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <p className="p-4 pt-0 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                            {item.content}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
