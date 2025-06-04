import Link from 'next/link'
import styled from 'styled-components'
import GithubIcon from '~/assets/icons/github.svg'
import GmailIcon from '~/assets/icons/gmail.svg'
import LogoIcon from '~/assets/logo.svg'
import HeaderSearchContainer from './header.search/HeaderSearchContainer'

const HeaderContainer = () => {
  return (
    <Header>
      <Link href="/">
        <i className="icon-logo-link">
          <LogoIcon />
        </i>
      </Link>
      <div className="search-creater-wrapper">
        <HeaderSearchContainer />
        <a href="https://github.com/jsg3121" target="_blank" rel="noreferrer">
          <GithubIcon />
          GitHub 프로필
        </a>
        <a href="mailto:xodm95@gmail.com">
          <GmailIcon />
          Gmail
        </a>
      </div>
      <nav>
        <ul>
          <li>
            <Link href="/">홈 화면</Link>
          </li>
          <li>
            <Link href="/type-effectiveness">상성 계산기</Link>
          </li>
        </ul>
      </nav>
    </Header>
  )
}

export default HeaderContainer

const Header = styled.header`
  height: 7.5rem;
  background-color: var(--color-primary-2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 500;

  & > a {
    width: 14rem;
    height: 2rem;
    display: block;
    margin-left: 2rem;
  }

  & > .search-creater-wrapper {
    width: 32rem;
    height: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-right: 2rem;

    & > a {
      width: 2rem;
      height: 2rem;
      font-size: 0;
    }
  }

  & > nav {
    width: 100vw;
    height: 3rem;
    flex-shrink: 0;
    align-self: flex-end;
    background-color: var(--color-primary-3);
    padding: 0 2rem;

    & > ul {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      flex-direction: row;
      gap: 1rem;

      & > li {
        min-width: fit-content;
        height: 100%;
        padding: 0 1rem;

        & > a {
          width: 100%;
          height: 3rem;
          font-size: 1rem;
          line-height: calc(3rem + 2px);
          color: var(--color-primary-1);
        }
      }
    }
  }
`
