'use client'

import { motion } from 'framer-motion'
import { Shield, FileSearch, TreePine, Landmark, ClipboardCheck, Leaf } from 'lucide-react'

const mandateCards = [
  {
    icon: Landmark,
    title: 'Official Secretariat — Provincial Mining Regulatory Board (PMRB)',
    description:
      'Serving as the official secretariat of the PMRB, coordinating all regulatory matters related to mining and quarry operations in Misamis Oriental. Processing applications for Small-Scale Mining Permits (SSMPs) and ensuring compliance with RA 7076.',
    accent: 'emerald',
    span: 'lg:col-span-2',
  },
  {
    icon: FileSearch,
    title: 'Quarry Operations Regulation',
    description:
      'Comprehensive regulation, inspection, supervision, and monitoring of all quarry operations including sand and gravel extraction, guano collection, and gemstone mining.',
    accent: 'teal',
    span: '',
  },
  {
    icon: TreePine,
    title: 'Environmental Conservation',
    description:
      'Spearheading ecological restoration of quarry sites, managing Ecosystem Services Fees for reforestation and environmental rehabilitation programs across the province.',
    accent: 'cyan',
    span: '',
  },
  {
    icon: Shield,
    title: 'Compliance & Enforcement',
    description:
      'Conducting joint anti-illegal mining operations, checkpoint enforcement, and ensuring operators maintain proper delivery receipts and permits.',
    accent: 'amber',
    span: '',
  },
  {
    icon: ClipboardCheck,
    title: 'Permit Processing',
    description:
      'Streamlined processing of Special/Gratuitous Permits for commercial and industrial quarry materials with transparent fee schedules.',
    accent: 'violet',
    span: '',
  },
  {
    icon: Leaf,
    title: 'Ecosystem Services',
    description:
      'Implementing the Three (3) Percent Ecosystem Services Fee from gross sales for environmental protection, conservation, and ecological research.',
    accent: 'rose',
    span: 'lg:col-span-1',
  },
]

const accentClasses: Record<string, { iconBg: string; iconText: string; border: string; shadow: string; blob: string; blobHover: string }> = {
  emerald: {
    iconBg: 'bg-emerald-500/10',
    iconText: 'text-emerald-500',
    border: 'hover:border-emerald-500/30',
    shadow: 'hover:shadow-emerald-500/5',
    blob: 'bg-emerald-500/5',
    blobHover: 'group-hover:bg-emerald-500/10',
  },
  teal: {
    iconBg: 'bg-teal-500/10',
    iconText: 'text-teal-500',
    border: 'hover:border-teal-500/30',
    shadow: 'hover:shadow-teal-500/5',
    blob: 'bg-teal-500/5',
    blobHover: 'group-hover:bg-teal-500/10',
  },
  cyan: {
    iconBg: 'bg-cyan-500/10',
    iconText: 'text-cyan-500',
    border: 'hover:border-cyan-500/30',
    shadow: 'hover:shadow-cyan-500/5',
    blob: 'bg-cyan-500/5',
    blobHover: 'group-hover:bg-cyan-500/10',
  },
  amber: {
    iconBg: 'bg-amber-500/10',
    iconText: 'text-amber-500',
    border: 'hover:border-amber-500/30',
    shadow: 'hover:shadow-amber-500/5',
    blob: 'bg-amber-500/5',
    blobHover: 'group-hover:bg-amber-500/10',
  },
  violet: {
    iconBg: 'bg-violet-500/10',
    iconText: 'text-violet-500',
    border: 'hover:border-violet-500/30',
    shadow: 'hover:shadow-violet-500/5',
    blob: 'bg-violet-500/5',
    blobHover: 'group-hover:bg-violet-500/10',
  },
  rose: {
    iconBg: 'bg-rose-500/10',
    iconText: 'text-rose-500',
    border: 'hover:border-rose-500/30',
    shadow: 'hover:shadow-rose-500/5',
    blob: 'bg-rose-500/5',
    blobHover: 'group-hover:bg-rose-500/10',
  },
}

export default function MandateSection() {
  return (
    <section id="mandate" className="py-24 px-6 bg-gray-50/50 dark:bg-gray-900/50">
      {/* Section Heading */}
      <div className="text-center">
        <div className="w-12 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto mb-6" />
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          Our Mandate &amp; Role
        </h2>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-center mb-16">
          Key responsibilities of the Provincial Local Environment and Natural Resources Office as mandated by provincial ordinance.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
        {mandateCards.map((card, index) => {
          const colors = accentClasses[card.accent]
          const Icon = card.icon

          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`group relative overflow-hidden rounded-2xl p-6 md:p-8 bg-white dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 ${colors.border} transition-all duration-500 hover:shadow-lg ${colors.shadow} ${card.span}`}
            >
              {/* Decorative gradient blob */}
              <div
                className={`absolute -top-12 -right-12 w-32 h-32 ${colors.blob} rounded-full blur-2xl ${colors.blobHover} transition-all duration-500`}
              />

              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl ${colors.iconBg} flex items-center justify-center mb-4 relative z-10`}>
                <Icon className={colors.iconText} size={24} />
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 relative z-10">
                {card.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed relative z-10">
                {card.description}
              </p>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
