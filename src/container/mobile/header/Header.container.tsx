'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoIcon from '~/assets/logo.svg'
import ChampionsSubNavMobile from '~/components/champions/ChampionsSubNavMobile.component'
import HeaderSearchContainer from './header.search/HeaderSearchContainer'

const HeaderContainer = () => {
  const pathname = usePathname()

  return (
    <>
      <header className="h-16 bg-primary-2 flex-between px-5 sticky top-0 z-[500]">
        <Link href="/" aria-label="메인 화면으로 돌아가기" className="w-32 block">
          <i className="w-full h-full block icon-logo-link">
            <LogoIcon />
          </i>
          <p className="sr-only">메인 화면으로 돌아가기</p>
        </Link>
        <HeaderSearchContainer key={`search-key-${pathname}`} />
      </header>
      {pathname.includes('/champions') && <ChampionsSubNavMobile />}
    </>
  )
}

export default HeaderContainer
