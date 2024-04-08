import React from 'react'
import styled from 'styled-components'
import { Pokemon } from '~/graphql/typeGenerated'
import { Abilities } from './baseInfo.abilities'
import { PokemonImage } from './baseInfo.pokemonImage'

interface IFDetailBaseInfoProps {
  info: Pokemon
}

const DetailBaseInfoContainer: React.FC<IFDetailBaseInfoProps> = (props) => {
  const { info } = props

  return (
    <Article>
      {info && (
        <>
          <PokemonImage
            name={info.name}
            pokemonNumber={info.number}
            evolutionId={info.evolutionId}
          />
          <Abilities {...info.stats} />
        </>
      )}
    </Article>
  )
}

export default DetailBaseInfoContainer

const Article = styled.article`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`
