'use client'

import { motion, Variants } from 'framer-motion'
import { MapPin, ChevronDown, Download } from 'lucide-react'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* Background Layer 1: Hero landscape image */}
      <img
        src="/images/hero-landscape.jpg"
        alt="Hero landscape"
        className="absolute inset-0 w-full h-full object-cover opacity-20 dark:opacity-10"
      />

      {/* Background Layer 2: Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white dark:from-gray-950/90 dark:via-gray-950/80 dark:to-gray-950" />

      {/* Background Layer 3: Aurora animated blobs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-emerald-500/30 blur-3xl"
        style={{ top: '10%', left: '15%' }}
        animate={{
          x: [0, 80, -40, 60, 0],
          y: [0, -60, 40, -30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute w-[28rem] h-[28rem] rounded-full bg-teal-500/20 blur-3xl"
        style={{ top: '30%', right: '10%' }}
        animate={{
          x: [0, -70, 50, -40, 0],
          y: [0, 50, -70, 30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute w-[30rem] h-[30rem] rounded-full bg-cyan-500/25 blur-3xl"
        style={{ bottom: '10%', left: '30%' }}
        animate={{
          x: [0, 60, -80, 40, 0],
          y: [0, -40, 60, -50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl"
        style={{ bottom: '20%', right: '25%' }}
        animate={{
          x: [0, -50, 70, -30, 0],
          y: [0, 70, -50, 40, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto px-6 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-2"
        >
          <img
            src="/images/plenro.png"
            alt="PLENRO Logo"
            className="w-20 h-20 object-contain drop-shadow-md"
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-6xl md:text-8xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent"
          variants={itemVariants}
        >
          PLENRO
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium tracking-wide"
          variants={itemVariants}
        >
          Provincial Local Environment and Natural Resources Office
        </motion.p>

        {/* Badge */}
        <motion.div variants={itemVariants}>
          <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm">
            <img
              src="/images/logo.png"
              alt="Misamis Oriental Logo"
              className="w-5 h-5 object-contain"
            />
            Misamis Oriental, Philippines
          </span>
        </motion.div>

        {/* Description */}
        <motion.p
          className="max-w-2xl text-center text-gray-500 dark:text-gray-400 text-base md:text-lg leading-relaxed mt-6"
          variants={itemVariants}
        >
          Dedicated to the protection, conservation, and sustainable management of the
          environment and natural resources of the Province of Misamis Oriental through
          effective policy implementation, community engagement, and regulatory oversight.
        </motion.p>

        {/* Button Container */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mt-8"
          variants={itemVariants}
        >
          {/* Primary CTA */}
          <a
            href="#regulatory-framework"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 transition-all duration-300"
          >
            View Regulatory Framework
            <ChevronDown size={18} />
          </a>

          {/* Secondary CTA */}
          <a
            href="/PLENRO ORDINANCE.docx"
            download
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border-2 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-semibold hover:bg-emerald-500/10 transition-all duration-300"
          >
            Download Official Ordinance
            <Download size={18} />
          </a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="mt-16"
          variants={itemVariants}
        >
          <div className="animate-bounce flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700">
            <ChevronDown size={20} className="text-gray-400 dark:text-gray-500" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
