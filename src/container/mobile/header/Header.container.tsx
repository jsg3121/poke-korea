import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoIcon from '~/assets/logo.svg'
import HeaderHamburgerNavigation from './header.hamburgerNavigation/HeaderHamburgerNavigation'
import HeaderSearchContainer from './header.search/HeaderSearchContainer'

const HeaderContainer = () => {
  const pathname = usePathname()

  return (
    <header className="h-16 bg-primary-2 flex items-center justify-between px-5 sticky top-0 z-[500]">
      <Link href="/" aria-label="메인 화면으로 돌아가기" className="w-32 block">
        <i className="w-full h-full block icon-logo-link">
          <LogoIcon />
        </i>
        <p className="visually-hidden">메인 화면으로 돌아가기</p>
      </Link>
      <HeaderSearchContainer key={`search-key-${pathname}`} />
      <HeaderHamburgerNavigation />
    </header>
  )
}

export default HeaderContainer
