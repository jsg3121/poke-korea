'use client'

import { ChangeEvent } from 'react'

import { PokemonTypes } from '~/types/pokemonTypes.types'
import { PokemonType } from '~/graphql/typeGenerated'
import { useTypeEffectiveness } from '~/context/TypeEffectiveness.context'
import TypeChip from '~/components/chip/TypeChip.component'

import { useChipCalcTracking } from './hooks/useChipCalcTracking'
import TypePokemonNameSearch from './TypePokemonNameSearch.container'

const TYPE_ENTRIES = Object.entries(PokemonTypes) as Array<
  [PokemonType, PokemonTypes]
>

const DEFAULT_GUIDE =
  '포켓몬 이름을 입력하거나 타입을 직접 선택해주세요. 타입은 최대 2개까지 고를 수 있어요.'

const GUIDE_ID = 'type-calculator-guide'

const TypeCalculator = () => {
  const {
    isMaxSelectType,
    selectTypeList,
    selectedPokemon,
    handleChangeTypes,
    handleResetSelectTypes,
  } = useTypeEffectiveness()
  useChipCalcTracking(selectTypeList, selectedPokemon !== null)

  const isNameSelected = selectedPokemon !== null
  const guideText = isNameSelected
    ? `${selectedPokemon.name} 기준으로 계산했어요. 다른 타입을 고르려면 선택 초기화를 눌러주세요.`
    : DEFAULT_GUIDE

  const handleToggleType = (e: ChangeEvent<HTMLInputElement>) => {
    handleChangeTypes(e.currentTarget.value as PokemonType)
  }

  return (
    <section
      className="w-full border-b border-solid border-primary-4 pb-4"
      aria-labelledby="select-type-pokemon"
    >
      <header className="mb-4">
        <h2
          id="select-type-pokemon"
          className="text-xl desktop:text-3xl font-semibold text-primary-4 leading-tight"
        >
          상대 포켓몬 약점 찾기
        </h2>
        <p
          id={GUIDE_ID}
          className="mt-2 text-base font-semibold text-primary-3"
        >
          {guideText}
        </p>
      </header>

      <TypePokemonNameSearch />

      <button
        type="button"
        onClick={handleResetSelectTypes}
        disabled={selectTypeList.length === 0}
        className="min-h-touch mb-2 shrink-0 px-2 text-xs text-primary-4 disabled:text-primary-2 desktop:text-sm"
      >
        선택 초기화
      </button>

      <div
        role="group"
        aria-label="상대 포켓몬 타입 선택"
        aria-describedby={GUIDE_ID}
        className="grid grid-cols-[repeat(auto-fit,minmax(3rem,1fr))] justify-items-center gap-y-2 desktop:flex desktop:flex-wrap desktop:items-start desktop:gap-3"
      >
        {TYPE_ENTRIES.map(([value, name]) => {
          const active = selectTypeList.includes(value)
          const disabled = isNameSelected ? !active : isMaxSelectType && !active
          return (
            <TypeChip
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
    </section>
  )
}

export default TypeCalculator
