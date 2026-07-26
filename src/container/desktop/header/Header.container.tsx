'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import FeedbackIcon from '~/assets/icons/feedback.svg'
import LogoIcon from '~/assets/logo.svg'
import ChampionsSubNavOrganism from '~/components/champions/ChampionsSubNav.organism'
import DetailSearch from './header.search/DetailSearch'
import HeaderNav from './nav/HeaderNav'
import MainSearch from './search.main/MainSearch'

const HeaderContainer = () => {
  const pathname = usePathname()

  return (
    <header
      className={`w-full min-h-28 bg-primary-2 fixed left-0 top-0 z-50 pt-3`}
    >
      <div className="w-full max-w-[1280px] h-12 mx-auto px-5 relative z-20">
        {/* /list의 h1·필터는 리스트 뷰가 소유한다(개편 — 헤더 높이 가변 원인 제거) */}
        <Link
          href="/"
          className="w-56 h-12 block"
          aria-label="포켓몬의 모든 정보 Poke Korea"
        >
          <LogoIcon />
        </Link>
        {pathname === '/list' ? <MainSearch /> : <DetailSearch />}
        <Link
          href="https://forms.gle/BP9QVkj42xTJ5beQ8"
          target="_blank"
          className="h-8 text-primary-4 absolute right-5 top-1/2 -translate-y-1/2 bg-primary-1 px-2 rounded-md flex-items-gap-2"
        >
          <FeedbackIcon width={16} height={16} />
          <span className="text-base mt-1">기능/오류 신고</span>
        </Link>
      </div>
      <HeaderNav />
      {pathname.includes('/champions') && <ChampionsSubNavOrganism />}
    </header>
  )
}

export default HeaderContainer
