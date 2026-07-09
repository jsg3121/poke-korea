'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useContext } from 'react'
import { getChipClass } from '~/components/chip/chipStyle'
import ShinyRateComponent from '~/components/detail.summary/summary.shinyRate/ShinyRate.component'
import ShinyTooltipComponent from '~/components/detail.summary/summary.shinyTooltip/ShinyTooltip.component'
import { DetailContext } from '~/context/Detail.context'
import { getFormBasePath } from './modules/activeForm.module'

/**
 * 폼 전환 로우 (반응형 단일 — UX-005 §7-5). 히어로 **외부의 독립 로우**로,
 * 데/모가 동일한 "상시 라벨 칩"이다 — 기존 데스크톱의 hover 슬라이드(아이콘만
 * 노출→hover 시 라벨)가 스탯 카드를 침범하던 C1 결함과 데/모 UI 불일치(M1)를
 * 함께 해소한다. 칩은 Chip 원자 규격(getChipClass)을 Link에 조립 — 폼 전환이
 * 클릭 액션이 아니라 경로 이동이기 때문(이로치는 쿼리 토글).
 *
 * 폼 인덱스 슬라이드(◀ n/N ▶)는 DetailHero 하단 중앙 책임 — 이미지와 같은
 * 맥락에 붙어야 기능이 드러난다(QA 라운드 2). 칩 그룹 간격은 24px(gap-6) —
 * clickable 칩의 터치 타깃 전제(chipStyle).
 */

const DetailFormRowContainer = () => {
  const { pokemonBaseInfo, activeType, activeIndex } = useContext(DetailContext)
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
