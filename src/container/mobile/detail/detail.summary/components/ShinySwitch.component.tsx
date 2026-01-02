import Link from 'next/link'
import ShinyIcon from '~/assets/icons/sparkle.svg'

interface ShinySwitchComponentProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

const ShinySwitchComponent = ({ searchParams }: ShinySwitchComponentProps) => {
  const isShiny = searchParams.shinyMode === 'shiny'

  const switchHref = {
    query: {
      ...searchParams,
      shinyMode: isShiny ? 'normal' : 'shiny',
    },
  }
  return (
    <li>
      <Link
        href={switchHref}
        className={`w-26 h-8 flex items-center justify-center px-2 rounded-2xl bg-primary-4 active:bg-primary-3 ${isShiny ? 'opacity-100' : 'opacity-65'}`}
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
