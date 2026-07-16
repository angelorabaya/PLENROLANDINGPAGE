'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Truck, AlertTriangle, ChevronDown } from 'lucide-react'

const permitTypes: { name: string; validity: string; definition?: string }[] = [
  {
    name: 'Commercial Sand and Gravel Permit (CSAG)',
    validity: '1 year',
    definition:
      'Any Qualified Person may apply for a Commercial Sand and Gravel Permit with the Provincial Governor/City Mayor through the Provincial/City Mining Regulatory Board for the extraction, removal and disposition of sand and gravel and other loose or unconsolidated materials which are used in their natural state without undergoing processing covering an area of not more than five (5) hectares for a term of one (1) year from date of issuance thereof, renewable for like period and in such quantities as may be specified in the Permit: Provided, That only one (1) Permit shall be granted to a Qualified Person in a municipality at any one time under such terms and conditions as provided herein.',
  },
  {
    name: 'Industrial Sand and Gravel Permit (ISAG)',
    validity: '5 years',
    definition:
      'Any Qualified Person may apply for an Industrial Sand and Gravel Permit (MGB Form Nos. 8-1 or 8-1A and 8-2 or 8-2A) with the Provincial Governor/City Mayor through the Provincial/City Mining Regulatory Board for the extraction, removal and disposition of sand and gravel and other loose or unconsolidated materials that necessitate the use of mechanical processing covering an area of not more than five (5) hectares at any one time for a term of five (5) years from date of issuance thereof, renewable for like periods but not to exceed a total term of twenty-five (25) years: Provided, That any Qualified Person may apply for an Industrial Sand and Gravel Permit with the Regional Director through the Regional Office for areas covering more than five (5) hectares but not to exceed twenty (20) hectares at any one time for a term of five (5) years from date of issuance thereof, renewable for like periods but not to exceed a total term of twenty-five (25) years: Provided, further, That only one (1) Permit shall be granted to a Qualified Person in a municipality at any one time under such terms and conditions as provided herein.',
  },
  {
    name: 'Quarry Permit (QP)',
    validity: '5 years',
    definition:
      'Any Qualified Person may apply for a Quarry Permit with the Provincial Governor/City Mayor through the Provincial/City Mining Regulatory Board for the extraction, removal and disposition of quarry resources covering an area of not more than five (5) hectares, and a production rate of not more than fifty thousand (50,000) tons annually and/or whose project cost is not more than Ten Million Pesos (PhP10,000,000.00), for a term of five (5) years from the date of issuance thereof, renewable for like period but not to exceed a total term of twenty-five (25) years: Provided, That application for renewal shall be filed before the expiry date of the Permit: Provided, further, That the Permit Holder has complied with all the terms and conditions of the Permit as provided herein and has not been found guilty of violation of any provision of the Act and these implementing rules and regulations: Provided, furthermore, That no Quarry Permit shall be issued or granted on any area covered by a Mineral Agreement or FTAA, except on areas where a written consent is granted by the Mineral Agreement or FTAA Contractor: Provided, finally, That existing Quarry Permits at the effectivity of Department Administrative Order No. 99-57 under which the production rate is more than fifty thousand (50,000) tons annually and/or whose project cost is more than Ten Million Pesos (PhP10,000,000.00) shall not be renewed but shall be given preferential right to a Mineral Agreement application which shall be evaluated and approved in accordance with Chapter VI hereof and all other applicable provisions of the Act and these implementing rules and regulations.',
  },
  {
    name: 'Government Gratuitous Permit (GGP)',
    validity: '1 year',
    definition:
      'Any Government entity/instrumentality in need of quarry, sand and gravel or loose/unconsolidated materials in the construction of building(s) and/or infrastructure for public use or other purposes may apply for a Government Gratuitous Permit (MGB Form No. 8-3B) with the Provincial Governor/City Mayor through the Provincial/City Mining Regulatory Board for a period coterminous with the construction stage of the project but not to exceed one (1) year in public/private land(s) covering an area of not more than two (2) hectares. The applicant shall submit a project proposal stating where the materials to be taken shall be used and the estimated volume needed.',
  },
  {
    name: 'Private Gratuitous Permit (PGP)',
    validity: '2 months',
    definition:
      'Any landowner may apply for a Private Gratuitous Permit with the Provincial Governor/City Mayor through the Provincial/City Mining Regulatory Board for the extraction, removal and utilization of quarry, sand and gravel or loose/unconsolidated materials from his/her land for a non-renewable period of sixty (60) calendar days: Provided, That there is adequate proof of ownership and that the materials shall be for personal use.',
  },
  {
    name: 'Special Permit (EMP)',
    validity: '6 months',
    definition:
      'Any individual who wishes to develop his/her idle land into productive use, wherein, during the course of development, there is a need to extract and dispose of a specific volume of ordinary earth, limestone, sand and gravel, and other quarry materials therefrom, may apply for a Special Permit to Extract and Dispose (Earth Moving Permit) with the Provincial Governor/City Mayor through the Provincial/City Mining Regulatory Board. The permit is only valid for six (6) months from the date of issuance and is not renewable.',
  },
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
                          : 'border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-500/35 dark:hover:border-emerald-500/25 hover:scale-[1.03] active:scale-[0.99]'
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
