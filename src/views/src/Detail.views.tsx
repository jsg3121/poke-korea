import Link from 'next/link'
import { FC } from 'react'
import styled from 'styled-components'
import LogoIcon from '~/assets/logo.svg'

import { DetailBaseInfo } from '~/container/src/detail'
import { IFDetailPokemonInfo } from '~/types/detailInfo.types'

const DetailViews: FC<IFDetailPokemonInfo> = (props) => {
  const { pokemonBaseInfo } = props
  return (
    <Main>
      <header>
        <Link href="/">
          <i className="icon-logo-link">
            <LogoIcon />
          </i>
        </Link>
      </header>
      <section className="pokemon-detail-content">
        <DetailBaseInfo info={pokemonBaseInfo} />
      </section>
    </Main>
  )
}

export default DetailViews

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

  & > .pokemon-detail-content {
    width: 100%;
    height: 100%;
    gap: 1rem;
    padding: 0;
    margin: 0 auto;
    position: relative;

    &::before {
      content: '';
      width: 100%;
      height: 20rem;
      background-color: #ffffff;
      display: block;
    }
  }
`
