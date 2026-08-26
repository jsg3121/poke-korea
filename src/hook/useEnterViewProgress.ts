'use client'

import { RefObject, useEffect, useRef, useState } from 'react'

/**
 * 뷰포트 진입 시 0→1로 진행되는 모션 진행도(1회).
 *
 * 카운트업 수치·막대 채움처럼 "최종값은 SSR에 그대로 두고 모션만 클라이언트에서
 * 얹는" 패턴을 위한 훅이다. StatBar·ChampionsMetaList에 중복돼 있던 로직을
 * 1.58.0에서 추출했다.
 *
 * 설계 원칙:
 * - **초기값은 1(최종값)이다.** SSR HTML에 처음부터 최종 수치가 렌더되므로
 *   SEO·no-JS 환경에서 값이 0으로 보이지 않는다. 모션이 가능할 때만 0으로 되감는다.
 * - `prefers-reduced-motion` 사용자와 IntersectionObserver 미지원 환경은
 *   모션 없이 최종값을 유지한다.
 * - **이미 뷰포트에 보이는 상태로 시작하면 모션을 생략한다.** 최초 콜백은
 *   "관찰 시작 시점의 상태"라, 여기서 되감으면 최종값 → 0 → 카운트업의
 *   이중 표시가 되어 어색하다.
 */

const DEFAULT_DURATION_MS = 900
const DEFAULT_THRESHOLD = 0.35

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

interface UseEnterViewProgressOptions {
  /** false면 모션 없이 항상 최종값(1)을 유지한다 */
  enabled?: boolean
  /** 모션 지속 시간(ms) */
  durationMs?: number
  /** 진입 판정 임계값(0~1) */
  threshold?: number
}

export const useEnterViewProgress = <T extends HTMLElement>({
  enabled = true,
  durationMs = DEFAULT_DURATION_MS,
  threshold = DEFAULT_THRESHOLD,
}: UseEnterViewProgressOptions = {}): {
  ref: RefObject<T>
  progress: number
} => {
  const ref = useRef<T>(null)
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

    const root = ref.current
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
  }, [enabled, durationMs, threshold])

  return { ref, progress }
}
