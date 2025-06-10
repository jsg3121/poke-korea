import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import ImageComponent from '~/components/Image.component'

const MegaSwitch = () => {
  const routerQuery = useSearchParams()

  const isMega = routerQuery.get('activeType') === 'mega' ? true : false
  const currentQuery = Object.fromEntries(routerQuery.entries())

  const megaHref = {
    query: {
      ...currentQuery,
      activeType: isMega ? 'normal' : 'mega',
    },
  }

  return (
    <li
      className={`relative -left-11 transition-[left] duration-200 ease-out hover:-left-28 ${
        isMega ? '-left-28' : ''
      }`}
    >
      <Link
        href={megaHref}
        className="w-32 h-8 flex items-center justify-center gap-1 px-4 pl-2 rounded-l-full bg-primary-4 cursor-pointer active:text-[#333333] active:bg-primary-3"
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
            src="/assets/icons/mega.webp"
          />
        </i>
        <span
          className={`h-8 text-base font-normal leading-[calc(2rem+2px)] flex-shrink-0 ${
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
