'use client'

import { useEffect, useState } from 'react'

const REPLAY_DURATION_MS = 600

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * `replayKey`가 바뀔 때마다 0 → 1 진행률을 처음부터 다시 재생한다.
 *
 * @param replayKey 재생 신호. 0이면 재생하지 않고 1을 유지한다
 * @returns 진행률(0~1)
 */
export const useReplayProgress = (replayKey: number): number => {
  const [played, setPlayed] = useState({ key: 0, progress: 1 })

  useEffect(() => {
    if (replayKey === 0) return undefined

    if (prefersReducedMotion()) {
      setPlayed({ key: replayKey, progress: 1 })
      return undefined
    }

    let rafId = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / REPLAY_DURATION_MS, 1)
      setPlayed({ key: replayKey, progress: easeOutCubic(t) })
      if (t < 1) {
        rafId = requestAnimationFrame(tick)
      }
    }
    rafId = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(rafId)
  }, [replayKey])

  if (replayKey !== 0 && played.key !== replayKey) {
    return prefersReducedMotion() ? 1 : 0
  }
  return played.progress
}
