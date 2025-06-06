import Link from 'next/link'
import { useRouter } from 'next/router'
import RegionIcon from '~/assets/icons/region.svg'

const RegionSwitch = () => {
  const router = useRouter()

  const isRegion = router.query.activeType === 'region' ? true : false

  const regionHref = {
    query: {
      ...router.query,
      activeType: isRegion ? 'normal' : 'region',
    },
  }

  return (
    <li
      className={`relative -left-11 transition-[left] duration-200 ease-out hover:-left-28 ${isRegion && '-left-28'}`}
    >
      <Link
        href={regionHref}
        className="w-28 h-8 flex items-center justify-center gap-1 px-4 pl-2 rounded-l-full bg-primary-4 cursor-pointer active:text-[#333333] active:bg-primary-3"
        aria-label="리전폼 변환 스위치"
        replace
      >
        <i className="icon-region w-8 h-8 flex-shrink-0 block" aria-hidden>
          <RegionIcon className={isRegion ? 'grayscale-0' : 'grayscale'} />
        </i>
        <span
          className={`h-8 text-base font-normal leading-[calc(2rem+2px)] ${isRegion ? 'text-[#333333]' : 'text-[#888888]'}`}
        >
          리전폼
        </span>
      </Link>
    </li>
  )
}

export default RegionSwitch
