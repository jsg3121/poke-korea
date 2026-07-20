'use client'

import Link from 'next/link'
import { useContext } from 'react'
import { TypeEffectivenessContext } from '~/context/TypeEffectiveness.context'
import { PokemonTypes } from '~/types/pokemonTypes.types'

/**
 * 계산 결과 후속 CTA (반응형 단일 — UX-009). 구버전 데/모 2벌
 * TypeEffectivenessCta를 대체한다 — 구조·링크는 유지하고 임의값(text-[1.75rem])
 * 폰트만 토큰 정합, 그리드는 모바일 1열로 반응형 단일화한다.
 *
 * 단일 타입 선택 시에만 "해당 타입 도감 보기"가 추가된다(2개 조합은 도감
 * 리스트가 타입 2개 필터 URL을 지원하지만 조합 결과보다 개별 타입 탐색이
 * 자연스러워 구버전 동작 유지).
 */

const TypeEffectivenessCtaContainer = () => {
  const { selectTypeList } = useContext(TypeEffectivenessContext)

  if (selectTypeList.length === 0) return null

  const isSingleTypeSelected = selectTypeList.length === 1
  const singleTypeValue = selectTypeList[0]
  const singleTypeLabel = isSingleTypeSelected
    ? PokemonTypes[singleTypeValue]
    : ''

  const CTA_LINK_CLASS =
    'flex h-full items-center justify-between rounded-2xl bg-primary-1 px-5 py-4 text-base text-primary-4 transition-colors hover:bg-primary-3 hover:text-primary-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-4'

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

export default TypeEffectivenessCtaContainer
