import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useContext } from 'react'
import ImageComponent from '~/components/Image.component'
import { DetailContext } from '~/context/Detail.context'

const MegaSwitch = () => {
  const { pokemonBaseInfo, activeType } = useContext(DetailContext)
  const routerQuery = useSearchParams()

  const isMega = activeType === 'mega'
  const isShiny = routerQuery.get('shinyMode') === 'shiny'
  const shinyQuery = isShiny ? '?shinyMode=shiny' : ''

  const megaHref = isMega
    ? `/detail/${pokemonBaseInfo?.number}${shinyQuery}`
    : `/detail/${pokemonBaseInfo?.number}/mega${shinyQuery}`

  return (
    <li
      className={`relative -left-11 transition-[left] duration-200 ease-out hover:-left-28 ${
        isMega ? '-left-28' : ''
      }`}
    >
      <Link
        href={megaHref}
        className="w-32 h-8 flex-center gap-1 px-4 pl-2 rounded-l-full bg-primary-4 cursor-pointer active:text-[#333333] active:bg-primary-3"
        aria-label="메가진화 모습 변환 스위치"
        replace
      >
        <i
          className={`w-[1.625rem] h-[1.625rem] flex-shrink-0 block ${
            isMega ? 'grayscale-0' : 'grayscale'
          }`}
          aria-hidden
        >
          <ImageComponent
            alt="메가진화 보기"
            height="1.625rem"
            width="1.625rem"
            imageSize={{ width: 26, height: 26 }}
            src="/assets/icons/mega.webp"
          />
        </i>
        <span
          className={`h-8 text-base font-normal text-aligned-base flex-shrink-0 ${
            isMega ? 'text-[#333333]' : 'text-[#888888]'
          }`}
        >
          메가진화
        </span>
      </Link>
    </li>
  )
}

export default MegaSwitch
