'use client'

import { motion } from 'framer-motion'
import { Eye, Target, Landmark, ShieldCheck, TreePine } from 'lucide-react'

export default function MandateSection() {
  return (
    <section id="mandate" className="py-24 px-6 bg-gray-50/50 dark:bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <div className="w-12 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Mandate &amp; Role
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
            Guiding policies, missions, and core operational roles of the Provincial Local Environment and Natural Resources Office.
          </p>
        </div>

        {/* Vision & Mission Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="border-beam-container hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500"
          >
            <div className="border-beam-light" />
            <div className="border-beam-content group p-8 bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-700/50">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/5 group-hover:bg-emerald-500/10 rounded-full blur-2xl transition-all duration-500" />
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 relative z-10">
                <Eye className="text-emerald-600 dark:text-emerald-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                Vision
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base relative z-10">
                To develop the upland and coastal areas through shared responsibilities and open up window of livelihood opportunities to the people of Misamis Oriental focusing on responsible utilizations of natural resources and adaptation by all stakeholders of the environment policies and programs towards sustainable development.
              </p>
            </div>
          </motion.div>

          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="border-beam-container hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-500"
          >
            <div className="border-beam-light" />
            <div className="border-beam-content group p-8 bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-700/50">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-teal-500/5 group-hover:bg-teal-500/10 rounded-full blur-2xl transition-all duration-500" />
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center mb-6 relative z-10">
                <Target className="text-teal-600 dark:text-teal-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500">
                Mission
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base relative z-10">
                &ldquo;A pro-active&rdquo; PLENRO upholds the advocacies for healthy environment with sustainable development and responsible utilization of natural resources in Misamis Oriental.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Roles Heading */}
        <div className="text-center mt-16 mb-8">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Core Operational Roles
          </h3>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Role 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="group relative overflow-hidden rounded-2xl p-6 bg-white dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-md transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
              <Landmark className="text-emerald-600 dark:text-emerald-400" size={20} />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-sm">
              PMRB Secretariat
            </h4>
            <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
              Serving as the official Secretariat for the Provincial Mining Regulatory Board (PMRB).
            </p>
          </motion.div>

          {/* Role 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="group relative overflow-hidden rounded-2xl p-6 bg-white dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-md transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center mb-4">
              <ShieldCheck className="text-teal-600 dark:text-teal-400" size={20} />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-sm">
              Quarry Regulations
            </h4>
            <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
              Regulation, inspection, supervision, and monitoring of quarry operations.
            </p>
          </motion.div>

          {/* Role 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="group relative overflow-hidden rounded-2xl p-6 bg-white dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-md transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4">
              <TreePine className="text-cyan-600 dark:text-cyan-400" size={20} />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-sm">
              Eco-Conservation
            </h4>
            <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
              Environmental conservation, ecosystem research, and ecological restoration of quarry sites using Ecosystem Services Fees.
            </p>
          </motion.div>
        </div>

      </div>
    </section>
  )
}
