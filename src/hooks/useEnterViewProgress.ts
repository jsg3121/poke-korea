'use client'

import { useEffect, useState } from 'react'

const DEFAULT_DURATION_MS = 900
const DEFAULT_THRESHOLD = 0.35

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

interface UseEnterViewProgressOptions {
  enabled?: boolean
  durationMs?: number
  threshold?: number
}

export const useEnterViewProgress = <T extends HTMLElement>({
  enabled = true,
  durationMs = DEFAULT_DURATION_MS,
  threshold = DEFAULT_THRESHOLD,
}: UseEnterViewProgressOptions = {}): {
  ref: (node: T | null) => void
  progress: number
} => {
  const [node, setNode] = useState<T | null>(null)
  const [progress, setProgress] = useState(1)

  useEffect(() => {
    if (!enabled) {
      return undefined
    }
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (prefersReduced || !('IntersectionObserver' in window)) {
      return undefined
    }

    const root = node
    if (!root) {
      return undefined
    }

    let rafId = 0
    let isFirstCallback = true

    const observer = new IntersectionObserver(
      (entries) => {
        const isIntersecting = entries.some((entry) => entry.isIntersecting)

        if (isFirstCallback) {
          isFirstCallback = false
          if (isIntersecting) {
            observer.disconnect()
            return
          }
          setProgress(0)
          return
        }

        if (!isIntersecting) {
          return
        }
        observer.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min((now - start) / durationMs, 1)
          setProgress(easeOutCubic(t))
          if (t < 1) {
            rafId = requestAnimationFrame(tick)
          }
        }
        rafId = requestAnimationFrame(tick)
      },
      { threshold },
    )
    observer.observe(root)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(rafId)
    }
  }, [node, enabled, durationMs, threshold])

  return { ref: setNode, progress }
}
