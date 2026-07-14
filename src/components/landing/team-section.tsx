'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Users, ShieldCheck, Heart, Award } from 'lucide-react'

const features = [
  {
    icon: ShieldCheck,
    title: 'Professional Service',
    description: 'A team of experts dedicated to regulating, inspecting, and monitoring compliance in our province.',
  },
  {
    icon: Award,
    title: 'Expert Stewardship',
    description: 'Ensuring environmental protection, rehabilitation, and sustainability in quarry operations.',
  },
  {
    icon: Heart,
    title: 'Community First',
    description: 'Committed to serving the public with transparent permit processes and ecosystem management.',
  },
]

export default function TeamSection() {
  return (
    <section id="team" className="py-24 px-6 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & Features */}
          <motion.div 
            className="lg:col-span-6 space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" />
              Who We Are
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
              The Dedicated Professionals Behind <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">PLENRO</span>
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Our team at the Provincial Local Environment and Natural Resources Office consists of highly dedicated professionals working together to manage our natural resources, enforce environmental compliance, and ensure public transparency.
            </p>

            <div className="space-y-4 pt-4">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/50 flex items-center justify-center shadow-sm">
                      <Icon className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-xs mt-0.5 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Right Column: Group Image */}
          <motion.div 
            className="lg:col-span-6 relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Visual background decorators */}
            <div className="absolute -top-4 -left-4 w-72 h-72 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full filter blur-3xl -z-10" />
            <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-teal-500/10 dark:bg-teal-500/5 rounded-full filter blur-3xl -z-10" />
            
            {/* Image Container with Styled Borders */}
            <div className="relative overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl group">
              <div className="aspect-[16/10] relative bg-gray-100 dark:bg-gray-800">
                <Image
                  src="/images/staff.jpg"
                  alt="PLENRO Staff and Employees"
                  fill
                  className="object-contain group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                  sizes="(max-w-768px) 100vw, 50vw"
                  priority
                />
              </div>
              {/* Overlay details */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-950/80 via-gray-950/40 to-transparent p-6 text-white">
                <p className="text-xs uppercase tracking-wider text-emerald-400 font-semibold mb-1">
                  Misamis Oriental
                </p>
                <h3 className="font-bold text-lg">
                  Official PLENRO Personnel &amp; Staff
                </h3>
              </div>
            </div>

            {/* Decorative frame overlay */}
            <div className="absolute inset-0 rounded-3xl border-2 border-emerald-500/10 pointer-events-none -m-1" />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
