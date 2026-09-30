'use client'

import { useContext } from 'react'
import Link from 'next/link'

import { PokemonTypes } from '~/types/pokemonTypes.types'
import { buildTypeDetailPath } from '~/modules/typeParams.module'
import { TypeEffectivenessContext } from '~/context/TypeEffectiveness.context'

const TypeEffectivenessCta = () => {
  const { selectTypeList } = useContext(TypeEffectivenessContext)

  if (selectTypeList.length === 0) return null

  const isSingleTypeSelected = selectTypeList.length === 1
  const singleTypeValue = selectTypeList[0]
  const singleTypeLabel =
    isSingleTypeSelected && singleTypeValue ? PokemonTypes[singleTypeValue] : ''

  const CTA_LINK_CLASS =
    'flex h-full items-center justify-between rounded-2xl bg-primary-1 px-5 py-3 desktop:py-4 text-base text-primary-4 transition-colors hover:bg-primary-3 hover:text-primary-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-4'

  return (
    <section
      aria-labelledby="type-effectiveness-cta-heading"
      className="mt-6 w-full rounded-2xl bg-primary-2 p-4 desktop:mt-8 desktop:p-6"
    >
      <h3
        id="type-effectiveness-cta-heading"
        className="mb-4 text-lg desktop:text-xl font-bold text-primary-4"
      >
        다음에는 어떤 걸 해볼까요?
      </h3>
      <ul className="grid grid-cols-1 gap-3 desktop:grid-cols-2 desktop:gap-4">
        {selectTypeList.map((type) => (
          <li key={`type-detail-${type}`}>
            <Link href={buildTypeDetailPath(type)} className={CTA_LINK_CLASS}>
              <span>{PokemonTypes[type]} 타입 약점과 상성 자세히 보기</span>
              <span aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
        {isSingleTypeSelected && (
          <li>
            <Link
              href={`/list?type=${singleTypeValue}`}
              className={CTA_LINK_CLASS}
            >
              <span>{singleTypeLabel} 타입 포켓몬 도감 보기</span>
              <span aria-hidden="true">→</span>
            </Link>
          </li>
        )}
        <li>
          <Link href="/champions/list" className={CTA_LINK_CLASS}>
            <span>포켓몬 챔피언스 도감 보기</span>
            <span aria-hidden="true">→</span>
          </Link>
        </li>
        <li>
          <Link href="/quiz/type-effectiveness" className={CTA_LINK_CLASS}>
            <span>타입 상성 퀴즈 도전</span>
            <span aria-hidden="true">→</span>
          </Link>
        </li>
      </ul>
    </section>
  )
}

export default TypeEffectivenessCta
