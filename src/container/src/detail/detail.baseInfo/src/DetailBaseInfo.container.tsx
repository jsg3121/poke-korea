import React from 'react'
import styled from 'styled-components'
import { DetailContext } from '~/context/src/Detail.context'
import { Description } from './baseInfo.description'
import { Abilities } from './baseInfo.abilities'
import { TypesInfo } from './basInfo.typesInfo'
import { RelationPokemon } from './baseinfo.relationPokemon'

const DetailBaseInfoContainer: React.FC = () => {
  const { pokemonBaseInfo } = React.useContext(DetailContext)

  if (!pokemonBaseInfo) return <></> // TODO : 에러 페이지 및 잘못된 페이지로 처리하기

  return (
    <Div>
      <Description />
      <Abilities />
      <TypesInfo type={pokemonBaseInfo.type} />
      {pokemonBaseInfo.evolutionId.length > 0 && (
        <RelationPokemon
          name={pokemonBaseInfo.name}
          evolutionId={pokemonBaseInfo.evolutionId}
        />
      )}
    </Div>
  )
}

export default DetailBaseInfoContainer

const Div = styled.div`
  width: 100%;
  max-width: 1320px;
  height: 48rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 21rem 21rem;
  gap: 2rem;
  padding: 2rem 20px;
  margin: 0 auto;

  /* @media screen and (max-width: 1080px) {
    grid-template-columns: 1fr;
    grid-template-rows: 40rem 22rem 20rem;
  } */
`
