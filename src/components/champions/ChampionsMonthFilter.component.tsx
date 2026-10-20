'use client'

import { Suspense } from 'react'

import ChampionsMonthFilterSelect, {
  ChampionsMonthFilterSelectProps,
} from './ChampionsMonthFilterSelect.component'

const ChampionsMonthFilter = (props: ChampionsMonthFilterSelectProps) => {
  return (
    <Suspense
      fallback={
        <div
          aria-hidden="true"
          className="w-32 h-9 bg-primary-3 rounded-md animate-pulse"
        />
      }
    >
      <ChampionsMonthFilterSelect {...props} />
    </Suspense>
  )
}

export default ChampionsMonthFilter
