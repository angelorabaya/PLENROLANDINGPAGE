'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Maximize2,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react'

export default function ProcessFlowSection() {
  const [isOpen, setIsOpen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)

  const closeModal = useCallback(() => {
    setIsOpen(false)
    setZoomLevel(1)
  }, [])

  const openModal = useCallback(() => {
    setZoomLevel(1)
    setIsOpen(true)
    // Add history entry so pressing hardware/browser back button closes modal instead of exiting
    window.history.pushState({ modalOpen: true }, '')
  }, [])

  // Handle hardware / browser back button and Escape key
  useEffect(() => {
    const handlePopState = () => {
      if (isOpen) {
        setIsOpen(false)
        setZoomLevel(1)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeModal()
      }
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('popstate', handlePopState)
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, closeModal])

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

            <button
              onClick={openModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs md:text-sm font-semibold transition-all shadow-md shadow-emerald-600/20 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Maximize2 size={16} />
              <span>Expand &amp; View Fullscreen</span>
            </button>
          </div>

          {/* Image Preview Window */}
          <div
            onClick={openModal}
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
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-3 md:p-6"
            onClick={closeModal}
          >
            {/* Modal Controls Header */}
            <div
              className="flex items-center justify-between gap-3 bg-gray-900/90 p-3 md:p-4 rounded-2xl border border-gray-800 text-white max-w-5xl mx-auto w-full z-10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <h3 className="font-display font-bold text-xs md:text-base tracking-tight truncate">
                  Process Flowchart
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Zoom Controls */}
                <div className="flex items-center gap-1 bg-gray-800/90 rounded-xl p-1 border border-gray-700">
                  <button
                    onClick={handleZoomOut}
                    title="Zoom Out"
                    className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <ZoomOut size={16} />
                  </button>
                  <span className="text-xs font-semibold px-1.5 min-w-[42px] text-center text-emerald-400">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    title="Zoom In"
                    className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <ZoomIn size={16} />
                  </button>
                  <button
                    onClick={handleResetZoom}
                    title="Reset Zoom"
                    className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors cursor-pointer hidden sm:block"
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>

                {/* Close Button */}
                <button
                  onClick={closeModal}
                  title="Close (Esc)"
                  aria-label="Close Fullscreen View"
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-600/30"
                >
                  <X size={18} />
                  <span>Close</span>
                </button>
              </div>
            </div>

            {/* Modal Image Area - Tapping image also closes modal if zoom is 1 */}
            <div
              className="flex-1 overflow-auto flex items-center justify-center p-2 my-2 cursor-pointer"
              onClick={closeModal}
            >
              <motion.img
                src="/images/processguide.png"
                alt="Standard Process Flow Fullscreen"
                style={{ scale: zoomLevel }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl transition-transform"
                onClick={(e) => {
                  // If zoomed in, let user pinch/scroll image. If at normal zoom, tap closes modal
                  if (zoomLevel === 1) {
                    closeModal()
                  } else {
                    e.stopPropagation()
                  }
                }}
              />
            </div>

            {/* Touch-friendly Floating Close Button for Mobile */}
            <div
              className="text-center text-xs text-gray-300 py-1 flex items-center justify-center gap-2"
              onClick={closeModal}
            >
              <span className="px-3 py-1 rounded-full bg-gray-800/90 text-gray-200 border border-gray-700 text-[11px] font-medium">
                Tap anywhere or press Back to close
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
