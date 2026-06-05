'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

interface ChampionsMonthFilterProps {
  /** 응답 데이터에서 추출한 사용 가능한 월 목록 (예: ['2026-05','2026-04','2026-03']) */
  availableMonths: string[]
  /** 현재 선택된 월 (URL searchParam 기반) */
  currentMonth: string | null
}

/**
 * "2026-05" → "2026년 5월" 형식 라벨 변환.
 */
const formatMonthLabel = (month: string): string => {
  const [year, monthNum] = month.split('-')
  if (!year || !monthNum) return month
  return `${year}년 ${parseInt(monthNum, 10)}월`
}

const ChampionsMonthFilter = ({
  availableMonths,
  currentMonth,
}: ChampionsMonthFilterProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
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
        onChange={(e) => handleChange(e.target.value)}
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

export default ChampionsMonthFilter
