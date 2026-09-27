'use client'

import { ChangeEvent, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import FilterIcon from '~/assets/icons/filter.svg'
import { PokemonTypes } from '~/types/pokemonTypes.types'
import { getChangeTypeList } from '~/modules/getChangeTypeList.module'
import AppliedFilterChip from '~/components/chip/AppliedFilterChip.component'
import TypeChip from '~/components/chip/TypeChip.component'

import FilterModal from './FilterModal.component'

const MAX_TYPE_SELECTION = 2

const TYPE_ENTRIES = Object.entries(PokemonTypes) as Array<
  [string, PokemonTypes]
>

const BOOLEAN_FILTER_LABELS: Record<string, string> = {
  isMega: '메가진화',
  isRegion: '리전폼',
  isGigantamax: '거다이맥스',
  isEvolution: '진화 가능',
}

interface AppliedFilter {
  key: string
  value?: string
  label: string
}

const FilterBar = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const typeList = searchParams.get('type')?.split(',').filter(Boolean) ?? []
  const isEmptyQuery = searchParams.size === 0

  const handleToggleType = (e: ChangeEvent<HTMLInputElement>) => {
    const nextValue = getChangeTypeList(typeList, e.target.value)
    const params = new URLSearchParams(searchParams)

    if (nextValue !== '') {
      params.set('type', nextValue)
    } else {
      params.delete('type')
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const handleReset = () => {
    router.replace(pathname, { scroll: false })
  }

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
      className="w-full max-w-[1280px] mx-auto px-4"
    >
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
        <button
          type="button"
          onClick={handleReset}
          disabled={isEmptyQuery}
          className="ml-auto min-h-8 shrink-0 px-2 text-xs text-primary-4 disabled:text-primary-2 desktop:min-h-9 desktop:text-sm"
        >
          초기화
        </button>
      </div>

      {appliedFilters.length > 0 && (
        <ul
          aria-label="적용된 필터"
          className="flex items-center gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {appliedFilters.map((filter) => (
            <li
              key={`${filter.key}-${filter.value ?? 'flag'}`}
              className="shrink-0"
            >
              <AppliedFilterChip
                label={filter.label}
                onRemove={() => handleRemoveFilter(filter)}
              />
            </li>
          ))}
        </ul>
      )}

      <FilterModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default FilterBar
