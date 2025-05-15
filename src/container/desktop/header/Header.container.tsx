import Link from 'next/link'
import styled from 'styled-components'
import LogoIcon from '~/assets/logo.svg'

const HeaderContainer = () => {
  return (
    <Header>
      <Link href="/">
        <i className="icon-logo-link">
          <LogoIcon />
        </i>
      </Link>
    </Header>
  )
}

export default HeaderContainer

const Header = styled.header`
  height: 5rem;
  background-color: var(--color-primary-2);
  display: flex;
  align-items: center;
  padding: 0 2rem;

  & > a {
    width: 15rem;
    height: 3rem;
    display: block;
  }
`
