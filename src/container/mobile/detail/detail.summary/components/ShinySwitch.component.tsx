import Link from 'next/link'
import { useRouter } from 'next/router'
import ShinyIcon from '~/assets/icons/sparkle.svg'

const ShinySwitchComponent = () => {
  const router = useRouter()

  const isShiny = router.query.shinyMode === 'shiny' ? true : false

  const switchHref = {
    query: {
      ...router.query,
      shinyMode: isShiny ? 'normal' : 'shiny',
    },
  }

  return (
    <li>
      <Link
        href={switchHref}
        className={`w-26 h-8 flex items-center justify-center px-2 rounded-2xl bg-primary-4 opacity-65 active:bg-primary-3 ${isShiny ? 'opacity-100' : ''}`}
        aria-label="이로치 상태 변환"
        replace
      >
        <i className={`w-8 h-8 flex-shrink-0 block ${isShiny ? '[&>svg]:fill-[#f5b62e]' : '[&>svg]:fill-transparent'}`} aria-hidden>
          <ShinyIcon />
        </i>
        <span className="h-8 flex-shrink-0 text-base leading-[calc(2rem+2px)] font-normal text-black px-1">
          이로치
        </span>
      </Link>
    </li>
  )
}

export default ShinySwitchComponent
