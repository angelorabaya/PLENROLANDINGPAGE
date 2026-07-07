'use client'

import { motion } from 'framer-motion'
import { Download, FileText, CheckCircle, ExternalLink } from 'lucide-react'

const additionalDownloads = [
  'Delivery Receipt Template',
  'Permit Application Form',
  'Quarry Operation Guidelines',
]

const requirements = [
  'Letter of Intent addressed to the Provincial Governor',
  'Sketch Plan / Location Map of the quarry site',
  'Barangay Certification / Resolution of No Objection',
  'Municipal/City Endorsement or Certification',
  'EMB Environmental Compliance Certificate (ECC) or Certificate of Non-Coverage (CNC)',
  'Proof of land ownership or consent from landowner',
  'Community Tax Certificate (Cedula)',
  'DTI/SEC Business Registration',
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
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Access official documents, permits requirements, and regulatory guidelines.
          </p>
        </motion.div>

        {/* Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Downloads */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-4">
              Official Documents
            </h3>

            {/* Featured Download Card */}
            <div className="rounded-2xl p-6 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/20 mb-4">
              <FileText size={32} className="text-emerald-500 mb-4" />
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                PLENRO Ordinance
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                Complete provincial ordinance governing quarry operations, permit fees, regulatory framework, and environmental compliance requirements.
              </p>
              <a
                href="/PLENRO ORDINANCE.docx"
                download
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors w-fit"
              >
                <Download size={18} />
                Download Document
              </a>
            </div>

            {/* Additional Downloads */}
            <div>
              {additionalDownloads.map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-700/50"
                >
                  <FileText size={18} className="text-gray-400 shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item}</span>
                  <Download size={14} className="text-gray-300 ml-auto shrink-0" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Requirements Checklist */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-4">
              Special Permit Requirements
            </h3>

            <div className="rounded-2xl p-6 bg-white dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50">
              <div className="space-y-1">
                {requirements.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
