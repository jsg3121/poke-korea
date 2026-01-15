import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useContext } from 'react'
import RegionIcon from '~/assets/icons/region.svg'
import { DetailContext } from '~/context/Detail.context'

const RegionSwitchComponent = () => {
  const { pokemonBaseInfo, activeType } = useContext(DetailContext)
  const routerQuery = useSearchParams()

  const isRegion = activeType === 'region'
  const isShiny = routerQuery.get('shinyMode') === 'shiny'
  const shinyQuery = isShiny ? '?shinyMode=shiny' : ''

  const regionHref = isRegion
    ? `/detail/${pokemonBaseInfo?.number}${shinyQuery}`
    : `/detail/${pokemonBaseInfo?.number}/region${shinyQuery}`

  return (
    <li role="button">
      <Link
        href={regionHref}
        className={`w-26 h-8 flex-center px-2 rounded-2xl bg-primary-4 active:text-[#333333] active:bg-primary-3 ${isRegion ? 'opacity-100' : 'opacity-65'}`}
        aria-label="리전폼 변환 스위치"
        replace
      >
        <i
          className={`w-8 h-8 flex-shrink-0 block will-change-[filter] ${isRegion ? '[&>svg]:grayscale-0' : '[&>svg]:grayscale'}`}
        >
          <RegionIcon />
        </i>
        <span className="h-8 text-base font-normal text-aligned-base text-black flex-shrink-0 px-1">
          리전폼
        </span>
      </Link>
    </li>
  )
}

export default RegionSwitchComponent
