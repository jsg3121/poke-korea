'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent, useState } from 'react'
import FilterIcon from '~/assets/icons/filter.svg'
import AppliedFilterChip from '~/components/chip/AppliedFilterChip.component'
import ChipComponent from '~/components/chip/Chip.component'
import { ChipColor } from '~/components/chip/chipStyle'
import TypeChip from '~/components/chip/TypeChip.component'
import { PokemonTypes } from '~/types/pokemonTypes.types'

/**
 * 기술 필터 바 (organism 조립, UX-008). 타입(18종)·데미지분류(3종)·첫 등장
 * 세대(9종) 필터와 URL 쿼리 동기화를 담당한다.
 *
 * 도감 리스트의 FilterBar organism을 그대로 이식하지 않는다 — 필터 축 성격이
 * 다르다(리스트는 타입 다중 2개+모달 불리언, 기술은 세 축 모두 단일 선택).
 * TypeChip(mode='single')·Chip(clickable)·AppliedFilterChip 원자만 재사용해
 * 기술 전용으로 조립한다.
 *
 * 필터 행은 접이식(기본 접힘, UX-008 §10-2 사용자 확정) — 검색+카운트만 상시
 * 보이게 해 모바일 sticky 크롬 높이를 최소화한다. 단 적용 필터 칩은 접힘
 * 상태에서도 상시 노출한다(적용 필터가 안 보이면 결과를 오해한다, Baymard·
 * 구버전 C2 결함의 재발 방지 — 접이식이어도 이 줄만은 예외).
 *
 * URL 파라미터는 구버전 규약 유지(page.tsx가 그대로 소비): typeFilter=FIRE,
 * damageTypeFilter=물리(한글), firstGenerationId=3. 초기화는 필터 3종만 지우고
 * 검색어(search)는 보존한다(검색·필터는 독립 과업 — 검색어 유실 방지, B그룹
 * Gemini 리뷰 d841bc4와 동일 원칙).
 */

/** TypeChip 단일 선택 radio 그룹명 (id 접두사 겸용) */
const TYPE_GROUP_NAME = 'moves-type-filter'

const TYPE_ENTRIES = Object.entries(PokemonTypes) as Array<
  [string, PokemonTypes]
>

/** 데미지 분류 옵션 — URL 값(한글)과 Chip 색 매핑 */
const DAMAGE_OPTIONS: Array<{ label: string; color: ChipColor }> = [
  { label: '물리', color: 'physical' },
  { label: '특수', color: 'special' },
  { label: '변화', color: 'status' },
]

/** 첫 등장 세대 옵션 (1~9세대) */
const GENERATION_OPTIONS = Array.from({ length: 9 }, (_, i) => `${i + 1}`)

const MovesFilterBarContainer = () => {
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

  // 단일 선택 토글 공통 — 같은 값을 다시 고르면 해제(파라미터 삭제)
  const toggleParam = (key: string, current: string, next: string) => {
    const params = new URLSearchParams(searchParams)
    if (current === next) {
      params.delete(key)
    } else {
      params.set(key, next)
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const handleToggleType = (e: ChangeEvent<HTMLInputElement>) => {
    toggleParam('typeFilter', typeFilter, e.currentTarget.value)
  }

  const handleReset = () => {
    // 검색어(search)는 보존 — 필터 초기화가 검색까지 지우면 과업이 섞인다
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
      {/* 액션 바 — 필터 펼침/접힘 + 초기화 (FilterBar 액션바와 동일 시각 규격) */}
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
            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
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
          {/* 타입 칩 — 단일 선택 radio 그룹. 가로 스크롤(모바일), 데스크톱 펼침 */}
          <ul
            role="radiogroup"
            aria-label="타입 필터"
            className="flex items-start gap-2 overflow-x-auto py-1 desktop:justify-between desktop:overflow-visible"
          >
            {TYPE_ENTRIES.map(([value, name]) => (
              <li key={`moves-type-filter-${value}`}>
                <TypeChip
                  value={value}
                  label={name}
                  active={typeFilter === value}
                  mode="single"
                  name={TYPE_GROUP_NAME}
                  onChange={handleToggleType}
                />
              </li>
            ))}
          </ul>

          {/* 분류 칩 — MoveTable과 동일한 데미지 색 매핑(Chip color) */}
          <div
            role="group"
            aria-label="데미지 분류 필터"
            className="flex flex-wrap items-center gap-2 py-1"
          >
            {DAMAGE_OPTIONS.map(({ label, color }) => (
              <ChipComponent
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

          {/* 세대 칩 — 가로 스크롤(모바일 9개는 한 줄 초과) */}
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
                <ChipComponent
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

      {/* 적용 필터 칩 — 접힘 상태에서도 상시 노출(적용 필터 가시성, C2 재발 방지) */}
      {hasAppliedFilter && (
        <ul
          aria-label="적용된 필터"
          className="flex items-center gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {typeFilter && (
            <li className="shrink-0">
              <AppliedFilterChip
                label={
                  PokemonTypes[typeFilter as keyof typeof PokemonTypes] ??
                  typeFilter
                }
                onRemove={() =>
                  toggleParam('typeFilter', typeFilter, typeFilter)
                }
              />
            </li>
          )}
          {damageTypeFilter && (
            <li className="shrink-0">
              <AppliedFilterChip
                label={damageTypeFilter}
                onRemove={() =>
                  toggleParam(
                    'damageTypeFilter',
                    damageTypeFilter,
                    damageTypeFilter,
                  )
                }
              />
            </li>
          )}
          {firstGenerationId && (
            <li className="shrink-0">
              <AppliedFilterChip
                label={`${firstGenerationId}세대`}
                onRemove={() =>
                  toggleParam(
                    'firstGenerationId',
                    firstGenerationId,
                    firstGenerationId,
                  )
                }
              />
            </li>
          )}
        </ul>
      )}
    </div>
  )
}

export default MovesFilterBarContainer
