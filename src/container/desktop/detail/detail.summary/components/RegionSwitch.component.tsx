import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useContext } from 'react'
import RegionIcon from '~/assets/icons/region.svg'
import { DetailContext } from '~/context/Detail.context'

const RegionSwitch = () => {
  const { pokemonBaseInfo, activeType } = useContext(DetailContext)
  const routerQuery = useSearchParams()

  const isRegion = activeType === 'region'
  const isShiny = routerQuery.get('shinyMode') === 'shiny'
  const shinyQuery = isShiny ? '?shinyMode=shiny' : ''

  const regionHref = isRegion
    ? `/detail/${pokemonBaseInfo?.number}${shinyQuery}`
    : `/detail/${pokemonBaseInfo?.number}/region${shinyQuery}`

  return (
    <li
      className={`relative -left-11 transition-[left] duration-200 ease-out hover:-left-28 ${isRegion && '-left-28'}`}
    >
      <Link
        href={regionHref}
        className="w-28 h-8 flex-center gap-1 px-4 pl-2 rounded-l-full bg-primary-4 cursor-pointer active:text-[#333333] active:bg-primary-3"
        aria-label="리전폼 변환 스위치"
        replace
      >
        <i className="icon-region w-8 h-8 flex-shrink-0 block" aria-hidden>
          <RegionIcon className={isRegion ? 'grayscale-0' : 'grayscale'} />
        </i>
        <span
          className={`h-8 text-base font-normal text-aligned-base ${isRegion ? 'text-[#333333]' : 'text-[#888888]'}`}
        >
          리전폼
        </span>
      </Link>
    </li>
  )
}

export default RegionSwitch
