import Link from 'next/link'
import styled from 'styled-components'
import LogoIcon from '~/assets/logo.svg'
import HeaderSearchContainer from './header.search/HeaderSearchContainer'
import HeaderHamburgerNavigation from './header.hamburgerNavigation/HeaderHamburgerNavigation'
import { useRouter } from 'next/router'

const HeaderContainer = () => {
  const router = useRouter()

  return (
    <Header>
      <Link href="/" aria-label="메인 화면으로 돌아가기">
        <i className="icon-logo-link">
          <LogoIcon />
        </i>
      </Link>
      <HeaderSearchContainer key={`search-key-${router.asPath}`} />
      <HeaderHamburgerNavigation />
    </Header>
  )
}

export default HeaderContainer

const Header = styled.header`
  height: 4rem;
  background-color: var(--color-primary-2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  position: sticky;
  top: 0;
  z-index: 500;

  & > a {
    width: 8rem;
    display: block;

    & > i {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
`
