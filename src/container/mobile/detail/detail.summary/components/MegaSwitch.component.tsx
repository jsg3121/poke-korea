import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useContext } from 'react'
import ImageComponent from '~/components/Image.component'
import { DetailContext } from '~/context/Detail.context'

const MegaSwitchComponent = () => {
  const { pokemonBaseInfo, activeType } = useContext(DetailContext)
  const routerQuery = useSearchParams()

  const isMega = activeType === 'mega'
  const isShiny = routerQuery.get('shinyMode') === 'shiny'
  const shinyQuery = isShiny ? '?shinyMode=shiny' : ''

  const megaHref = isMega
    ? `/detail/${pokemonBaseInfo?.number}${shinyQuery}`
    : `/detail/${pokemonBaseInfo?.number}/mega${shinyQuery}`
  return (
    <li>
      <Link
        href={megaHref}
        className={`w-32 h-8 flex items-center justify-around px-2 rounded-2xl bg-primary-4 active:text-[#333333] active:bg-primary-3 ${
          isMega ? 'opacity-100' : 'opacity-65'
        }`}
        aria-label="메가진화 모습 변환 스위치"
        replace
      >
        <i
          className={`w-[1.625rem] h-[1.625rem] flex-shrink-0 block will-change-[filter] ${
            isMega ? 'grayscale-0' : 'grayscale'
          }`}
        >
          <ImageComponent
            alt="메가진화 보기"
            height="1.625rem"
            width="1.625rem"
            imageSize={{ width: 20, height: 20 }}
            src="/assets/icons/mega.webp"
          />
        </i>
        <span className="h-8 text-base font-normal text-aligned-base text-black flex-shrink-0">
          메가진화
        </span>
      </Link>
    </li>
  )
}

export default MegaSwitchComponent
