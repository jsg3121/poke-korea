'use client'

import Link from 'next/link'
import { useContext } from 'react'
import ShinyIcon from '~/assets/icons/sparkle.svg'
import { DetailContext } from '~/context/Detail.context'

interface ShinySwitchComponentProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

const ShinySwitchComponent = ({ searchParams }: ShinySwitchComponentProps) => {
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
    // 기본폼도 activeIndex > 0이면 Path 기반 URL 사용
    return activeIndex > 0 ? `${baseUrl}/form/${activeIndex}` : baseUrl
  }

  const switchHref = isShiny
    ? getBasePath()
    : `${getBasePath()}?shinyMode=shiny`
  return (
    <li>
      <Link
        href={switchHref}
        className={`w-26 h-8 flex-center px-2 rounded-2xl bg-primary-4 active:bg-primary-3 ${isShiny ? 'opacity-100' : 'opacity-65'}`}
        aria-label="이로치 상태 변환"
        replace
      >
        <i
          className={`w-8 h-8 flex-shrink-0 block will-change-[filter] ${isShiny ? '[&>svg]:fill-[#f5b62e]' : '[&>svg]:fill-transparent'}`}
          aria-hidden
        >
          <ShinyIcon />
        </i>
        <span className="h-8 flex-shrink-0 text-base text-aligned-base font-normal text-black px-1">
          이로치
        </span>
      </Link>
    </li>
  )
}

export default ShinySwitchComponent
