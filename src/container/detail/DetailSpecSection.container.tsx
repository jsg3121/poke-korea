'use client'

import { useContext } from 'react'
import { DetailContext } from '~/context/Detail.context'
import { useEnterViewProgress } from '~/hook/useEnterViewProgress'
import {
  CAPTURE_RATE_MAX,
  UNKNOWN_LABEL,
  formatGenderPercent,
  formatHeight,
  formatNumber,
  formatWeight,
  getCaptureRatePercent,
  parseGenderRate,
} from '~/module/pokemonSpec.module'
import InfoCardTitleComponent from './components/InfoCardTitle.component'
import {
  CaptureRateGaugeComponent,
  GenderBarComponent,
} from './components/SpecGauge.component'
import { getActiveFormInfo } from './modules/activeForm.module'

/**
 * 기본 제원 카드 2장 — 신체 정보 / 육성·포획 정보 (1.58.0).
 *
 * 기존 "기본 정보"(이름·도감번호·세대·타입)는 검색·식별용 메타라 성격이 달라
 * 그대로 두고, 생태·수치 정보를 별도 카드로 분리했다.
 *
 * 두 카드가 **grid wrapper 없이** section만 내보내는 이유: 기본정보·특성과
 * 함께 하나의 2×2 grid에 배치돼야 열 정렬이 맞기 때문이다. 조립은
 * DetailInfoSection이 하며, 순서는 기본정보 → 신체정보 → 특성 → 육성·포획이다.
 */

const infoRowClass =
  'w-full min-h-9 desktop:min-h-12 border-b border-primary-3 border-solid flex flex-wrap items-center gap-2 py-1.5 desktop:py-2 last:border-b-0 last:pb-0'

const termClass =
  'dl-term h-6 w-24 text-xs leading-6 desktop:h-10 desktop:w-48 desktop:text-base desktop:leading-[calc(2.5rem+2px)]'

const descClass =
  'dl-desc h-6 text-xs leading-6 desktop:h-10 desktop:text-base desktop:leading-[calc(2.5rem+2px)]'

/** 텍스트+게이지 2단 행은 dl-desc의 고정 높이를 풀어야 한다 */
const descAutoClass =
  'dl-desc h-auto min-h-6 flex-col !items-start gap-1 text-xs leading-6 desktop:min-h-10 desktop:text-base desktop:leading-[calc(2.5rem+2px)]'

/** 주 값 뒤 보조 표기(분모·환산값) — 주 값보다 한 단계 작고 옅게 */
const subValueClass = 'text-2xs font-normal text-primary-2 desktop:text-sm'

/**
 * 신체 정보 카드 — 분류·키·몸무게 + 전설/환상 배지.
 * 키·몸무게는 폼마다 값이 다르므로 스탯과 같은 기준(getActiveFormInfo)으로
 * 활성 폼 값을 선택한다.
 */
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

  // 전설·환상은 상호 배타적이며(실측 전수 확인), false인 종이 대다수라
  // "아니오" 행을 만들지 않고 해당할 때만 배지로 노출한다.
  const rarityBadge = isLegendary
    ? '전설의 포켓몬'
    : isMythical
      ? '환상의 포켓몬'
      : undefined

  return (
    <section aria-labelledby="pokemon-body-spec" className="card-detail">
      <InfoCardTitleComponent
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

/**
 * 육성·포획 정보 카드 — 포획률·성비·알그룹·부화·친밀도·경험치.
 * 폼과 무관한 종(species) 단위 값이라 활성 폼 선택이 필요 없다.
 */
export const DetailBreedingSpecSection = () => {
  const { pokemonBaseInfo } = useContext(DetailContext)
  // 게이지 2종(포획률·성비)이 카드 진입 시 함께 채워진다. 훅은 조건부 return
  // 앞에서 호출해야 렌더마다 호출 순서가 보장된다.
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
      <InfoCardTitleComponent
        title="육성·포획 정보"
        id="pokemon-breeding-spec"
      />
      <dl className="w-full">
        {/* 포획률: 성비와 같은 구조 — 데스크톱 가로(값·게이지), 모바일 2단.
              DOM은 텍스트(주) → 게이지(보조·aria-hidden) 순서를 유지한다. */}
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
                  <CaptureRateGaugeComponent
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

        {/* 성비: 데스크톱은 텍스트-막대-텍스트 가로 배치, 모바일은 텍스트 위 막대 아래.
              DOM 순서가 곧 시각 순서라 스크린리더도 "수컷 87.5% 암컷 12.5%"로 읽힌다. */}
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
                  <GenderBarComponent
                    male={genderRatio.male}
                    progress={progress}
                  />
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
                    className="h-5 rounded-lg bg-primary-2 px-2 text-2xs font-normal leading-5 text-primary-4 desktop:h-7 desktop:text-sm desktop:leading-7"
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
