'use client'

import { usePathname } from 'next/navigation'

import LogoIcon from '~/assets/logo.svg'
import ChampionsSubNav from '~/components/champions/ChampionsSubNav.component'
import IntentLink from '~/components/link/IntentLink.component'

import HeaderSearch from './header.search/HeaderSearch.container'
import ListSearch from './header.search/ListSearch.container'

const Header = () => {
  const pathname = usePathname()

  return (
    <>
      <header className="h-12 bg-primary-2 flex-between gap-3 px-4 sticky top-0 z-[500]">
        <IntentLink
          href="/"
          aria-label="메인 화면으로 돌아가기"
          className="w-24 shrink-0 block"
        >
          <i className="w-full h-full block icon-logo-link">
            <LogoIcon />
          </i>
          <p className="sr-only">메인 화면으로 돌아가기</p>
        </IntentLink>
        {pathname === '/list' ? <ListSearch /> : <HeaderSearch />}
      </header>
      {pathname.includes('/champions') && <ChampionsSubNav />}
    </>
  )
}

export default Header
