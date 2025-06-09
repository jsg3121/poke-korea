import Link from 'next/link'
import { useRouter } from 'next/navigation'
import RegionIcon from '~/assets/icons/region.svg'

const RegionSwitchComponent = () => {
  const router = useRouter()

  const isRegion = router.query.activeType === 'region' ? true : false

  const regionHref = {
    query: {
      ...router.query,
      activeType: isRegion ? 'normal' : 'region',
    },
  }

  return (
    <li role="button">
      <Link
        href={regionHref}
        className={`w-26 h-8 flex items-center justify-center px-2 rounded-2xl bg-primary-4 opacity-65 active:text-[#333333] active:bg-primary-3 ${isRegion ? 'opacity-100' : ''}`}
        aria-label="리전폼 변환 스위치"
        replace
      >
        <i
          className={`w-8 h-8 flex-shrink-0 block ${isRegion ? '[&>svg]:grayscale-0' : '[&>svg]:grayscale'}`}
        >
          <RegionIcon />
        </i>
        <span className="h-8 text-base font-normal leading-[calc(2rem+2px)] text-black flex-shrink-0 px-1">
          리전폼
        </span>
      </Link>
    </li>
  )
}

export default RegionSwitchComponent
