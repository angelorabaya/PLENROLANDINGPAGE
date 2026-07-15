'use client';

import { motion } from 'framer-motion';

interface SectionHeadingProps {
  title: string;
  subtitle: string;
  id?: string;
}

export default function SectionHeading({ title, subtitle, id }: SectionHeadingProps) {
  return (
    <motion.div
      id={id}
      className="text-center mb-16"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
    >
      {/* Accent bar */}
      <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 rounded-full mx-auto mb-6" />

      <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-gray-900 dark:text-white mb-4">
        {title}
      </h2>

      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
        {subtitle}
      </p>
    </motion.div>
  );
}
