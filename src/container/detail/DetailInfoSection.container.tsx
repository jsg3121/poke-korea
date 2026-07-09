'use client'

import Link from 'next/link'
import { useContext } from 'react'
import TagComponent from '~/components/tag/Tag.component'
import { DetailContext } from '~/context/Detail.context'
import { PokemonTypes } from '~/types/pokemonTypes.types'
import InfoCardTitleComponent from './components/InfoCardTitle.component'

/**
 * 기본 정보 + 특성 카드 (반응형 단일 — 기존 데/모 Description·AbilitiesInfo 이관).
 * 모바일 세로 스택 → 데스크톱 2컬럼(기존 데스크톱 배치 유지).
 *
 * 기본정보 행은 고정 h-12 대신 **min-h-12** — 애드센스 자동 광고가 본문에 링크
 * 유닛을 주입해도(UX-005 §6-2에서 확인) 행이 겹치지 않고 세로로 늘어난다.
 */

const infoRowClass =
  'w-full min-h-12 border-b border-primary-3 border-solid flex flex-wrap items-center gap-2 py-2 last:border-b-0 last:pb-0'

const DetailInfoSectionContainer = () => {
  const { activeTypeInfo } = useContext(DetailContext)
  const {
    types,
    generation,
    isEvolution,
    name,
    pokemonNumber,
    activeType,
    isMega,
    isRegion,
    abilities,
  } = activeTypeInfo

  return (
    <div className="grid w-full grid-cols-1 gap-8 desktop:grid-cols-2 desktop:items-start">
      <section aria-labelledby="pokemon-base-info" className="card-detail">
        <InfoCardTitleComponent title="기본 정보" id="pokemon-base-info" />
        <dl className="w-full">
          <div className={infoRowClass}>
            <dt className="dl-term">이름</dt>
            <dd className="dl-desc">
              {name}&nbsp;
              {activeType === 'mega'
                ? '(메가진화)'
                : activeType === 'region'
                  ? '(리전폼)'
                  : ''}
            </dd>
          </div>
          <div className={infoRowClass}>
            <dt className="dl-term">전국도감번호</dt>
            <dd className="dl-desc">
              No. {pokemonNumber.toString().padStart(3, '0')}
            </dd>
          </div>
          <div className={infoRowClass}>
            <dt className="dl-term">등장 세대</dt>
            <dd className="dl-desc">{generation} 세대</dd>
          </div>
          <div className={infoRowClass}>
            <dt className="dl-term">타입</dt>
            <dd
              aria-label={types.map((type) => PokemonTypes[type]).join(',')}
              className="dl-desc flex gap-1"
            >
              {types.map((type) => (
                <TagComponent key={type} type={type} />
              ))}
            </dd>
          </div>
          <div className={infoRowClass}>
            <dt className="dl-term">진화체</dt>
            <dd className="dl-desc">
              {isEvolution ? '진화체 있음' : '진화 불가'}
            </dd>
          </div>
          {isRegion && (
            <div className={infoRowClass}>
              <dt className="dl-term">리전폼</dt>
              <dd className="dl-desc">리전폼 존재</dd>
            </div>
          )}
          {isMega && (
            <div className={infoRowClass}>
              <dt className="dl-term">메가진화</dt>
              <dd className="dl-desc">메가진화 가능</dd>
            </div>
          )}
        </dl>
      </section>

      <section className="card-detail" aria-labelledby="pokemon-abilities">
        <InfoCardTitleComponent title="특성" id="pokemon-abilities" />
        <dl className="flex w-full flex-col gap-4">
          {abilities.map((ability, index) => (
            <div
              key={`ability-id-${index}`}
              className="w-full border-b border-solid border-primary-3 py-2 last:border-b-0 last:pb-0"
            >
              <dt className="relative w-full pb-2 text-xl font-bold leading-6">
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
              <dd className="min-h-6 w-full text-base leading-6">
                {ability.description}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}

export default DetailInfoSectionContainer
