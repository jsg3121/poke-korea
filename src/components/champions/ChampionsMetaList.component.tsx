'use client'

import { useEnterViewProgress } from '~/hooks/useEnterViewProgress'

const ENTER_THRESHOLD = 0.25

interface ChampionsMetaListProps {
  title: string
  items: Array<{ name: string; usageRate: number }>
}

const formatRate = (value: number, decimals: number) => value.toFixed(decimals)

const ChampionsMetaList = ({ title, items }: ChampionsMetaListProps) => {
  const { ref: rootRef, progress } = useEnterViewProgress<HTMLDivElement>({
    threshold: ENTER_THRESHOLD,
  })

  const maxRate = Math.max(...items.map((item) => item.usageRate), 1)

  return (
    <div ref={rootRef} className="p-3 bg-primary-3/25 rounded-lg">
      <h3 className="font-bold text-sm mb-3 text-primary-1">{title}</h3>
      <ul className="space-y-3">
        {items.map((item, index) => {
          const isTop = index === 0
          const percentage = (item.usageRate / maxRate) * 100
          const decimals = (item.usageRate.toString().split('.')[1] ?? '')
            .length

          return (
            <li key={`${item.name}-${index}`} className="space-y-1">
              <div className="flex justify-between gap-2 text-sm">
                <span className="font-medium text-primary-1 break-keep">
                  {item.name}
                </span>
                <span
                  className={`shrink-0 font-semibold ${
                    isTop ? 'text-primary-1' : 'text-primary-2'
                  }`}
                >
                  <span aria-hidden="true">
                    {formatRate(item.usageRate * progress, decimals)}
                  </span>
                  <span className="sr-only">{item.usageRate}</span>%
                </span>
              </div>
              <div
                aria-hidden="true"
                className="w-full h-2 bg-primary-4 rounded-full overflow-hidden"
              >
                <div
                  className={`h-full rounded-full ${
                    isTop ? 'bg-primary-1' : 'bg-primary-2'
                  }`}
                  style={{ width: `${percentage * progress}%` }}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default ChampionsMetaList
