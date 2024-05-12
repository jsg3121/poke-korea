import React from 'react'
import { Pokemon } from '~/graphql/typeGenerated'
import { Abilities } from './baseInfo.abilities'
import { PokemonImage } from './baseInfo.pokemonImage'
import { RelationPokemon } from './baseinfo.relationPokemon'
import { InfoTitle } from './components'
import styled from 'styled-components'
import { TypesInfo } from './basInfo.typesInfo'

interface IFDetailBaseInfoProps {
  info: Pokemon
}

const DetailBaseInfoContainer: React.FC<IFDetailBaseInfoProps> = (props) => {
  const { info } = props

  return (
    <Div>
      <PokemonImage
        name={info.name}
        pokemonNumber={info.number}
        type={info.type}
      />

      <InfoTitle name={info.name} />
      <div className="pokemon-description">
        <Abilities {...info.stats} />
        <TypesInfo type={info.type} />
        <RelationPokemon name={info.name} evolutionId={info.evolutionId} />
      </div>
    </Div>
  )
}

export default DetailBaseInfoContainer

const Div = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;

  & > .pokemon-description {
    width: 100%;
    height: 44rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 2rem;
    padding: 2rem 0;
  }
`
