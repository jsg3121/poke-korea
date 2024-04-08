import { FC } from 'react'
import styled from 'styled-components'
import { DetailBaseInfo } from '~/container/src/detail'
import { IFDetailPokemonInfo } from '~/types/detailInfo.types'

const DetailViews: FC<IFDetailPokemonInfo> = (props) => {
  const { pokemonBaseInfo } = props
  return (
    <Main>
      <header></header>
      <div className="pokemon-detail-content">
        <DetailBaseInfo info={pokemonBaseInfo} />
        <div className="pokemon-others">추가 정보들</div>
        <div className="pokemon-status">스탯</div>
      </div>
    </Main>
  )
}

export default DetailViews

const Main = styled.main`
  width: 100%;
  min-height: 100vh;

  & > header {
    height: 5rem;
    background-color: white;
  }

  & > .pokemon-detail-content {
    max-width: 1280px;
    margin: 0 auto;
  }
`
