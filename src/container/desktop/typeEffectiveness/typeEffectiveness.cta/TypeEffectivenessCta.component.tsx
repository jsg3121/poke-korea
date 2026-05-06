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
      aria-labelledby="type-effectiveness-cta-heading"
      className="w-full h-fit py-8 px-4 bg-primary-2 rounded-2xl my-8"
    >
      <h3
        id="type-effectiveness-cta-heading"
        className="w-full h-8 text-[1.75rem] leading-8 text-left text-primary-4 mb-6"
      >
        다음에는 어떤 걸 해볼까요?
      </h3>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isSingleTypeSelected && (
          <li>
            <Link
              href={`/list?type=${singleTypeValue}`}
              className="flex h-full items-center justify-between rounded-2xl bg-white px-5 py-4 text-base text-primary-4 shadow-[1px_2px_6px_0_var(--color-primary-1)] transition-opacity hover:opacity-80 focus-visible:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-4"
            >
              <span>{singleTypeLabel} 타입 포켓몬 도감 보기</span>
              <span aria-hidden="true">→</span>
            </Link>
          </li>
        )}
        <li>
          <Link
            href="/champions/list"
            className="flex h-full items-center justify-between rounded-2xl bg-white px-5 py-4 text-base text-primary-4 shadow-[1px_2px_6px_0_var(--color-primary-1)] transition-opacity hover:opacity-80 focus-visible:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-4"
          >
            <span>포켓몬 챔피언스 도감 보기</span>
            <span aria-hidden="true">→</span>
          </Link>
        </li>
        <li className={isSingleTypeSelected ? '' : 'md:col-span-2'}>
          <Link
            href="/quiz/type-effectiveness"
            className="flex h-full items-center justify-between rounded-2xl bg-white px-5 py-4 text-base text-primary-4 shadow-[1px_2px_6px_0_var(--color-primary-1)] transition-opacity hover:opacity-80 focus-visible:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-4"
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
