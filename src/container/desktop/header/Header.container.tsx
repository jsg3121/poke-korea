'use client'

import LogoIcon from '~/assets/logo.svg'
import MainSearch from './search.main/MainSearch'
import HeaderNav from './nav/HeaderNav'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import FilterComponents from './filter/Filter.components'
import DetailSearch from './header.search/DetailSearch'

const HeaderContainer = () => {
  const pathname = usePathname()

  return (
    <header
      className={`w-full min-h-40 bg-primary-2 fixed left-0 top-0 z-20 pt-6`}
    >
      <div className="w-full max-w-[1280px] h-12 mx-auto px-5 relative">
        {(pathname === '/' || pathname === '/list') && (
          <h1 className="sr-only">포켓몬의 모든 정보 Poke Korea</h1>
        )}
        <Link
          href="/"
          className="w-56 h-12 block"
          aria-label="포켓몬의 모든 정보 Poke Korea"
        >
          <LogoIcon />
        </Link>
        {pathname === '/list' ? <MainSearch /> : <DetailSearch />}
      </div>
      <HeaderNav />
      {pathname === '/list' && <FilterComponents />}
    </header>
  )
}

export default HeaderContainer
