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
        <React.Fragment>
          <PokemonImage
            name={info.name}
            pokemonNumber={info.number}
            evolutionId={info.evolutionId}
          />
          <Abilities {...info.stats} />
        </React.Fragment>
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
  justify-content: space-between;
  gap: 1rem;
  padding: 2rem 0 0;
`
