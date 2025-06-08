import Link from 'next/link'
import LogoIcon from '~/assets/logo.svg'
import HeaderSearchContainer from './header.search/HeaderSearchContainer'
import HeaderHamburgerNavigation from './header.hamburgerNavigation/HeaderHamburgerNavigation'
import { useRouter } from 'next/router'

const HeaderContainer = () => {
  const router = useRouter()

  return (
    <header className="h-16 bg-primary-2 flex items-center justify-between px-5 sticky top-0 z-[500]">
      <Link href="/" aria-label="메인 화면으로 돌아가기" className="w-32 block">
        <i className="w-full h-full block icon-logo-link">
          <LogoIcon />
        </i>
      </Link>
      <HeaderSearchContainer key={`search-key-${router.asPath}`} />
      <HeaderHamburgerNavigation />
    </header>
  )
}

export default HeaderContainer
