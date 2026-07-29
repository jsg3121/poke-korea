'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ReactNode, useContext } from 'react'
import RegionIcon from '~/assets/icons/region.svg'
import ShinyIcon from '~/assets/icons/sparkle.svg'
import BallComponent from '~/components/ball/Ball.component'
import ShinyRateComponent from '~/components/detail.summary/summary.shinyRate/ShinyRate.component'
import ShinyTooltipComponent from '~/components/detail.summary/summary.shinyTooltip/ShinyTooltip.component'
import ImageComponent from '~/components/Image.component'
import { DetailContext } from '~/context/Detail.context'
import { getFormBasePath } from './modules/activeForm.module'

/**
 * 폼 전환 로우 (반응형 단일 — UX-005 §7-5). 히어로 **외부의 독립 로우**로,
 * 데/모가 동일한 "아이콘+상시 라벨 알약" 버튼이다 — 기존 데스크톱의 hover
 * 슬라이드(C1 결함)와 데/모 UI 불일치(M1)를 함께 해소하면서, 기존 스위치의
 * 시각 문법(밝은 알약 + 폼별 아이콘 + 비활성 grayscale/opacity)을 계승한다
 * (QA 라운드 3 — 텍스트 칩만으로는 가시성·식별성이 부족).
 *
 * 폼 인덱스 슬라이드(◀ n/N ▶)는 DetailHero 하단 중앙 책임. 버튼 높이 h-8
 * (32px, WCAG 2.5.8 AA 충족)이라 간격은 gap-3(12px)로 컴팩트하게 둔다.
 */

const formLinkClass = (active: boolean) =>
  `flex h-8 items-center gap-1 rounded-2xl bg-primary-4 px-3 text-xs font-semibold text-black-2 transition-opacity desktop:text-sm ${
    active
      ? 'opacity-100'
      : 'opacity-65 hover:opacity-100 focus-visible:opacity-100'
  } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-4`

/** webp 아이콘(메가·거다이) — 비활성은 grayscale로 톤 다운(기존 스위치 문법) */
const WebpFormIcon = ({
  src,
  alt,
  active,
}: {
  src: string
  alt: string
  active: boolean
}) => (
  <i
    className={`block h-5 w-5 shrink-0 will-change-[filter] ${active ? 'grayscale-0' : 'grayscale'}`}
  >
    <ImageComponent
      alt={alt}
      width="1.25rem"
      height="1.25rem"
      imageSize={{ width: 20, height: 20 }}
      src={src}
    />
  </i>
)

const DetailFormRowContainer = () => {
  const { pokemonBaseInfo, activeType, activeIndex } = useContext(DetailContext)
  const routerQuery = useSearchParams()
  const isShiny = routerQuery.get('shinyMode') === 'shiny'
  const shinyQuery = isShiny ? '?shinyMode=shiny' : ''
  const pokemonNumber = pokemonBaseInfo?.number ?? 0

  const basePath = getFormBasePath({ pokemonNumber, activeType, activeIndex })

  const formChips: Array<{
    key: string
    label: string
    active: boolean
    href: string
    show: boolean
    icon: ReactNode
  }> = [
    {
      key: 'normal',
      label: '기본',
      active: activeType === 'normal',
      href: `/detail/${pokemonNumber}${shinyQuery}`,
      show: activeType !== 'normal',
      icon: (
        <i className="block h-5 w-5 shrink-0">
          <BallComponent />
        </i>
      ),
    },
    {
      key: 'mega',
      label: '메가진화',
      active: activeType === 'mega',
      href: `/detail/${pokemonNumber}/mega${shinyQuery}`,
      show: !!pokemonBaseInfo?.isMegaEvolution,
      icon: (
        <WebpFormIcon
          src="/assets/icons/mega.webp"
          alt="메가진화 아이콘"
          active={activeType === 'mega'}
        />
      ),
    },
    {
      key: 'region',
      label: '리전폼',
      active: activeType === 'region',
      href: `/detail/${pokemonNumber}/region${shinyQuery}`,
      show: !!pokemonBaseInfo?.isRegionForm,
      icon: (
        <i
          className={`block h-5 w-5 shrink-0 [&>svg]:h-5 [&>svg]:w-5 ${activeType === 'region' ? '[&>svg]:grayscale-0' : '[&>svg]:grayscale'}`}
          aria-hidden="true"
        >
          <RegionIcon />
        </i>
      ),
    },
    {
      key: 'gigantamax',
      label: '거다이맥스',
      active: activeType === 'gigantamax',
      href: `/detail/${pokemonNumber}/gigantamax${shinyQuery}`,
      show: !!pokemonBaseInfo?.isGigantamax,
      icon: (
        <WebpFormIcon
          src="/assets/icons/gmax.webp"
          alt="거다이맥스 아이콘"
          active={activeType === 'gigantamax'}
        />
      ),
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
        className="flex flex-wrap items-center gap-3"
        aria-label="모습 전환 목록"
      >
        <li>
          <Link
            href={shinyHref}
            replace
            className={formLinkClass(isShiny)}
            aria-pressed={isShiny}
          >
            <i
              className={`block h-5 w-5 shrink-0 [&>svg]:h-5 [&>svg]:w-5 will-change-[filter] ${isShiny ? '[&>svg]:fill-[#f5b62e]' : '[&>svg]:fill-transparent'}`}
              aria-hidden="true"
            >
              <ShinyIcon />
            </i>
            이로치
          </Link>
        </li>
        {formChips.map((chip) => (
          <li key={chip.key}>
            <Link
              href={chip.href}
              replace
              className={formLinkClass(chip.active)}
              aria-current={chip.active ? 'page' : undefined}
            >
              {chip.icon}
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
