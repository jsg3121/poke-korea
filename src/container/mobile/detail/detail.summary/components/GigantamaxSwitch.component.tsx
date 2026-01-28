import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useContext } from 'react'
import ImageComponent from '~/components/Image.component'
import { DetailContext } from '~/context/Detail.context'

const GigantamaxSwitchComponent = () => {
  const { pokemonBaseInfo, activeType } = useContext(DetailContext)
  const routerQuery = useSearchParams()

  const isGigantamax = activeType === 'gigantamax'
  const isShiny = routerQuery.get('shinyMode') === 'shiny'
  const shinyQuery = isShiny ? '?shinyMode=shiny' : ''

  const gigantamaxHref = isGigantamax
    ? `/detail/${pokemonBaseInfo?.number}${shinyQuery}`
    : `/detail/${pokemonBaseInfo?.number}/gigantamax${shinyQuery}`

  return (
    <li>
      <Link
        href={gigantamaxHref}
        className={`w-32 h-8 flex items-center justify-around px-2 rounded-2xl bg-primary-4 active:text-[#333333] active:bg-primary-3 ${
          isGigantamax ? 'opacity-100' : 'opacity-65'
        }`}
        aria-label="거다이맥스 모습 변환 스위치"
        replace
      >
        <i
          className={`w-[1.625rem] h-[1.625rem] flex-shrink-0 block will-change-[filter] ${
            isGigantamax ? 'grayscale-0' : 'grayscale'
          }`}
        >
          <ImageComponent
            alt="거다이맥스 보기"
            height="1.625rem"
            width="1.625rem"
            imageSize={{ width: 20, height: 20 }}
            src="/assets/icons/gigantamax.webp"
          />
        </i>
        <span className="h-8 text-base font-normal text-aligned-base text-black flex-shrink-0">
          거다이맥스
        </span>
      </Link>
    </li>
  )
}

export default GigantamaxSwitchComponent
