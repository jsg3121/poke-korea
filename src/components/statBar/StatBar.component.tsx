'use client'

import { useEnterViewProgress } from '~/hooks/useEnterViewProgress'

const STAT_MAX_PADDING = 20

export interface StatBarItem {
  label: string
  value: number
}

interface StatBarProps {
  stats: StatBarItem[]
  showTotal?: boolean
  animated?: boolean
}

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

const StatBar = ({
  stats,
  showTotal = true,
  animated = true,
}: StatBarProps) => {
  const { ref: rootRef, progress } = useEnterViewProgress<HTMLDivElement>({
    enabled: animated,
  })

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

export default StatBar
