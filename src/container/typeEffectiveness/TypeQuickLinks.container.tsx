'use client'

import Link from 'next/link'
import { useContext } from 'react'
import ImageComponent from '~/components/Image.component'
import { TypeEffectivenessContext } from '~/context/TypeEffectiveness.context'
import { PokemonType } from '~/graphql/typeGenerated'
import { buildTypeDetailPath, buildTypeSlug } from '~/module/typeParams.module'
import { PokemonTypes } from '~/types/pokemonTypes.types'

/**
 * 타입 미선택 시 노출하는 타입 상세 바로가기.
 *
 * ## 왜 이 자리인가
 *
 * 타입을 고르기 전에는 결과 영역이 통째로 비어 있다(`TypeCalculatorResult`는
 * sr-only 알림만 남기고 아무것도 렌더하지 않는다). 계산기 → 광고 → **빈 공간**
 * → 상성표 순이라, 정보형 사용자는 폴드 근처에서 다음 행동을 찾지 못한다.
 *
 * 이 죽은 공간을 채우면 세 가지가 동시에 해결된다.
 * 1. 하위 페이지 링크가 **폴드에서 가장 가까운 위치**에 놓인다
 * 2. 계산기를 쓰지 않는 사용자에게 즉시 다음 행동을 제공한다
 * 3. 타입을 고르는 순간 사라지므로 **계산기 사용자에게 방해가 0**이다
 *
 * 기존 요소를 하나도 건드리지 않아 리스크가 가장 낮은 내부 링크 진입점이다.
 *
 * ## 노출 타입 선정
 *
 * Search Console에서 노출 감소가 컸던 검색어 순으로 고른다(spec §26.8.4) —
 * `악타입 약점`(-83.7%)·`독타입 약점`(-77.5%)·`격투 약점`(-82.6%)·
 * `물타입 약점`(-79.2%)·`전기 약점`(-87.0%)·`페어리 타입 약점`(-86.1%).
 * 잃은 검색 의도를 하위 페이지로 되받는 것이 이 트랙의 목적이므로, 노출이
 * 많이 빠진 타입을 앞에 둔다.
 */

/** 검색 노출 손실이 컸던 순서(§26.8.4). 6개만 노출해 계산기를 밀어내지 않는다. */
const QUICK_LINK_TYPES: ReadonlyArray<PokemonType> = [
  PokemonType.DARK,
  PokemonType.POISON,
  PokemonType.FIGHTING,
  PokemonType.WATER,
  PokemonType.ELECTRIC,
  PokemonType.FAIRY,
]

const TypeQuickLinksContainer = () => {
  const { selectTypeList } = useContext(TypeEffectivenessContext)

  // 타입을 고르면 결과가 이 자리를 차지하므로 물러난다.
  if (selectTypeList.length > 0) return null

  return (
    <section
      aria-labelledby="type-quick-links-heading"
      className="w-full pt-6 desktop:pt-8"
    >
      <h2
        id="type-quick-links-heading"
        className="text-xl font-semibold leading-tight text-primary-4 desktop:text-3xl"
      >
        타입별 약점 바로 보기
      </h2>
      <p className="mt-2 text-base text-primary-4/80">
        타입을 고르지 않아도 각 타입의 약점과 상성을 자세히 확인할 수 있어요.
      </p>
      <ul className="mt-4 grid grid-cols-2 gap-2 desktop:grid-cols-6 desktop:gap-3">
        {QUICK_LINK_TYPES.map((type) => (
          <li key={type}>
            <Link
              href={buildTypeDetailPath(type)}
              aria-label={`${PokemonTypes[type]} 타입 약점과 상성 보기`}
              className="flex min-h-touch items-center justify-between gap-2 rounded-2xl border border-solid border-primary-3 px-3 py-2 text-base font-semibold text-primary-4 transition-colors hover:border-primary-4 hover:bg-primary-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-4"
            >
              <span className="flex items-center gap-2">
                <span className="block h-5 w-5 shrink-0 drop-shadow-[1px_2px_0px_var(--color-black-1)] desktop:h-6 desktop:w-6">
                  <ImageComponent
                    alt=""
                    aria-hidden="true"
                    src={`/assets/type/${buildTypeSlug(type)}.svg`}
                    width="100%"
                    height="100%"
                    imageSize={{ width: 24, height: 24 }}
                  />
                </span>
                {PokemonTypes[type]}
              </span>
              <span aria-hidden="true" className="text-primary-3">
                ›
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default TypeQuickLinksContainer
