'use client'

import { ChangeEvent, useContext } from 'react'

import { PokemonTypes } from '~/types/pokemonTypes.types'
import { PokemonType } from '~/graphql/typeGenerated'
import { TypeEffectivenessContext } from '~/context/TypeEffectiveness.context'
import TypeChip from '~/components/chip/TypeChip.component'

const TYPE_ENTRIES = Object.entries(PokemonTypes) as Array<
  [PokemonType, PokemonTypes]
>

const TypeCalculator = () => {
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
        <p className="mt-2 text-base font-semibold text-primary-3">
          상대하려는 포켓몬의 타입을 선택해주세요! 타입은 최대 2개까지 선택
          가능해요.
        </p>
      </header>

      <button
        type="button"
        onClick={handleResetSelectTypes}
        disabled={selectTypeList.length === 0}
        className="min-h-8 mb-2 shrink-0 px-2 text-xs text-primary-4 disabled:text-primary-2 desktop:min-h-9 desktop:text-sm"
      >
        선택 초기화
      </button>

      <div
        role="group"
        aria-label="상대 포켓몬 타입 선택"
        className="grid grid-cols-[repeat(auto-fit,minmax(3rem,1fr))] justify-items-center gap-y-2 desktop:flex desktop:flex-wrap desktop:items-start desktop:gap-3"
      >
        {TYPE_ENTRIES.map(([value, name]) => {
          const active = selectTypeList.includes(value)
          const disabled = isMaxSelectType && !active
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
