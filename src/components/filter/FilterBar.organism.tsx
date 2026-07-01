'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent, useState } from 'react'
import FilterIcon from '~/assets/icons/filter.svg'
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

const FilterBarOrganism = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const typeList = searchParams.get('type')?.split(',') ?? []
  const isEmptyQuery = searchParams.size === 0

  const handleToggleType = (e: ChangeEvent<HTMLInputElement>) => {
    const nextValue = getChangeTypeList(typeList, e.target.value)
    const params = new URLSearchParams(searchParams)

    if (nextValue.length > 0) {
      params.set('type', nextValue)
    } else {
      params.delete('type')
    }

    router.replace(`${pathname}?${params.toString()}`)
  }

  const handleReset = () => {
    router.replace(pathname)
  }

  return (
    <div
      role="search"
      aria-label="타입별 포켓몬 필터 검색"
      className="w-full max-w-[1280px] mx-auto px-5"
    >
      {/* 타입 칩 — 가로 스크롤(칩이 뷰포트보다 많을 때). 데스크톱은 넉넉히 펼침 */}
      <ul className="flex items-start gap-2 overflow-x-auto py-2 desktop:justify-between desktop:overflow-visible">
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

      {/* 액션 바 — 필터 열기 + 초기화 */}
      <div className="flex items-center justify-between border-t border-solid border-primary-2 py-3 desktop:border-t-0 desktop:py-2">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 min-h-touch desktop:min-h-9 rounded-2xl bg-primary-3 px-4 text-base font-medium text-primary-1"
        >
          <FilterIcon width="1.5rem" height="1.5rem" aria-hidden="true" />
          필터
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={isEmptyQuery}
          className="min-h-touch desktop:min-h-9 px-2 text-base text-primary-4 disabled:text-primary-2"
        >
          초기화
        </button>
      </div>

      <FilterModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default FilterBarOrganism
