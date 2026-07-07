'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent, useState } from 'react'
import FilterIcon from '~/assets/icons/filter.svg'
import AppliedFilterChip from '~/components/chip/AppliedFilterChip.component'
import TypeChip from '~/components/chip/TypeChip.component'
import { getChangeTypeList } from '~/module/getChangeTypeList'
import { PokemonTypes } from '~/types/pokemonTypes.types'
import FilterModal from './FilterModal.organism'

/**
 * 도감 타입 필터 바 (organism). TypeChip(18종) 가로 스크롤 + 필터 버튼 + 초기화 버튼 +
 * FilterModal(organism)을 조립하고, 타입 필터 URL 쿼리 동기화를 담당한다.
 *
 * 데/모 2벌(components/filter·container/desktop/header/filter, 레이아웃이 크게 다름)을
 * CSS 반응형 단일로 통합한다(UA 분기·display:none 없음, ADR-0007). 모바일 퍼스트 —
 * base는 칩 스크롤 줄 + 하단 액션 바, 데스크톱(`desktop:`)은 한 줄 정렬이다.
 *
 * 타입은 최대 2개까지 선택 가능(그 이상은 미선택 항목 잠금). 도메인 로직(쿼리 파싱/갱신,
 * 최대 선택 제약)은 organism이 담당하고, 개별 토글 표현은 TypeChip 원자에 위임한다.
 */

/** 타입 동시 선택 최대 수 */
const MAX_TYPE_SELECTION = 2

const TYPE_ENTRIES = Object.entries(PokemonTypes) as Array<
  [string, PokemonTypes]
>

/** 불리언 필터(FilterModal 적용분)의 칩 라벨 */
const BOOLEAN_FILTER_LABELS: Record<string, string> = {
  isMega: '메가진화',
  isRegion: '리전폼',
  isGigantamax: '거다이맥스',
  isEvolution: '진화 가능',
}

/** 적용된 필터 하나 (칩 표시·개별 해제 단위) */
interface AppliedFilter {
  key: string
  /** 다중 값 파라미터(type·generation)의 개별 값 */
  value?: string
  label: string
}

const FilterBarOrganism = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const [isModalOpen, setIsModalOpen] = useState(false)

  // filter(Boolean)으로 빈 문자열 방어 — `type=`(빈값)이면 split이 ['']을 반환하는데
  // 이를 걸러 실제 타입이 없을 때 빈 배열이 되게 한다
  const typeList = searchParams.get('type')?.split(',').filter(Boolean) ?? []
  const isEmptyQuery = searchParams.size === 0

  const handleToggleType = (e: ChangeEvent<HTMLInputElement>) => {
    // getChangeTypeList는 쉼표로 조인한 문자열을 반환한다(빈 문자열이면 선택 없음)
    const nextValue = getChangeTypeList(typeList, e.target.value)
    const params = new URLSearchParams(searchParams)

    if (nextValue !== '') {
      params.set('type', nextValue)
    } else {
      params.delete('type')
    }

    // 칩 토글은 페이지 상단 이동이 불필요하므로 스크롤 유지
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const handleReset = () => {
    router.replace(pathname, { scroll: false })
  }

  // 적용된 필터를 칩으로 상시 노출 — 특히 FilterModal에서 적용한 필터(세대·메가 등)는
  // 적용 후 보이지 않아 사용자가 결과를 오해한다(Baymard, RES-002). name(검색어)은
  // 검색 인풋에 이미 보이므로 제외.
  const appliedFilters: AppliedFilter[] = [
    ...typeList.map((t) => ({
      key: 'type',
      value: t,
      label: PokemonTypes[t as keyof typeof PokemonTypes] ?? t,
    })),
    ...searchParams
      .getAll('generation')
      .map((g) => ({ key: 'generation', value: g, label: `${g}세대` })),
    ...Object.entries(BOOLEAN_FILTER_LABELS).flatMap(([key, label]) => {
      const value = searchParams.get(key)
      if (value === 'true') return [{ key, label }]
      if (value === 'false') return [{ key, label: `${label} 제외` }]
      return []
    }),
  ]

  const handleRemoveFilter = (filter: AppliedFilter) => {
    const params = new URLSearchParams(searchParams)
    if (filter.key === 'type') {
      const rest = typeList.filter((t) => t !== filter.value).join(',')
      if (rest) {
        params.set('type', rest)
      } else {
        params.delete('type')
      }
    } else if (filter.key === 'generation') {
      const rest = searchParams
        .getAll('generation')
        .filter((g) => g !== filter.value)
      params.delete('generation')
      rest.forEach((g) => params.append('generation', g))
    } else {
      params.delete(filter.key)
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div
      role="search"
      aria-label="타입별 포켓몬 필터 검색"
      className="w-full max-w-[1280px] mx-auto px-4 desktop:px-8"
    >
      {/* 타입 칩 — 가로 스크롤(칩이 뷰포트보다 많을 때). 데스크톱은 넉넉히 펼침 */}
      <ul className="flex items-start gap-2 overflow-x-auto py-1 desktop:justify-between desktop:overflow-visible">
        {TYPE_ENTRIES.map(([value, name]) => {
          const active = typeList.includes(value)
          const disabled = !active && typeList.length >= MAX_TYPE_SELECTION
          return (
            <li key={`type-filter-${value}`}>
              <TypeChip
                value={value}
                label={name}
                active={active}
                disabled={disabled}
                onChange={handleToggleType}
              />
            </li>
          )
        })}
      </ul>

      {/* 액션 바 — 필터 열기 + 적용 필터 칩(가로 스크롤) + 초기화를 한 줄에 통합
          (sticky 크롬 높이 최소화 — 사용자 피드백). 버튼 높이 모바일 32px(min-h-8)
          /데스크톱 36px(min-h-9): WCAG 2.5.8 AA(24px) 충족, ADR-0011 슬림 컨트롤 계열 */}
      <div className="flex items-center gap-2 border-t border-solid border-primary-2 py-1.5 desktop:border-t-0 desktop:py-2">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex shrink-0 items-center gap-1.5 min-h-8 rounded-2xl bg-primary-3 px-3 text-xs font-medium text-primary-1 desktop:gap-2 desktop:min-h-9 desktop:text-sm"
        >
          <FilterIcon
            aria-hidden="true"
            className="h-4 w-4 desktop:h-5 desktop:w-5"
          />
          필터
        </button>
        {appliedFilters.length > 0 && (
          <div
            aria-label="적용된 필터"
            className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {appliedFilters.map((filter) => (
              <AppliedFilterChip
                key={`${filter.key}-${filter.value ?? 'flag'}`}
                label={filter.label}
                onRemove={() => handleRemoveFilter(filter)}
              />
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={handleReset}
          disabled={isEmptyQuery}
          className="ml-auto min-h-8 shrink-0 px-2 text-xs text-primary-4 disabled:text-primary-2 desktop:min-h-9 desktop:text-sm"
        >
          초기화
        </button>
      </div>

      <FilterModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default FilterBarOrganism
