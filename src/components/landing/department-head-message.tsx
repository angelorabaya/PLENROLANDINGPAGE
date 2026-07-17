'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'
import { Quote, TreePine, ShieldCheck, Siren, Pickaxe, Recycle } from 'lucide-react'

const initiatives = [
  {
    icon: TreePine,
    title: 'Forestry and Conservation',
    description:
      'We manage seed banks, produce high-quality seedlings for local tree parks, and support forest development beneficiaries to maintain a healthy ecological balance.',
  },
  {
    icon: ShieldCheck,
    title: 'Environmental Quality and Enforcement',
    description:
      'We issue and monitor permits to control pollution. Our representatives inspect commercial and industrial establishments to ensure strict compliance with national and local environmental laws.',
  },
  {
    icon: Siren,
    title: 'Disaster Frontline Response',
    description:
      'We serve on the frontline during natural or man-made calamities, leading critical rehabilitation and environmental renewal efforts in affected areas.',
  },
  {
    icon: Pickaxe,
    title: 'Resource and Quarry Management',
    description:
      'Under Ordinance No. 1571-2022, we serve as the Secretariat for the Provincial Mining Regulatory Board. We monitor quarry operations, penalize illegal activities, and utilize collected fees—including the Ecosystem Services Fee—to directly rehabilitate affected quarry sites.',
  },
  {
    icon: Recycle,
    title: 'Solid Waste Management',
    description:
      'We collaborate with component cities and municipalities to refine and implement sustainable ecological waste management plans.',
  },
]

export default function DepartmentHeadMessage() {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <section id="message" className="py-24 px-6 relative overflow-hidden">
      {/* Background decorators */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-500/5 dark:bg-emerald-500/[0.03] rounded-full filter blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/5 dark:bg-teal-500/[0.02] rounded-full filter blur-3xl -z-10" />

      <div className="max-w-5xl mx-auto">
        {/* Section Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 rounded-full mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            Message from the Department Head
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base font-medium">
            A personal welcome and overview of our commitment to safeguarding Misamis Oriental&apos;s natural heritage.
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          className="border-beam-container"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Animated border beam */}
          <div className="border-beam-light" />

          <div className="border-beam-content bg-white dark:bg-gray-950 p-8 md:p-12">
            {/* Top section: Photo + Opening */}
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start mb-10">
              {/* Photo */}
              <motion.div
                className="flex-shrink-0 mx-auto md:mx-0"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="relative w-44 h-56 md:w-52 md:h-64 rounded-2xl overflow-hidden shadow-xl group">
                  {/* Skeleton loader */}
                  {!isLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-pulse" />
                  )}
                  <Image
                    src="/geranformalpic.jpg"
                    alt="GERAN JOHN T. FLORES - PLENRO Department Head"
                    fill
                    className={`object-cover object-top group-hover:scale-[1.03] transition-all duration-700 ease-out ${
                      isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-md'
                    }`}
                    sizes="(max-width: 768px) 176px, 208px"
                    onLoad={() => setIsLoaded(true)}
                    priority
                  />
                  {/* Subtle gradient overlay at bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-gray-950/60 to-transparent" />
                </div>
                {/* Name and title */}
                <div className="text-center mt-4">
                  <h3 className="font-display font-bold text-gray-900 dark:text-white text-base md:text-lg">
                    GERAN JOHN T. FLORES
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mt-1">
                    PLENRO
                  </p>
                </div>
              </motion.div>

              {/* Opening quote */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3 mb-4">
                  <Quote className="w-8 h-8 text-emerald-500/30 dark:text-emerald-500/20 flex-shrink-0 mt-1 rotate-180" />
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base font-medium mb-4">
                  Welcome to the official webpage of the Provincial Local Environment and Natural Resources Office (PLENRO) of Misamis Oriental. On behalf of our entire office, it is my distinct pleasure to share our ongoing work and commitment to safeguarding our province&apos;s rich natural heritage.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base font-medium mb-4">
                  In close coordination with the Office of the Provincial Governor and the Sangguniang Panlalawigan, PLENRO is mandated to drive sustainable development. We formulate and implement comprehensive policies and programs aimed at environmental protection, resource conservation, and pollution prevention.
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm font-medium">
                  To ensure every community receives adequate environmental services, our key initiatives focus on:
                </p>
              </div>
            </div>

            {/* Initiatives Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {initiatives.map((initiative, index) => {
                const Icon = initiative.icon
                return (
                  <motion.div
                    key={initiative.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="group p-4 rounded-xl border border-gray-200/70 dark:border-gray-800/70 bg-white dark:bg-gray-900/50 hover:border-emerald-500/30 dark:hover:border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-2.5">
                      <div className="w-9 h-9 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/50 flex items-center justify-center shadow-sm group-hover:shadow-emerald-500/10 transition-all duration-300">
                        <Icon className="w-4.5 h-4.5 text-emerald-500" />
                      </div>
                      <h4 className="font-display font-semibold text-gray-900 dark:text-white text-sm leading-snug">
                        {initiative.title}
                      </h4>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed font-medium">
                      {initiative.description}
                    </p>
                  </motion.div>
                )
              })}
            </div>

            {/* Closing Paragraph */}
            <motion.div
              className="border-t border-gray-200/70 dark:border-gray-800/70 pt-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base font-medium text-center max-w-3xl mx-auto">
                Protecting our environment is a shared responsibility. We actively partner with the DENR, non-government organizations, and communities to keep Misamis Oriental safe and clean. We invite you to collaborate with us in building a greener, more resilient province for generations to come.
              </p>
              <div className="flex items-center justify-center gap-2 mt-6">
                <div className="w-8 h-[2px] bg-gradient-to-r from-transparent to-emerald-500/50 rounded-full" />
                <Quote className="w-4 h-4 text-emerald-500/40" />
                <div className="w-8 h-[2px] bg-gradient-to-l from-transparent to-emerald-500/50 rounded-full" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
