'use client'

import { useContext } from 'react'

import {
  CAPTURE_RATE_MAX,
  formatGenderPercent,
  formatNumber,
  getCaptureRatePercent,
  parseGenderRate,
  UNKNOWN_LABEL,
} from '~/modules/pokemonSpec.module'
import { useEnterViewProgress } from '~/hooks/useEnterViewProgress'
import { DetailContext } from '~/context/Detail.context'

import CaptureRateGauge from './components/CaptureRateGauge.component'
import GenderBar from './components/GenderBar.component'
import InfoCardTitle from './components/InfoCardTitle.component'
import {
  DESC_CLASS,
  INFO_ROW_CLASS,
  TERM_CLASS,
} from './shared/detailSpec.constants'

const descAutoClass =
  'dl-desc h-auto min-h-6 flex-col !items-start gap-1 text-xs leading-6 desktop:min-h-10 desktop:text-base desktop:leading-[calc(2.5rem+2px)]'

const subValueClass = 'text-2xs font-normal text-primary-2 desktop:text-sm'

const DetailBreedingSpecSection = () => {
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
        <div className={INFO_ROW_CLASS}>
          <dt className={TERM_CLASS}>포획률</dt>
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

        <div className={INFO_ROW_CLASS}>
          <dt className={TERM_CLASS}>기초 친밀도</dt>
          <dd className={DESC_CLASS}>{formatNumber(baseHappiness)}</dd>
        </div>

        <div className={INFO_ROW_CLASS}>
          <dt className={TERM_CLASS}>성비</dt>
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

        <div className={INFO_ROW_CLASS}>
          <dt className={TERM_CLASS}>알 그룹</dt>
          <dd className={`${DESC_CLASS} flex-wrap gap-1`}>
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

        <div className={INFO_ROW_CLASS}>
          <dt className={TERM_CLASS}>부화 카운트</dt>
          <dd className={DESC_CLASS}>{formatNumber(hatchCounter)}</dd>
        </div>

        <div className={INFO_ROW_CLASS}>
          <dt className={TERM_CLASS}>Lv.100 총 경험치</dt>
          <dd className={DESC_CLASS}>{formatNumber(maxExperience)}</dd>
        </div>
      </dl>
    </section>
  )
}

export default DetailBreedingSpecSection
