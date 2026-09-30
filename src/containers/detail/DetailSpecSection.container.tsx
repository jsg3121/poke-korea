'use client'

import { useContext } from 'react'

import {
  CAPTURE_RATE_MAX,
  formatGenderPercent,
  formatHeight,
  formatNumber,
  formatWeight,
  getCaptureRatePercent,
  parseGenderRate,
  UNKNOWN_LABEL,
} from '~/modules/pokemonSpec.module'
import { useEnterViewProgress } from '~/hooks/useEnterViewProgress'
import { DetailContext } from '~/context/Detail.context'

import InfoCardTitle from './components/InfoCardTitle.component'
import { CaptureRateGauge, GenderBar } from './components/SpecGauge.component'
import { getActiveFormInfo } from './modules/activeForm.module'

const infoRowClass =
  'w-full min-h-9 desktop:min-h-12 border-b border-primary-3 border-solid flex flex-wrap items-center gap-2 py-1.5 desktop:py-2 last:border-b-0 last:pb-0'

const termClass =
  'dl-term h-6 w-24 text-xs leading-6 desktop:h-10 desktop:w-48 desktop:text-base desktop:leading-[calc(2.5rem+2px)]'

const descClass =
  'dl-desc h-6 text-xs leading-6 desktop:h-10 desktop:text-base desktop:leading-[calc(2.5rem+2px)]'

const descAutoClass =
  'dl-desc h-auto min-h-6 flex-col !items-start gap-1 text-xs leading-6 desktop:min-h-10 desktop:text-base desktop:leading-[calc(2.5rem+2px)]'

const subValueClass = 'text-2xs font-normal text-primary-2 desktop:text-sm'

export const DetailBodySpecSection = () => {
  const {
    pokemonBaseInfo,
    megaEvolutions,
    regionFormInfo,
    gigantamaxInfo,
    normalForm,
    activeType,
    activeIndex,
  } = useContext(DetailContext)

  if (!pokemonBaseInfo) return null

  const { height, weight } = getActiveFormInfo({
    pokemonBaseInfo,
    megaEvolutions,
    regionFormInfo,
    gigantamaxInfo,
    normalForm,
    activeType,
    activeIndex,
  })

  const { genus, isLegendary, isMythical } = pokemonBaseInfo

  const rarityBadge = isLegendary
    ? '전설의 포켓몬'
    : isMythical
      ? '환상의 포켓몬'
      : undefined

  return (
    <section aria-labelledby="pokemon-body-spec" className="card-detail">
      <InfoCardTitle
        title="신체 정보"
        id="pokemon-body-spec"
        badge={rarityBadge}
      />
      <dl className="w-full">
        <div className={infoRowClass}>
          <dt className={termClass}>분류</dt>
          <dd className={descClass}>{genus ?? UNKNOWN_LABEL}</dd>
        </div>
        <div className={infoRowClass}>
          <dt className={termClass}>키</dt>
          <dd className={descClass}>{formatHeight(height)}</dd>
        </div>
        <div className={infoRowClass}>
          <dt className={termClass}>몸무게</dt>
          <dd className={descClass}>{formatWeight(weight)}</dd>
        </div>
      </dl>
    </section>
  )
}

export const DetailBreedingSpecSection = () => {
  const { pokemonBaseInfo } = useContext(DetailContext)
  const { ref, progress } = useEnterViewProgress<HTMLElement>()

  if (!pokemonBaseInfo) return null

  const {
    captureRate,
    genderRate,
    hatchCounter,
    baseHappiness,
    maxExperience,
    eggGroups,
  } = pokemonBaseInfo

  const genderRatio = parseGenderRate(genderRate)

  return (
    <section
      ref={ref}
      aria-labelledby="pokemon-breeding-spec"
      className="card-detail"
    >
      <InfoCardTitle title="육성·포획 정보" id="pokemon-breeding-spec" />
      <dl className="w-full">
        <div className={infoRowClass}>
          <dt className={termClass}>포획률</dt>
          <dd className={descAutoClass}>
            {captureRate === null || captureRate === undefined ? (
              UNKNOWN_LABEL
            ) : (
              <div className="flex w-full flex-col gap-1 desktop:flex-row desktop:items-center desktop:gap-3">
                <span className="whitespace-nowrap font-semibold">
                  {captureRate}
                  <span
                    className={subValueClass}
                  >{` / ${CAPTURE_RATE_MAX}`}</span>
                </span>
                <div className="w-full desktop:min-w-24 desktop:flex-1">
                  <CaptureRateGauge
                    percent={getCaptureRatePercent(captureRate)}
                    progress={progress}
                  />
                </div>
              </div>
            )}
          </dd>
        </div>

        <div className={infoRowClass}>
          <dt className={termClass}>기초 친밀도</dt>
          <dd className={descClass}>{formatNumber(baseHappiness)}</dd>
        </div>

        <div className={infoRowClass}>
          <dt className={termClass}>성비</dt>
          <dd className={descAutoClass}>
            {!genderRatio ? (
              UNKNOWN_LABEL
            ) : genderRatio.isGenderless ? (
              <span className="font-semibold">성별 없음</span>
            ) : (
              <div className="flex w-full flex-col gap-1 desktop:flex-row desktop:items-center desktop:gap-3">
                <div className="flex items-center gap-3 desktop:contents">
                  <span className="flex items-baseline gap-1 whitespace-nowrap desktop:order-1">
                    <span className={subValueClass}>수컷</span>
                    <span className="font-semibold">
                      {formatGenderPercent(genderRatio.male)}
                    </span>
                  </span>
                  <span className="flex items-baseline gap-1 whitespace-nowrap desktop:order-3">
                    <span className={subValueClass}>암컷</span>
                    <span className="font-semibold">
                      {formatGenderPercent(genderRatio.female)}
                    </span>
                  </span>
                </div>
                <div className="w-full desktop:order-2 desktop:min-w-24 desktop:flex-1">
                  <GenderBar male={genderRatio.male} progress={progress} />
                </div>
              </div>
            )}
          </dd>
        </div>

        <div className={infoRowClass}>
          <dt className={termClass}>알 그룹</dt>
          <dd className={`${descClass} flex-wrap gap-1`}>
            {eggGroups.length === 0
              ? UNKNOWN_LABEL
              : eggGroups.map((group) => (
                  <span
                    key={group}
                    className="h-5 rounded-lg bg-primary-2 px-2 text-2xs font-normal leading-5 text-primary-4 desktop:h-7 desktop:text-sm desktop:leading-[calc(1.75rem+2px)]"
                  >
                    {group}
                  </span>
                ))}
          </dd>
        </div>

        <div className={infoRowClass}>
          <dt className={termClass}>부화 카운트</dt>
          <dd className={descClass}>{formatNumber(hatchCounter)}</dd>
        </div>

        <div className={infoRowClass}>
          <dt className={termClass}>Lv.100 총 경험치</dt>
          <dd className={descClass}>{formatNumber(maxExperience)}</dd>
        </div>
      </dl>
    </section>
  )
}
