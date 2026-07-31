'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent } from 'react'
import TypeChip from '~/components/chip/TypeChip.component'
import { getChangeTypeList } from '~/module/getChangeTypeList'
import { PokemonTypes } from '~/types/pokemonTypes.types'

/**
 * 챔피언스 도감 타입 필터. 포켓몬 도감 리스트(FilterBar.organism)와 동일한 공유
 * TypeChip 원자를 사용해 타입 필터 디자인을 통일한다(아이콘 하단 타입명 상시 노출,
 * 미선택은 원본색 연하게·선택 시 컬러). 도메인 로직(URL 쿼리 동기화, 최대 2개
 * 선택 제약)은 이 컴포넌트가 담당하고, 개별 토글 표현은 TypeChip에 위임한다.
 */

/** 타입 동시 선택 최대 수 */
const MAX_TYPE_SELECTION = 2

const TYPE_ENTRIES = Object.entries(PokemonTypes) as Array<
  [string, PokemonTypes]
>

const ChampionsTypeFilter = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // filter(Boolean)으로 빈 문자열 방어 — `type=`(빈값)이면 split이 ['']을 반환하므로
  const typeList = searchParams.get('type')?.split(',').filter(Boolean) ?? []

  const handleClickTypeFilter = (e: ChangeEvent<HTMLInputElement>) => {
    const type = e.target.value
    const changeList = getChangeTypeList(typeList, type)
    const params = new URLSearchParams(searchParams)

    if (changeList.length > 0) {
      params.set('type', changeList)
    } else {
      params.delete('type')
    }

    router.replace(`${pathname}?${params.toString()}`)
  }

  const handleClickReset = () => {
    router.replace(pathname)
  }

  const isEmptyQuery = searchParams.size === 0

  return (
    <div
      role="search"
      aria-label="타입별 포켓몬 필터 검색"
      className="w-full h-full flex items-center relative gap-2"
    >
      <ul className="flex-1 min-w-0 flex items-start gap-2 overflow-x-auto py-1 desktop:overflow-visible desktop:justify-between [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {TYPE_ENTRIES.map(([value, name]) => {
          const active = typeList.includes(value)
          const disabled = !active && typeList.length >= MAX_TYPE_SELECTION
          return (
            <li key={`champions-type-filter-${value}`}>
              <TypeChip
                value={value}
                label={name}
                active={active}
                disabled={disabled}
                onChange={handleClickTypeFilter}
              />
            </li>
          )
        })}
      </ul>
      <button
        className="flex-shrink-0 text-primary-4 disabled:text-primary-2 text-xs whitespace-nowrap desktop:ml-4"
        onClick={handleClickReset}
        disabled={isEmptyQuery}
      >
        초기화
      </button>
    </div>
  )
}

export default ChampionsTypeFilter
