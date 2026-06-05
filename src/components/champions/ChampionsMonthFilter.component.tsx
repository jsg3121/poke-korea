'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

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

/**
 * useSearchParams 를 사용하므로 Suspense 경계 안에서만 동작.
 * Why: Suspense 누락 시 Next.js App Router 가 부모 페이지를 강제 dynamic 으로 전환
 *       → 부모의 ISR(revalidate) 이 깨진다.
 * 근거: https://nextjs.org/docs/app/api-reference/functions/use-search-params#static-rendering
 */
const ChampionsMonthFilterInner = ({
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

const ChampionsMonthFilter = (props: ChampionsMonthFilterProps) => {
  return (
    <Suspense
      fallback={
        <div
          aria-hidden="true"
          className="w-32 h-9 bg-primary-3 rounded-md animate-pulse"
        />
      }
    >
      <ChampionsMonthFilterInner {...props} />
    </Suspense>
  )
}

export default ChampionsMonthFilter
