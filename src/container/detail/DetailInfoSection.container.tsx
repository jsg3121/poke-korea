'use client'

import Link from 'next/link'
import { useContext } from 'react'
import TagComponent from '~/components/tag/Tag.component'
import { DetailContext } from '~/context/Detail.context'
import { PokemonTypes } from '~/types/pokemonTypes.types'
import DetailQuizCtaComponent from './components/DetailQuizCta.component'
import InfoCardTitleComponent from './components/InfoCardTitle.component'

/**
 * 기본 정보 + 특성 카드 (반응형 단일 — 기존 데/모 Description·AbilitiesInfo 이관).
 * 모바일 세로 스택 → 데스크톱 2컬럼(기존 데스크톱 배치 유지).
 *
 * 기본정보 행은 고정 h-12 대신 **min-h-12** — 애드센스 자동 광고가 본문에 링크
 * 유닛을 주입해도(UX-005 §6-2에서 확인) 행이 겹치지 않고 세로로 늘어난다.
 */

// 모바일은 폰트 축소에 맞춰 행 높이도 줄인다(min-h-9, QA 라운드 3 — 여백 과대)
const infoRowClass =
  'w-full min-h-9 desktop:min-h-12 border-b border-primary-3 border-solid flex flex-wrap items-center gap-2 py-1.5 desktop:py-2 last:border-b-0 last:pb-0'

const DetailInfoSectionContainer = () => {
  const { activeTypeInfo } = useContext(DetailContext)
  const { types, generation, name, pokemonNumber, activeType, abilities } =
    activeTypeInfo

  return (
    <div className="flex w-full flex-col gap-5 desktop:gap-8">
      <div className="grid w-full grid-cols-1 gap-5 desktop:grid-cols-2 desktop:items-start desktop:gap-8">
        <section aria-labelledby="pokemon-base-info" className="card-detail">
          <InfoCardTitleComponent title="기본 정보" id="pokemon-base-info" />
          <dl className="w-full">
            <div className={infoRowClass}>
              <dt className="dl-term h-6 w-24 text-xs leading-6 desktop:h-10 desktop:w-48 desktop:text-xl desktop:leading-[calc(2.5rem+2px)]">
                이름
              </dt>
              <dd className="dl-desc h-6 text-xs leading-6 desktop:h-10 desktop:text-xl desktop:leading-[calc(2.5rem+2px)]">
                {name}&nbsp;
                {activeType === 'mega'
                  ? '(메가진화)'
                  : activeType === 'region'
                    ? '(리전폼)'
                    : ''}
              </dd>
            </div>
            <div className={infoRowClass}>
              <dt className="dl-term h-6 w-24 text-xs leading-6 desktop:h-10 desktop:w-48 desktop:text-xl desktop:leading-[calc(2.5rem+2px)]">
                전국도감번호
              </dt>
              <dd className="dl-desc h-6 text-xs leading-6 desktop:h-10 desktop:text-xl desktop:leading-[calc(2.5rem+2px)]">
                No. {pokemonNumber.toString().padStart(3, '0')}
              </dd>
            </div>
            <div className={infoRowClass}>
              <dt className="dl-term h-6 w-24 text-xs leading-6 desktop:h-10 desktop:w-48 desktop:text-xl desktop:leading-[calc(2.5rem+2px)]">
                등장 세대
              </dt>
              <dd className="dl-desc h-6 text-xs leading-6 desktop:h-10 desktop:text-xl desktop:leading-[calc(2.5rem+2px)]">
                {generation} 세대
              </dd>
            </div>
            <div className={infoRowClass}>
              <dt className="dl-term h-6 w-24 text-xs leading-6 desktop:h-10 desktop:w-48 desktop:text-xl desktop:leading-[calc(2.5rem+2px)]">
                타입
              </dt>
              <dd
                aria-label={types.map((type) => PokemonTypes[type]).join(',')}
                className="dl-desc flex h-6 gap-1 text-xs leading-6 desktop:h-10 desktop:text-xl desktop:leading-[calc(2.5rem+2px)]"
              >
                {types.map((type) => (
                  <TagComponent key={type} type={type} />
                ))}
              </dd>
            </div>
          </dl>
        </section>

        <section className="card-detail" aria-labelledby="pokemon-abilities">
          <InfoCardTitleComponent title="특성" id="pokemon-abilities" />
          <dl className="flex w-full flex-col gap-2 desktop:gap-4">
            {abilities.map((ability, index) => (
              <div
                key={`ability-id-${index}`}
                className="w-full border-b border-solid border-primary-3 py-1.5 last:border-b-0 last:pb-0 desktop:py-2"
              >
                <dt className="relative w-full pb-2 text-sm font-bold leading-6 desktop:text-xl">
                  {ability.name}&nbsp;
                  {ability.isHidden && (
                    <span className="text-xs font-normal">(숨겨진 특성)</span>
                  )}
                  <Link
                    href={`/ability/${ability.abilityId}`}
                    className="absolute right-0 text-xs text-primary-1 underline underline-offset-4"
                  >
                    특성 정보 보러가기
                  </Link>
                </dt>
                <dd className="min-h-6 w-full text-xs leading-6 desktop:text-base">
                  {ability.description}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      {/* 특성 직후 맥락 배치 — 퀴즈 유입 확대(UX-005 §6-3) */}
      <DetailQuizCtaComponent
        title="특성 퀴즈에 도전해보세요!"
        description="다양한 포켓몬의 특성을 얼마나 알고 있나요?"
        href="/quiz/ability"
      />
    </div>
  )
}

export default DetailInfoSectionContainer
