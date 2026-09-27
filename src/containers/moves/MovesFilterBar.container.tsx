'use client'

import { ChangeEvent, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import FilterIcon from '~/assets/icons/filter.svg'
import { PokemonTypes } from '~/types/pokemonTypes.types'
import AppliedFilterChip from '~/components/chip/AppliedFilterChip.component'
import Chip from '~/components/chip/Chip.component'
import { ChipColor } from '~/components/chip/chip.types'
import TypeChip from '~/components/chip/TypeChip.component'

const TYPE_GROUP_NAME = 'moves-type-filter'

const TYPE_ENTRIES = Object.entries(PokemonTypes) as Array<
  [string, PokemonTypes]
>

const DAMAGE_OPTIONS: Array<{ label: string; color: ChipColor }> = [
  { label: '물리', color: 'physical' },
  { label: '특수', color: 'special' },
  { label: '변화', color: 'status' },
]

const GENERATION_OPTIONS = Array.from({ length: 9 }, (_, i) => `${i + 1}`)

const MovesFilterBar = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const [isOpen, setIsOpen] = useState(false)

  const typeFilter = searchParams.get('typeFilter') ?? ''
  const damageTypeFilter = searchParams.get('damageTypeFilter') ?? ''
  const firstGenerationId = searchParams.get('firstGenerationId') ?? ''
  const hasAppliedFilter = Boolean(
    typeFilter || damageTypeFilter || firstGenerationId,
  )

  const appliedFilters = [
    {
      key: 'typeFilter',
      value: typeFilter,
      label:
        PokemonTypes[typeFilter as keyof typeof PokemonTypes] ?? typeFilter,
    },
    {
      key: 'damageTypeFilter',
      value: damageTypeFilter,
      label: damageTypeFilter,
    },
    {
      key: 'firstGenerationId',
      value: firstGenerationId,
      label: `${firstGenerationId}세대`,
    },
  ].filter(({ value }) => value)

  const toggleParam = (key: string, current: string, next: string) => {
    const params = new URLSearchParams(searchParams)
    if (current === next) {
      params.delete(key)
    } else {
      params.set(key, next)
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const removeParam = (key: string) => {
    const params = new URLSearchParams(searchParams)
    params.delete(key)
    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  const handleToggleType = (e: ChangeEvent<HTMLInputElement>) => {
    toggleParam('typeFilter', typeFilter, e.currentTarget.value)
  }

  const handleReset = () => {
    const params = new URLSearchParams(searchParams)
    params.delete('typeFilter')
    params.delete('damageTypeFilter')
    params.delete('firstGenerationId')
    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    })
  }

  return (
    <div role="search" aria-label="기술 필터">
      <div className="flex items-center gap-2 py-1.5 desktop:py-2">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          className="inline-flex shrink-0 items-center gap-1.5 min-h-8 rounded-2xl bg-primary-3 px-3 text-xs font-medium text-primary-1 desktop:gap-2 desktop:min-h-9 desktop:text-sm"
        >
          <FilterIcon
            aria-hidden="true"
            className="h-4 w-4 desktop:h-5 desktop:w-5"
          />
          필터
          <span
            aria-hidden="true"
            className={`text-sm leading-none transition-transform desktop:text-base ${isOpen ? 'rotate-180' : ''}`}
          >
            ▾
          </span>
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={!hasAppliedFilter}
          className="ml-auto min-h-8 shrink-0 px-2 text-xs text-primary-4 disabled:text-primary-2 desktop:min-h-9 desktop:text-sm"
        >
          초기화
        </button>
      </div>

      {isOpen && (
        <div className="flex flex-col gap-1 pb-1.5">
          <div
            role="radiogroup"
            aria-label="타입 필터"
            className="flex items-start gap-2 overflow-x-auto py-1 desktop:justify-between desktop:overflow-visible"
          >
            {TYPE_ENTRIES.map(([value, name]) => (
              <TypeChip
                key={`moves-type-filter-${value}`}
                value={value}
                label={name}
                active={typeFilter === value}
                mode="single"
                name={TYPE_GROUP_NAME}
                onChange={handleToggleType}
              />
            ))}
          </div>

          <div
            role="group"
            aria-label="데미지 분류 필터"
            className="flex flex-wrap items-center gap-2 py-1"
          >
            {DAMAGE_OPTIONS.map(({ label, color }) => (
              <Chip
                key={`damage-filter-${label}`}
                label={label}
                color={color}
                clickable
                active={damageTypeFilter === label}
                onClick={() =>
                  toggleParam('damageTypeFilter', damageTypeFilter, label)
                }
              />
            ))}
          </div>

          <div
            role="group"
            aria-label="첫 등장 세대 필터"
            className="flex items-center gap-2 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {GENERATION_OPTIONS.map((generation) => (
              <span
                key={`generation-filter-${generation}`}
                className="shrink-0"
              >
                <Chip
                  label={`${generation}세대`}
                  clickable
                  active={firstGenerationId === generation}
                  onClick={() =>
                    toggleParam(
                      'firstGenerationId',
                      firstGenerationId,
                      generation,
                    )
                  }
                />
              </span>
            ))}
          </div>
        </div>
      )}

      {hasAppliedFilter && (
        <ul
          aria-label="적용된 필터"
          className="flex items-center gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {appliedFilters.map(({ key, label }) => (
            <li key={`applied-filter-${key}`} className="shrink-0">
              <AppliedFilterChip
                label={label}
                onRemove={() => removeParam(key)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default MovesFilterBar
