import Link from 'next/link'
import { useRouter } from 'next/router'
import ShinyIcon from '~/assets/icons/sparkle.svg'

const ShinySwitch = () => {
  const router = useRouter()

  const isShiny = router.query.shinyMode === 'shiny' ? true : false

  const switchHref = {
    query: {
      ...router.query,
      shinyMode: isShiny ? 'normal' : 'shiny',
    },
  }

  return (
    <li
      className={`relative -left-11 transition-[left] duration-200 ease-out hover:-left-28 ${isShiny ? '-left-28' : ''}`}
    >
      <Link
        href={switchHref}
        className="w-28 h-8 flex items-center justify-center gap-1 px-4 pl-2 rounded-l-full bg-primary-4 cursor-pointer active:text-[#333333] active:bg-primary-3"
        aria-label="이로치 상태 변환"
        replace
      >
        <i className="icon-shiny w-8 h-8 flex-shrink-0 block" aria-hidden>
          <ShinyIcon
            className={isShiny ? 'fill-[#f5b62e]' : 'fill-transparent'}
          />
        </i>
        <span
          className={`h-8 text-base font-normal leading-[calc(2rem+2px)] ${isShiny ? 'text-[#333333]' : 'text-[#888888]'}`}
        >
          이로치
        </span>
      </Link>
    </li>
  )
}

export default ShinySwitch
