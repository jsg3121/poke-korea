'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * 종족값 가로 막대 (DS). 스탯명 + 수치 + 막대 + 최고/최저 마커를 한 행으로 표시한다.
 *
 * 레이더(canvas) 차트를 대체하는 DOM 기반 시각화(UX-005 §6-1) — 수치가 실제 DOM
 * 텍스트라 스크린리더가 개별 값을 읽을 수 있고(WCAG 1.1.1), 막대는 장식(aria-hidden)이다.
 *
 * - 막대 최댓값은 고정이 아니라 "최고 능력치 + 20"(사용자 결정, 기존 레이더의
 *   maxPoint+10과 같은 동적 방식) — 개체마다 최고 스탯이 화면을 크게 쓰도록.
 * - 최고/최저는 색 차등 + "최고"/"최저" 텍스트 마커 병기(색 단독 의존 금지,
 *   WCAG 1.4.1). 동률이면 전부 마킹한다(사용자 결정).
 * - 뷰포트 진입 시 수치 카운트업 + 막대 채움 모션(1회). SSR HTML에는 처음부터
 *   최종값이 렌더되고(SEO·no-JS 안전) 모션은 클라이언트 enhancement다.
 *   prefers-reduced-motion 사용자는 모션 없이 즉시 최종값을 본다.
 */

const STAT_MAX_PADDING = 20
const COUNT_UP_DURATION_MS = 900
const ENTER_THRESHOLD = 0.35

export interface StatBarItem {
  /** 스탯명 (예: '체력') */
  label: string
  value: number
}

interface StatBarProps {
  stats: StatBarItem[]
  /** 종족값 총합 행 표시 (기본 true) */
  showTotal?: boolean
  /** 뷰포트 진입 카운트업 모션 (기본 true — reduced-motion 시 자동 비활성) */
  animated?: boolean
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

/** 수치를 aria-hidden 카운터 + sr-only 최종값 쌍으로 표시 — 모션 중에도 SR은 항상 최종값만 읽는다 */
const AnimatedValue = ({
  value,
  progress,
  className,
}: {
  value: number
  progress: number
  className: string
}) => (
  <span className={className}>
    <span aria-hidden="true">{Math.round(value * progress)}</span>
    <span className="sr-only">{value}</span>
  </span>
)

const StatBarComponent = ({
  stats,
  showTotal = true,
  animated = true,
}: StatBarProps) => {
  const rootRef = useRef<HTMLDivElement>(null)
  // SSR/초기 렌더는 progress=1(최종값). 모션이 가능할 때만 클라이언트에서 0으로 되감는다.
  const [progress, setProgress] = useState(1)

  useEffect(() => {
    if (!animated) {
      return undefined
    }
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (prefersReduced || !('IntersectionObserver' in window)) {
      return undefined
    }

    const root = rootRef.current
    if (!root) {
      return undefined
    }

    let rafId = 0
    // 최초 콜백은 "관찰 시작 시점의 상태"다 — 이미 뷰포트에 보이면 모션 없이
    // 최종값을 유지한다(최종값 표시 → 0 리셋 → 카운트업의 이중 표시가 어색,
    // QA 라운드 1). 화면 밖에서 시작한 경우에만 0으로 되감고 진입 시 재생한다.
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
          const t = Math.min((now - start) / COUNT_UP_DURATION_MS, 1)
          setProgress(easeOutCubic(t))
          if (t < 1) {
            rafId = requestAnimationFrame(tick)
          }
        }
        rafId = requestAnimationFrame(tick)
      },
      { threshold: ENTER_THRESHOLD },
    )
    observer.observe(root)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(rafId)
    }
  }, [animated])

  const values = stats.map((stat) => stat.value)
  const barMax = Math.max(...values) + STAT_MAX_PADDING
  const maxValue = Math.max(...values)
  const minValue = Math.min(...values)
  const total = values.reduce((sum, value) => sum + value, 0)

  return (
    <div ref={rootRef} className="w-full">
      {showTotal && (
        <div className="mb-3 flex items-baseline justify-between border-b border-primary-3 pb-3">
          <span className="text-xs font-semibold text-primary-2 desktop:text-sm">
            종족값 총합
          </span>
          <AnimatedValue
            value={total}
            progress={progress}
            className="text-lg font-bold text-primary-1 desktop:text-xl"
          />
        </div>
      )}
      <dl className="flex flex-col gap-1">
        {stats.map((stat) => {
          const isMax = stat.value === maxValue
          const isMin = stat.value === minValue && minValue !== maxValue
          return (
            <div
              key={stat.label}
              className="flex min-h-7 items-center gap-2 desktop:min-h-8"
            >
              <dt className="w-16 shrink-0 text-xs font-semibold text-primary-2">
                {stat.label}
              </dt>
              <dd className="m-0 w-11 shrink-0 text-right">
                {/* 최고/최저는 수치 폰트도 함께 강조(사용자 요청, QA 라운드 1) */}
                <AnimatedValue
                  value={stat.value}
                  progress={progress}
                  className={
                    isMax || isMin
                      ? 'text-sm font-extrabold text-primary-1 desktop:text-base'
                      : 'text-xs font-bold text-primary-1 desktop:text-sm'
                  }
                />
              </dd>
              <dd
                aria-hidden="true"
                className="m-0 h-2.5 flex-1 overflow-hidden rounded-full bg-primary-1/10"
              >
                <span
                  className={`block h-full rounded-full ${
                    isMax
                      ? 'bg-type-grass'
                      : isMin
                        ? 'bg-damage-physical'
                        : 'bg-primary-2'
                  }`}
                  style={{
                    width: `${(stat.value / barMax) * 100 * progress}%`,
                  }}
                />
              </dd>
              <dd className="m-0 w-10 shrink-0 text-center">
                {isMax && (
                  <span className="inline-block rounded-lg bg-type-grass px-1.5 py-0.5 text-2xs font-bold text-black-2">
                    최고
                  </span>
                )}
                {isMin && (
                  <span className="inline-block rounded-lg bg-damage-physical px-1.5 py-0.5 text-2xs font-bold text-primary-1">
                    최저
                  </span>
                )}
              </dd>
            </div>
          )
        })}
      </dl>
    </div>
  )
}

export default StatBarComponent
