import React from 'react'
import { Pokemon } from '~/graphql/typeGenerated'
import { Abilities } from './baseInfo.abilities'
import { PokemonImage } from './baseInfo.pokemonImage'
import { RelationPokemon } from './baseinfo.relationPokemon'
import { InfoTitle } from './components'

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
      <InfoTitle name={info.name} />
      <RelationPokemon name={info.name} evolutionId={info.evolutionId} />
      <Abilities {...info.stats} />
    </React.Fragment>
  )
}

export default DetailBaseInfoContainer
