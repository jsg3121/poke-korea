'use client'
import { MouseEvent, useContext } from 'react'
import ImageComponent from '~/components/Image.component'
import { TypeEffectivenessContext } from '~/context/TypeEffectiveness.context'
import { PokemonType } from '~/graphql/typeGenerated'
import { PokemonTypes } from '~/types/pokemonTypes.types'

const TypeEffectivenessCaculatorComponent = () => {
  const {
    isMaxSelectType,
    selectTypeList,
    handleChangeTypes,
    handleResetSelectTypes,
  } = useContext(TypeEffectivenessContext)

  const handleClickType = (e: MouseEvent<HTMLButtonElement>) => {
    const value = e.currentTarget.value as PokemonType
    handleChangeTypes(value)
  }

  const handleClickResetType = () => {
    handleResetSelectTypes()
  }

  return (
    <section
      className="w-full border-b border-solid border-primary-4 my-4 mb-8 pb-8"
      aria-labelledby="select-type-pokemon"
    >
      <header className="w-full h-24">
        <h2
          id="select-type-pokemon"
          className="w-full h-10 text-[2rem] leading-10 font-semibold text-primary-4 mb-2"
        >
          상대 포켓몬 약점 찾기
        </h2>
        {isMaxSelectType ? (
          <strong className="w-full h-8 block text-xl leading-8 text-primary-4 mb-4">
            포켓몬 타입은 최대 2개까지 선택 가능합니다.
          </strong>
        ) : (
          <strong className="w-full h-8 block text-xl leading-8 text-primary-4 mb-4">
            상대하려는 포켓몬의 타입을 선택해주세요!
          </strong>
        )}
      </header>
      <ul className="w-full flex flex-wrap items-center gap-2">
        {Object.entries(PokemonTypes).map(([types, typeName]) => {
          const isActive = selectTypeList.includes(types as PokemonType)
          const isDisabled =
            selectTypeList.length === 2 &&
            selectTypeList.indexOf(types as PokemonType) < 0
          return (
            <li key={`pokemon-type-key-${types}`} className="min-w-16 h-12">
              <button
                type="button"
                value={types}
                className={`groupt w-full h-12 border-0 rounded-2xl bg-primary-4 flex justify-center items-center gap-2 px-3 pl-3 pr-4 disabled:grayscale ${isActive ? 'opacity-100' : 'opacity-60'}`}
                disabled={isDisabled}
                onClick={handleClickType}
              >
                <ImageComponent
                  alt={`${typeName} 타입 필터 선택`}
                  height="1.5rem"
                  width="1.5rem"
                  src={`/assets/type/${types.toLowerCase()}.svg`}
                />
                <p className="h-8 text-base text-aligned-base text-[#333333] group-disabled:text-[#8b8b8b]">
                  {typeName}
                </p>
              </button>
            </li>
          )
        })}
        <li className="min-w-16 h-12">
          <button
            type="button"
            className="group w-full h-12 border-0 rounded-2xl bg-primary-4 flex justify-center items-center text-center px-4 opacity-75 disabled:grayscale"
            disabled={selectTypeList.length === 0}
            onClick={handleClickResetType}
          >
            <p className="text-sm text-[#333333] group-disabled:text-[#8b8b8b]">
              초기화
            </p>
          </button>
        </li>
      </ul>
    </section>
  )
}

export default TypeEffectivenessCaculatorComponent
