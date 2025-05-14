import Link from 'next/link'
import styled from 'styled-components'
import LogoIcon from '~/assets/logo.svg'
import FooterContainer from '~/container/desktop/footer/Footer.container'
import TypeEffectivenessContainer from '~/container/desktop/typeEffectiveness/TypeEffectiveness.container'

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
      <section aria-labelledby="pokemon-type-effectiveness-calculator">
        <h1
          id="pokemon-type-effectiveness-calculator"
          className="visually-hidden"
        >
          타입 상성 계산기
        </h1>
        <TypeEffectivenessContainer />
      </section>
      <FooterContainer />
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
    max-width: 1280px;
    height: 100%;
    padding: 0 20px;
    margin: 0 auto;
    position: relative;

    & > h1 {
      width: 100%;
      height: 3rem;
      font-size: 2.5rem;
      text-align: center;
      line-height: 3rem;
      color: var(--color-primary-4);
    }
  }
`
