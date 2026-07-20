'use client'

import { ChangeEvent, useContext } from 'react'
import TypeChipComponent from '~/components/chip/TypeChip.component'
import { TypeEffectivenessContext } from '~/context/TypeEffectiveness.context'
import { PokemonType } from '~/graphql/typeGenerated'
import { PokemonTypes } from '~/types/pokemonTypes.types'

/**
 * 상대 타입 선택 계산기 (반응형 단일 — UX-009). 구버전 데/모 2벌
 * TypeEffectivenessCaculator를 대체한다.
 *
 * 타입 토글은 TypeChip DS(mode='multi')를 재사용한다 — 도감 리스트 FilterBar와
 * 동일한 "다중 선택 + 최대 2개 잠금" 요구라 원자가 그대로 맞는다. 구버전의
 * 자체 알약 버튼은 선택/미선택이 투명도 차이(opacity-100/60)뿐이라 구별이
 * 안 되던 결함(UX-009 C2)이 있었고, TypeChip은 grayscale↔컬러 전환 + 라벨
 * 볼드로 선택 상태를 명확히 신호한다.
 *
 * "최대 2개" 제약은 선택 완료 후에야 안내되던 것을 상시 보조문구로 선제
 * 고지한다(m1). 초기화는 타입 목록에 섞여 있던 것(19번째 li)을 그룹 밖 별도
 * 액션(Button DS)으로 분리한다(m2).
 */

const TYPE_ENTRIES = Object.entries(PokemonTypes) as Array<
  [string, PokemonTypes]
>

const TypeCalculatorContainer = () => {
  const {
    isMaxSelectType,
    selectTypeList,
    handleChangeTypes,
    handleResetSelectTypes,
  } = useContext(TypeEffectivenessContext)

  const handleToggleType = (e: ChangeEvent<HTMLInputElement>) => {
    handleChangeTypes(e.currentTarget.value as PokemonType)
  }

  return (
    <section
      className="w-full border-b border-solid border-primary-4 pb-6 desktop:pb-8"
      aria-labelledby="select-type-pokemon"
    >
      <header className="mb-4">
        <h2
          id="select-type-pokemon"
          className="text-xl desktop:text-3xl font-semibold text-primary-4 leading-tight"
        >
          상대 포켓몬 약점 찾기
        </h2>
        {/* 최대 2개 제약을 상시 고지(m1) — 상태 따라 문장이 바뀌면 제약을
            선택 완료 후에야 알게 된다 */}
        <p className="mt-2 text-base font-semibold text-primary-3">
          상대하려는 포켓몬의 타입을 선택해주세요! 타입은 최대 2개까지 선택
          가능해요.
        </p>
      </header>

      {/* 모바일은 auto-fit 그리드로 균등 분배 — 고정폭 칩(w-12)을 flex-wrap으로
          나열하면 기기 폭에 따라 우측에만 잉여 공백이 몰린다(로컬 피드백
          2026-07-20). 데스크톱은 폭 여유가 있어 flex-wrap 자연 배치 유지. */}
      <div
        role="group"
        aria-label="상대 포켓몬 타입 선택"
        className="grid grid-cols-[repeat(auto-fit,minmax(3rem,1fr))] justify-items-center gap-y-2 desktop:flex desktop:flex-wrap desktop:items-start desktop:gap-3"
      >
        {TYPE_ENTRIES.map(([value, name]) => {
          const active = selectTypeList.includes(value as PokemonType)
          const disabled = isMaxSelectType && !active
          return (
            <TypeChipComponent
              key={`calculator-type-${value}`}
              value={value}
              label={name}
              active={active}
              disabled={disabled}
              onChange={handleToggleType}
            />
          )
        })}
      </div>

      {/* 초기화는 본문 CTA가 아니라 보조 액션 — Button DS(min-h-touch 44px 강제)는
          모바일에서 과대하다(로컬 피드백). 도감 리스트·기술 필터의 초기화와 동일한
          슬림 버튼 문법(min-h-8/desktop:min-h-9, ADR-0011 슬림 계열)으로 통일. */}
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={handleResetSelectTypes}
          disabled={selectTypeList.length === 0}
          className="min-h-8 shrink-0 px-2 text-xs text-primary-4 disabled:text-primary-2 desktop:min-h-9 desktop:text-sm"
        >
          선택 초기화
        </button>
      </div>
    </section>
  )
}

export default TypeCalculatorContainer
