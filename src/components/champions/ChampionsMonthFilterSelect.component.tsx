'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import SelectInput from '~/components/input/SelectInput.component'

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

  const monthOptions = [
    { value: '', label: '전체 기간' },
    ...availableMonths.map((month) => ({
      value: month,
      label: formatMonthLabel(month),
    })),
  ]

  const handleChangeMonth = (value: string) => {
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
    <SelectInput
      label="월별 필터"
      visuallyHiddenLabel
      value={currentMonth ?? ''}
      options={monthOptions}
      onChange={handleChangeMonth}
    />
  )
}

export default ChampionsMonthFilterSelect
