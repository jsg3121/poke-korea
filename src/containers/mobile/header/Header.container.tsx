'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import LogoIcon from '~/assets/logo.svg'
import ChampionsSubNav from '~/components/champions/ChampionsSubNav.component'

import HeaderSearch from './header.search/HeaderSearch.container'
import ListSearch from './header.search/ListSearch.container'

const Header = () => {
  const pathname = usePathname()

  return (
    <>
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
        {pathname === '/list' ? (
          <ListSearch />
        ) : (
          <HeaderSearch key={`search-key-${pathname}`} />
        )}
      </header>
      {pathname.includes('/champions') && <ChampionsSubNav />}
    </>
  )
}

export default Header
