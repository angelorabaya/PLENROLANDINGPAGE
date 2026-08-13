'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  ExternalLink,
  AlertCircle,
  CalendarDays,
  RefreshCw,
} from 'lucide-react'

type FacebookPost = {
  id: string
  message: string
  full_picture: string
  permalink_url: string
  created_time: string
}

const AUTO_ADVANCE_MS = 7000
const FETCH_TIMEOUT_MS = 10000

function formatDate(iso: string): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export default function FacebookCarousel() {
  const [posts, setPosts] = useState<FacebookPost[]>([])
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const prefersReducedMotion = useReducedMotion()

  const touchStartX = useRef<number | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const goTo = useCallback(
    (next: number) => {
      setPosts((current) => {
        if (current.length === 0) return current
        const n = ((next % current.length) + current.length) % current.length
        setIndex(n)
        return current
      })
    },
    []
  )

  const goNext = useCallback(() => goTo(index + 1), [goTo, index])
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index])

  const load = useCallback(async () => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setLoading(true)
    setError(null)

    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

    try {
      // POST matches both the Cloudflare Pages Function and the dev-only
      // Next.js route handler (which must be POST for static-export compat).
      const res = await fetch('/api/facebook-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
        signal: controller.signal,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || `Request failed with status ${res.status}.`)
      setPosts(Array.isArray(data?.posts) ? data.posts : [])
      setIndex(0)
    } catch (err) {
      console.error(err)
      if (controller.signal.aborted) {
        setError('The Facebook feed took too long to load. Please try again.')
      } else {
        setError(err instanceof Error ? err.message : 'Unable to load the Facebook feed.')
      }
    } finally {
      clearTimeout(timeout)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Fetching on mount is an intentional external-system sync; `load` flips
    // the loading state at its start.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load()
    return () => abortRef.current?.abort()
  }, [load])

  // Auto-advance (disabled for reduced motion / tiny collections / while interacting).
  useEffect(() => {
    if (prefersReducedMotion || posts.length < 2) return
    const timer = setInterval(goNext, AUTO_ADVANCE_MS)
    return () => clearInterval(timer)
  }, [prefersReducedMotion, posts.length, goNext])

  // Pointer swipe handlers.
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(delta) > 50) {
      if (delta < 0) goNext()
      else goPrev()
    }
    touchStartX.current = null
  }

  if (loading) {
    return (
      <div className="w-full max-w-[500px] h-[480px] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl bg-white dark:bg-gray-800 flex flex-col items-center justify-center gap-3 text-gray-400 dark:text-gray-500">
        <MessageSquare className="w-8 h-8 animate-pulse text-emerald-500" />
        <span className="text-xs">Loading Facebook posts...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full max-w-[500px] h-[480px] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl bg-white dark:bg-gray-800 flex flex-col items-center justify-center gap-3 text-center px-6">
        <AlertCircle className="w-8 h-8 text-amber-500" />
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[260px] leading-relaxed">
          {error}
        </p>
        <button
          type="button"
          onClick={load}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all"
        >
          <RefreshCw size={13} />
          Try again
        </button>
        <a
          href="https://www.facebook.com/789005134298348"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold transition-all"
        >
          Visit our Facebook Page
          <ExternalLink size={13} />
        </a>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="w-full max-w-[500px] h-[480px] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl bg-white dark:bg-gray-800 flex flex-col items-center justify-center gap-3 text-center px-6">
        <MessageSquare className="w-8 h-8 text-emerald-500" />
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[260px] leading-relaxed">
          No posts to display yet. Follow us on Facebook for the latest updates.
        </p>
        <button
          type="button"
          onClick={load}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all"
        >
          <RefreshCw size={13} />
          Refresh
        </button>
        <a
          href="https://www.facebook.com/789005134298348"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold transition-all"
        >
          Follow our Facebook Page
          <ExternalLink size={13} />
        </a>
      </div>
    )
  }

  const current = posts[index]

  return (
    <div className="w-full max-w-[500px]">
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Latest Facebook posts"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="relative h-[480px] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-xl bg-white dark:bg-gray-800 select-none"
      >
        {/* Slides */}
        <AnimatePresence mode="wait">
          <motion.article
            key={current.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.35, ease: 'easeOut' }}
            className="absolute inset-0 flex flex-col"
            aria-roledescription="slide"
            aria-label={`Slide ${index + 1} of ${posts.length}`}
          >
            {/* Post image (if any) */}
            <div className="flex-1 min-h-0 bg-gray-100 dark:bg-gray-900/40 flex items-center justify-center overflow-hidden">
              {current.full_picture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={current.full_picture}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <MessageSquare className="w-12 h-12 text-emerald-500/40" />
              )}
            </div>

            {/* Post body */}
            <div className="p-5 border-t border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800">
              <div className="flex items-center gap-2 mb-2 text-xs text-gray-400 dark:text-gray-500">
                <CalendarDays size={14} className="text-emerald-500" />
                <span>{formatDate(current.created_time)}</span>
              </div>
              <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed line-clamp-3 font-medium min-h-[3.75rem]">
                {current.message || 'New update from PLENRO Misamis Oriental.'}
              </p>
              {current.permalink_url && (
                <a
                  href={current.permalink_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  View on Facebook
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          </motion.article>
        </AnimatePresence>

        {/* Prev / Next */}
        {posts.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous post"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 dark:bg-gray-900/80 backdrop-blur border border-gray-200/70 dark:border-gray-700 shadow-md flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next post"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 dark:bg-gray-900/80 backdrop-blur border border-gray-200/70 dark:border-gray-700 shadow-md flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Dot indicators */}
      {posts.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4" role="group" aria-label="Post navigation">
          {posts.map((post, i) => (
            <button
              key={post.id}
              type="button"
              aria-label={`Go to post ${i + 1}`}
              aria-current={i === index ? 'true' : undefined}
              onClick={() => goTo(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                i === index
                  ? 'bg-emerald-500 w-6'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-emerald-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
