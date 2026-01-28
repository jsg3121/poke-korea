import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useContext } from 'react'
import ImageComponent from '~/components/Image.component'
import { DetailContext } from '~/context/Detail.context'

const GigantamaxSwitch = () => {
  const { pokemonBaseInfo, activeType } = useContext(DetailContext)
  const routerQuery = useSearchParams()

  const isGigantamax = activeType === 'gigantamax'
  const isShiny = routerQuery.get('shinyMode') === 'shiny'
  const shinyQuery = isShiny ? '?shinyMode=shiny' : ''

  const gigantamaxHref = isGigantamax
    ? `/detail/${pokemonBaseInfo?.number}${shinyQuery}`
    : `/detail/${pokemonBaseInfo?.number}/gigantamax${shinyQuery}`

  return (
    <li
      className={`relative -left-11 transition-[left] duration-200 ease-out hover:-left-28 ${
        isGigantamax ? '-left-28' : ''
      }`}
    >
      <Link
        href={gigantamaxHref}
        className="w-32 h-8 flex-center gap-1 px-4 pl-2 rounded-l-full bg-primary-4 cursor-pointer active:text-[#333333] active:bg-primary-3"
        aria-label="거다이맥스 모습 변환 스위치"
        replace
      >
        <i
          className={`w-[1.625rem] h-[1.625rem] flex-shrink-0 block ${
            isGigantamax ? 'grayscale-0' : 'grayscale'
          }`}
          aria-hidden
        >
          <ImageComponent
            alt="거다이맥스 보기"
            height="1.625rem"
            width="1.625rem"
            imageSize={{ width: 26, height: 26 }}
            src="/assets/icons/gigantamax.webp"
          />
        </i>
        <span
          className={`h-8 text-base font-normal text-aligned-base flex-shrink-0 ${
            isGigantamax ? 'text-[#333333]' : 'text-[#888888]'
          }`}
        >
          거다이맥스
        </span>
      </Link>
    </li>
  )
}

export default GigantamaxSwitch
