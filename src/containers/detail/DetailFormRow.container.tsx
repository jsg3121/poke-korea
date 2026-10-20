'use client'

import { ReactNode, useContext } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import RegionIcon from '~/assets/icons/region.svg'
import ShinyIcon from '~/assets/icons/sparkle.svg'
import { DetailContext } from '~/context/Detail.context'
import Ball from '~/components/ball/Ball.component'
import ShinyRate from '~/components/detail.summary/summary.shinyRate/ShinyRate.component'
import ShinyTooltip from '~/components/detail.summary/summary.shinyTooltip/ShinyTooltip.component'

import DetailWebpFormIcon from './DetailWebpFormIcon.component'
import { getFormBasePath } from './modules/activeForm.module'
import { formLinkClass } from './utils/detailFormLink.util'

const DetailFormRow = () => {
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
          <Ball />
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
        <DetailWebpFormIcon
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
        <DetailWebpFormIcon
          src="/assets/icons/gmax.webp"
          alt="거다이맥스 아이콘"
          active={activeType === 'gigantamax'}
        />
      ),
    },
  ].filter((chip) => chip.show)

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
            <ShinyTooltip />
            <ShinyRate />
          </div>
        </div>
      )}
    </section>
  )
}

export default DetailFormRow
