import isEqual from 'fast-deep-equal'
import Image from 'next/image'
import React from 'react'
import styled from 'styled-components'
import { imageMode } from '~/common'
import { Tag } from '~/components'
import { PokemonCardFragment } from '~/graphql/hooks'

interface CardComponentProps {
  pokemonData: PokemonCardFragment
}

const Card = styled.div`
  width: 300px;
  height: 400px;
  border: 1px solid #333333;
  border-radius: 10px;
  margin: 10px 0;
`

const CardComponent: React.FC<CardComponentProps> = (props) => {
  const { pokemonData } = props

  return (
    <Card>
      <Image
        alt={`pokemon_id_${pokemonData.number}`}
        src={`${imageMode}/${pokemonData.number}.webp`}
        width={100}
        height={100}
      />
      <p>{pokemonData.number}</p>
      <p className="card-info__name">{pokemonData.name}</p>
      {pokemonData.type.map((item, index) => {
        return <Tag key={`${item}-id-${index}`} label={item} />
      })}
      {pokemonData.isMega && <p>메가진화</p>}
      {pokemonData.isRegion && <p>리전폼</p>}
    </Card>
  )
}

export default React.memo(CardComponent, isEqual)
