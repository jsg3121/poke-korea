'use client'

import { useContext } from 'react'
import Link from 'next/link'

import { PokemonTypes } from '~/types/pokemonTypes.types'
import { TYPE_ORDER } from '~/constants/typeEffectivenessChart'
import { PokemonType } from '~/graphql/typeGenerated'
import { buildTypeDetailPath, buildTypeSlug } from '~/modules/typeParams.module'
import { TypeEffectivenessContext } from '~/context/TypeEffectiveness.context'
import Image from '~/components/Image.component'

const QUICK_LINK_TYPES: ReadonlyArray<PokemonType> = TYPE_ORDER.map(
  (label) =>
    Object.values(PokemonType).find(
      (type) => PokemonTypes[type] === label,
    ) as PokemonType,
)

const TypeQuickLinks = () => {
  const { selectTypeList } = useContext(TypeEffectivenessContext)

  if (selectTypeList.length > 0) return null

  return (
    <section
      aria-labelledby="type-quick-links-heading"
      className="w-full pt-5 desktop:pt-6"
    >
      <h3
        id="type-quick-links-heading"
        className="text-base font-bold leading-tight text-primary-4 desktop:text-lg"
      >
        타입별 약점 바로 보기
      </h3>
      <p className="mt-1 text-sm text-primary-3">
        타입을 고르지 않아도 각 타입의 약점과 상성을 자세히 확인할 수 있어요.
      </p>
      <ul className="mt-3 grid grid-cols-3 gap-1.5 desktop:grid-cols-6 desktop:gap-2">
        {QUICK_LINK_TYPES.map((type) => (
          <li key={type}>
            <Link
              href={buildTypeDetailPath(type)}
              aria-label={`${PokemonTypes[type]} 타입 약점과 상성 보기`}
              className="flex min-h-touch w-full min-w-0 items-center justify-center gap-1 whitespace-nowrap rounded-lg border border-solid border-primary-2 px-1.5 py-1.5 text-sm font-semibold text-primary-3 transition-colors hover:border-primary-4 hover:bg-primary-2 hover:text-primary-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-4 desktop:gap-1.5 desktop:px-2"
            >
              <span className="block h-3.5 w-3.5 shrink-0 desktop:h-5 desktop:w-5">
                <Image
                  alt=""
                  aria-hidden="true"
                  src={`/assets/type/${buildTypeSlug(type)}.svg`}
                  width="100%"
                  height="100%"
                  imageSize={{ width: 20, height: 20 }}
                />
              </span>
              {PokemonTypes[type]}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default TypeQuickLinks
