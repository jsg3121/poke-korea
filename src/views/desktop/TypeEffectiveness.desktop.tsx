import Link from 'next/link'
import styled from 'styled-components'
import LogoIcon from '~/assets/logo.svg'

const TypeEffectivenessDesktop = () => {
  return (
    <Main>
      <header>
        <Link href="/">
          <i className="icon-logo-link">
            <LogoIcon />
          </i>
        </Link>
      </header>
      <section></section>
    </Main>
  )
}

export default TypeEffectivenessDesktop

const Main = styled.main`
  width: 100%;
  min-height: 100vh;

  & > header {
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
  }

  & > section {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    position: relative;
  }
`
