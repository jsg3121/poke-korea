'use client'

import { ChangeEvent } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { formatMonthLabel } from './utils/championsMonth.util'

export interface ChampionsMonthFilterSelectProps {
  availableMonths: string[]
  currentMonth: string | null
}

const ChampionsMonthFilterSelect = ({
  availableMonths,
  currentMonth,
}: ChampionsMonthFilterSelectProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleChangeMonth = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    const params = new URLSearchParams(searchParams.toString())
    if (value !== '') {
      params.set('month', value)
    } else {
      params.delete('month')
    }
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  return (
    <label className="inline-flex items-center gap-2">
      <span className="sr-only">월별 필터</span>
      <select
        value={currentMonth ?? ''}
        onChange={handleChangeMonth}
        className="bg-primary-4 text-primary-1 border-[2px] border-solid border-primary-1 rounded-md px-3 py-1.5 text-sm font-bold cursor-pointer hover:bg-primary-3 transition-colors"
      >
        <option value="">전체 기간</option>
        {availableMonths.map((month) => (
          <option key={month} value={month}>
            {formatMonthLabel(month)}
          </option>
        ))}
      </select>
    </label>
  )
}

export default ChampionsMonthFilterSelect
