import React from 'react'
import { Pokemon } from '~/graphql/typeGenerated'
import { Abilities } from './baseInfo.abilities'
import { PokemonImage } from './baseInfo.pokemonImage'
import { RelationPokemon } from './baseinfo.relationPokemon'

interface IFDetailBaseInfoProps {
  info: Pokemon
}

const DetailBaseInfoContainer: React.FC<IFDetailBaseInfoProps> = (props) => {
  const { info } = props

  return (
    <React.Fragment>
      <PokemonImage
        name={info.name}
        pokemonNumber={info.number}
        type={info.type}
      />
      <h1>
        {info.id} {info.name}
      </h1>
      <RelationPokemon name={info.name} evolutionId={info.evolutionId} />
      <Abilities {...info.stats} />
    </React.Fragment>
  )
}

export default DetailBaseInfoContainer
