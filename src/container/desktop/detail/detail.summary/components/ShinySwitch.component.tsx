'use client'

import Link from 'next/link'
import { useContext } from 'react'
import ShinyIcon from '~/assets/icons/sparkle.svg'
import { DetailContext } from '~/context/Detail.context'

interface ShinySwitchProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

const ShinySwitch = ({ searchParams }: ShinySwitchProps) => {
  const { pokemonBaseInfo, activeType, activeIndex } = useContext(DetailContext)
  const isShiny = searchParams.shinyMode === 'shiny'

  const getBasePath = () => {
    const baseUrl = `/detail/${pokemonBaseInfo?.number}`
    if (activeType === 'mega') {
      return activeIndex > 0
        ? `${baseUrl}/mega/${activeIndex}`
        : `${baseUrl}/mega`
    }
    if (activeType === 'region') {
      return activeIndex > 0
        ? `${baseUrl}/region/${activeIndex}`
        : `${baseUrl}/region`
    }
    return baseUrl
  }

  const switchHref = isShiny
    ? getBasePath()
    : `${getBasePath()}?shinyMode=shiny`

  return (
    <li
      className={`relative -left-11 transition-[left] duration-200 ease-out hover:-left-28 ${isShiny ? '-left-28' : ''}`}
    >
      <Link
        href={switchHref}
        className="w-28 h-8 flex-center gap-1 px-4 pl-2 rounded-l-full bg-primary-4 cursor-pointer active:text-[#333333] active:bg-primary-3"
        aria-label="이로치 상태 변환"
        replace
      >
        <i className="icon-shiny w-8 h-8 flex-shrink-0 block" aria-hidden>
          <ShinyIcon
            className={isShiny ? 'fill-[#f5b62e]' : 'fill-transparent'}
          />
        </i>
        <span
          className={`h-8 text-base font-normal text-aligned-base ${isShiny ? 'text-[#333333]' : 'text-[#888888]'}`}
        >
          이로치
        </span>
      </Link>
    </li>
  )
}

export default ShinySwitch
