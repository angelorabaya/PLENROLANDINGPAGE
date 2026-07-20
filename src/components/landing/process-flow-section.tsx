'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Maximize2,
  Download,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react'

export default function ProcessFlowSection() {
  const [isOpen, setIsOpen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5))
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75))
  const handleResetZoom = () => setZoomLevel(1)

  return (
    <section id="process-flow" className="py-24 px-6 bg-gray-50/50 dark:bg-gray-900/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 rounded-full mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            Standard Permit Application Process Flow
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base font-medium">
            Official procedural guide and workflow diagram for all permit applications submitted to the Provincial Local Environment &amp; Natural Resources Office.
          </p>
        </motion.div>

        {/* Infographic Main Container */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative rounded-3xl p-4 md:p-6 bg-white dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/60 shadow-xl hover:shadow-2xl hover:border-emerald-500/30 transition-all duration-300"
        >
          {/* Header Bar inside card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 px-2">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Official Visual Guide
              </span>
              <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white mt-1">
                Process Flowchart Infographic
              </h3>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => {
                  setZoomLevel(1)
                  setIsOpen(true)
                }}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs md:text-sm font-semibold transition-all shadow-md shadow-emerald-600/20 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Maximize2 size={16} />
                <span>Expand &amp; View Fullscreen</span>
              </button>

              <a
                href="/images/processguide.png"
                download="PLENRO_Standard_Permit_Process_Flow.png"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 text-xs md:text-sm font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Download size={16} />
                <span>Download Image</span>
              </a>
            </div>
          </div>

          {/* Image Preview Window */}
          <div
            onClick={() => {
              setZoomLevel(1)
              setIsOpen(true)
            }}
            className="relative group cursor-pointer overflow-hidden rounded-2xl bg-gray-900/5 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800 flex items-center justify-center"
          >
            <img
              src="/images/processguide.png"
              alt="Standard Process Flow for All Permits Infographic"
              className="w-full h-auto max-h-[650px] object-contain transition-transform duration-500 group-hover:scale-[1.01]"
              loading="lazy"
            />

            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-gray-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px] flex items-center justify-center">
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/95 dark:bg-gray-900/95 text-gray-900 dark:text-white font-semibold text-sm shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <Maximize2 size={18} className="text-emerald-500" />
                <span>Click to View Full Resolution</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lightbox / Fullscreen Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 md:p-6"
            onClick={() => setIsOpen(false)}
          >
            {/* Modal Controls Header */}
            <div
              className="flex items-center justify-between gap-4 bg-gray-900/80 p-4 rounded-2xl border border-gray-800 text-white max-w-5xl mx-auto w-full z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-display font-bold text-sm md:text-base tracking-tight truncate">
                  Standard Permit Process Flow — High Resolution
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {/* Zoom Controls */}
                <div className="hidden sm:flex items-center gap-1 bg-gray-800/90 rounded-xl p-1 border border-gray-700">
                  <button
                    onClick={handleZoomOut}
                    title="Zoom Out"
                    className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <ZoomOut size={18} />
                  </button>
                  <span className="text-xs font-semibold px-2 min-w-[50px] text-center text-emerald-400">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    title="Zoom In"
                    className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <ZoomIn size={18} />
                  </button>
                  <button
                    onClick={handleResetZoom}
                    title="Reset Zoom"
                    className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>

                {/* Download */}
                <a
                  href="/images/processguide.png"
                  download="PLENRO_Standard_Permit_Process_Flow.png"
                  title="Download Infographic"
                  className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                >
                  <Download size={16} />
                  <span className="hidden md:inline">Download</span>
                </a>

                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close (Esc)"
                  className="p-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Image Area */}
            <div
              className="flex-1 overflow-auto flex items-center justify-center p-2 my-2 cursor-grab active:cursor-grabbing"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                src="/images/processguide.png"
                alt="Standard Process Flow Fullscreen"
                style={{ scale: zoomLevel }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl transition-transform"
              />
            </div>

            {/* Footer Hint */}
            <div
              className="text-center text-xs text-gray-400 py-1"
              onClick={(e) => e.stopPropagation()}
            >
              Press <kbd className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700 font-mono">ESC</kbd> or click outside to close
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
