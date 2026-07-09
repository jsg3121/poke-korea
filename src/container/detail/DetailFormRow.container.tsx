'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useContext } from 'react'
import { getChipClass } from '~/components/chip/chipStyle'
import ShinyRateComponent from '~/components/detail.summary/summary.shinyRate/ShinyRate.component'
import ShinyTooltipComponent from '~/components/detail.summary/summary.shinyTooltip/ShinyTooltip.component'
import { DetailContext } from '~/context/Detail.context'
import { getFormUrl, getImageList } from '~/module/image.module'
import { getFormBasePath } from './modules/activeForm.module'

/**
 * 폼 전환 로우 (반응형 단일 — UX-005 §7-5). 히어로 **외부의 독립 로우**로,
 * 데/모가 동일한 "상시 라벨 칩"이다 — 기존 데스크톱의 hover 슬라이드(아이콘만
 * 노출→hover 시 라벨)가 스탯 카드를 침범하던 C1 결함과 데/모 UI 불일치(M1)를
 * 함께 해소한다. 칩은 Chip 원자 규격(getChipClass)을 Link에 조립 — 폼 전환이
 * 클릭 액션이 아니라 경로 이동이기 때문(이로치는 쿼리 토글).
 *
 * 노말폼이 여러 개인 종(리자몽 외형 등)은 칩 나열 대신 ◀/▶ + "n/N" 카운터의
 * 슬라이드로 폼 인덱스를 순회한다(기존 히어로 양옆 Prev/NextFormButton 역할 승계).
 * 칩 그룹 간격은 24px(gap-6) — clickable 칩의 터치 타깃 전제(chipStyle).
 */

const DetailFormRowContainer = () => {
  const {
    pokemonBaseInfo,
    megaEvolutions,
    regionFormInfo,
    gigantamaxInfo,
    activeType,
    activeIndex,
    normalFormImageList,
  } = useContext(DetailContext)
  const routerQuery = useSearchParams()
  const isShiny = routerQuery.get('shinyMode') === 'shiny'
  const shinyQuery = isShiny ? '?shinyMode=shiny' : ''
  const pokemonNumber = pokemonBaseInfo?.number ?? 0

  const basePath = getFormBasePath({ pokemonNumber, activeType, activeIndex })

  const formChips = [
    {
      key: 'normal',
      label: '기본',
      active: activeType === 'normal',
      href: `/detail/${pokemonNumber}${shinyQuery}`,
      show: activeType !== 'normal',
    },
    {
      key: 'mega',
      label: '메가진화',
      active: activeType === 'mega',
      href: `/detail/${pokemonNumber}/mega${shinyQuery}`,
      show: !!pokemonBaseInfo?.isMegaEvolution,
    },
    {
      key: 'region',
      label: '리전폼',
      active: activeType === 'region',
      href: `/detail/${pokemonNumber}/region${shinyQuery}`,
      show: !!pokemonBaseInfo?.isRegionForm,
    },
    {
      key: 'gigantamax',
      label: '거다이맥스',
      active: activeType === 'gigantamax',
      href: `/detail/${pokemonNumber}/gigantamax${shinyQuery}`,
      show: !!pokemonBaseInfo?.isGigantamax,
    },
  ].filter((chip) => chip.show)

  // 이로치는 폼이 아니라 현재 폼 위 토글 — 활성 상태만 공유하고 경로는 유지한다
  const shinyHref = isShiny ? basePath : `${basePath}?shinyMode=shiny`

  const imageList = getImageList({
    activeType,
    normalFormImageList,
    megaEvolutions,
    regionFormInfo,
    gigantamaxInfo,
    name: pokemonBaseInfo?.name ?? '',
    types: pokemonBaseInfo?.types,
    pokemonNumber,
  })
  const totalForms = imageList?.length ?? 0
  const hasPrev = activeIndex > 0
  const hasNext = activeIndex < totalForms - 1

  const slideLinkClass =
    'flex min-h-touch min-w-touch items-center justify-center rounded-2xl text-lg text-primary-4 hover:bg-primary-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-4'

  return (
    <section
      aria-label="포켓몬 모습 전환"
      className="w-full px-4 desktop:mx-auto desktop:max-w-7xl"
    >
      <ul
        className="flex flex-wrap items-center gap-6"
        aria-label="모습 전환 목록"
      >
        <li>
          <Link
            href={shinyHref}
            replace
            className={getChipClass({ clickable: true, active: isShiny })}
            aria-pressed={isShiny}
          >
            이로치
          </Link>
        </li>
        {formChips.map((chip) => (
          <li key={chip.key}>
            <Link
              href={chip.href}
              replace
              className={getChipClass({ clickable: true, active: chip.active })}
              aria-current={chip.active ? 'page' : undefined}
            >
              {chip.label}
            </Link>
          </li>
        ))}
        {totalForms > 1 && (
          <li className="ml-auto">
            <div
              className="flex items-center gap-1"
              aria-label="폼 이미지 순회"
            >
              {hasPrev ? (
                <Link
                  href={getFormUrl({
                    activeIndex: activeIndex - 1,
                    pokemonNumber,
                    activeType,
                    isShiny,
                  })}
                  replace
                  className={slideLinkClass}
                  aria-label={`이전 폼: ${imageList?.[activeIndex - 1]?.name ?? ''}`}
                >
                  <span aria-hidden="true">◀</span>
                </Link>
              ) : (
                <span
                  className={`${slideLinkClass} opacity-30`}
                  aria-hidden="true"
                >
                  ◀
                </span>
              )}
              <span className="text-sm font-semibold text-primary-4">
                {activeIndex + 1}/{totalForms}
              </span>
              {hasNext ? (
                <Link
                  href={getFormUrl({
                    activeIndex: activeIndex + 1,
                    pokemonNumber,
                    activeType,
                    isShiny,
                  })}
                  replace
                  className={slideLinkClass}
                  aria-label={`다음 폼: ${imageList?.[activeIndex + 1]?.name ?? ''}`}
                >
                  <span aria-hidden="true">▶</span>
                </Link>
              ) : (
                <span
                  className={`${slideLinkClass} opacity-30`}
                  aria-hidden="true"
                >
                  ▶
                </span>
              )}
            </div>
          </li>
        )}
      </ul>
      {isShiny && (
        <div className="mt-3">
          <p className="text-xs text-primary-3">
            ※ 일부 포켓몬은 이로치 이미지가 아직 적용되지 않았으며,
            <br /> 확인되는 대로 업데이트될 예정입니다.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <ShinyTooltipComponent />
            <ShinyRateComponent />
          </div>
        </div>
      )}
    </section>
  )
}

export default DetailFormRowContainer
