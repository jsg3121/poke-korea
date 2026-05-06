'use client'
import Link from 'next/link'
import { useContext } from 'react'
import { TypeEffectivenessContext } from '~/context/TypeEffectiveness.context'
import { PokemonTypes } from '~/types/pokemonTypes.types'

const TypeEffectivenessCtaComponent = () => {
  const { selectTypeList } = useContext(TypeEffectivenessContext)

  if (selectTypeList.length === 0) return null

  const isSingleTypeSelected = selectTypeList.length === 1
  const singleTypeValue = selectTypeList[0]
  const singleTypeLabel = isSingleTypeSelected
    ? PokemonTypes[singleTypeValue]
    : ''

  return (
    <section
      aria-labelledby="type-effectiveness-cta-heading-mobile"
      className="w-full h-fit py-5 px-4 bg-primary-2 rounded-2xl my-8"
    >
      <h3
        id="type-effectiveness-cta-heading-mobile"
        className="w-full h-8 text-xl leading-8 text-left text-white mb-4"
      >
        다음에는 어떤 걸 해볼까요?
      </h3>
      <ul className="flex flex-col gap-3">
        {isSingleTypeSelected && (
          <li>
            <Link
              href={`/list?type=${singleTypeValue}`}
              className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-base text-primary-4 shadow-[1px_2px_6px_0_var(--color-primary-1)] transition-opacity active:opacity-70 focus-visible:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-4"
            >
              <span>{singleTypeLabel} 타입 포켓몬 도감 보기</span>
              <span aria-hidden="true">→</span>
            </Link>
          </li>
        )}
        <li>
          <Link
            href="/champions/list"
            className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-base text-primary-4 shadow-[1px_2px_6px_0_var(--color-primary-1)] transition-opacity active:opacity-70 focus-visible:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-4"
          >
            <span>포켓몬 챔피언스 도감 보기</span>
            <span aria-hidden="true">→</span>
          </Link>
        </li>
        <li>
          <Link
            href="/quiz/type-effectiveness"
            className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-base text-primary-4 shadow-[1px_2px_6px_0_var(--color-primary-1)] transition-opacity active:opacity-70 focus-visible:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-4"
          >
            <span>타입 상성 퀴즈 도전</span>
            <span aria-hidden="true">→</span>
          </Link>
        </li>
      </ul>
    </section>
  )
}

export default TypeEffectivenessCtaComponent
