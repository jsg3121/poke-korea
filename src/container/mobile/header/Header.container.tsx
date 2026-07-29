'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoIcon from '~/assets/logo.svg'
import ChampionsSubNavOrganism from '~/components/champions/ChampionsSubNav.organism'
import HeaderSearchContainer from './header.search/HeaderSearchContainer'
import ListSearchContainer from './header.search/ListSearchContainer'

const HeaderContainer = () => {
  const pathname = usePathname()

  return (
    <>
      {/* gap-3 + 검색영역 flex-1: 로고(w-32 고정)+검색(w-2/3)이 좁은 화면에서 가용
          폭을 초과해 간격 없이 겹치던 문제 — 검색이 남는 폭만 차지하게 한다 */}
      <header className="h-12 bg-primary-2 flex-between gap-3 px-4 sticky top-0 z-[500]">
        <Link
          href="/"
          aria-label="메인 화면으로 돌아가기"
          className="w-24 shrink-0 block"
        >
          <i className="w-full h-full block icon-logo-link">
            <LogoIcon />
          </i>
          <p className="sr-only">메인 화면으로 돌아가기</p>
        </Link>
        {/* 검색 동작 분기(셸은 동일): /list는 리스트 필터(?name=), 그 외는
            드롭다운→상세 이동 — 데스크톱 MainSearch/DetailSearch 패턴과 일치 */}
        {pathname === '/list' ? (
          <ListSearchContainer />
        ) : (
          <HeaderSearchContainer key={`search-key-${pathname}`} />
        )}
      </header>
      {pathname.includes('/champions') && <ChampionsSubNavOrganism />}
    </>
  )
}

export default HeaderContainer
