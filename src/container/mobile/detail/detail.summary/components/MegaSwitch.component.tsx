import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ImageComponent from '~/components/Image.component'

const MegaSwitchComponent = () => {
  const router = useRouter()
  const isMega = router.query.activeType === 'mega' ? true : false

  const megaHref = {
    query: {
      ...router.query,
      activeType: isMega ? 'normal' : 'mega',
    },
  }

  return (
    <li>
      <Link
        href={megaHref}
        className={`w-32 h-8 flex items-center justify-around px-2 rounded-2xl bg-primary-4 opacity-65 active:text-[#333333] active:bg-primary-3 ${
          isMega ? 'opacity-100' : ''
        }`}
        aria-label="메가진화 모습 변환 스위치"
        replace
      >
        <i
          className={`w-[1.625rem] h-[1.625rem] flex-shrink-0 block ${
            isMega ? 'grayscale-0' : 'grayscale'
          }`}
        >
          <ImageComponent
            alt="메가진화 보기"
            height="1.625rem"
            width="1.625rem"
            src="/assets/icons/mega.webp"
          />
        </i>
        <span className="h-8 text-base font-normal leading-[calc(2rem+2px)] text-black flex-shrink-0">
          메가진화
        </span>
      </Link>
    </li>
  )
}

export default MegaSwitchComponent
