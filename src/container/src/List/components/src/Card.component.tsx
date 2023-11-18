import isEqual from 'fast-deep-equal'
import React from 'react'
import styled from 'styled-components'
import { changeType, imageMode } from '~/common'
import { Image, Tag } from '~/components'
import { TypesColor } from '~/types'
import { pokemonNumberFormat } from '../../module'
import { PokemonCardFragment } from '~/graphql/typeGenerated'

interface CardComponentProps {
  pokemonData: PokemonCardFragment
}

type CardType = { backgroundColor: Array<TypesColor> }

const Card = styled.article<CardType>`
  width: 14rem;
  height: 20rem;
  border: 1px solid #333333;
  border-radius: 10px;
  padding: 0.83333333rem;
  margin: 0.55555556rem 0;
  border: 0;
  background: ${(props) => {
    if (props.backgroundColor.length === 1) {
      return `${props.backgroundColor[0]}`
    } else {
      return `linear-gradient(
              135deg,
              ${props.backgroundColor[0]} 35%,
              ${props.backgroundColor[1]} 65%
            )`
    }
  }};

  .card-info__title {
    width: 100%;
    height: 1.38888889rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .card-info__number {
      height: 1rem;
      font-size: 1.125rem;
      font-weight: 600;
    }

    .card-info__types {
      display: flex;
      align-items: center;
      gap: 0.38888889rem;
    }
  }

  .card-info__point {
    width: 100%;
    height: 1rem;
  }

  .card-info__image {
    width: fit-content;
    margin: 1.11111111rem auto;
  }

  .card-info__name {
    width: 100%;
    height: 2rem;
    font-size: 1.75rem;
    line-height: 2rem;
    font-weight: bold;
    text-align: center;
  }
`

const CardComponent: React.FC<CardComponentProps> = (props) => {
  const { pokemonData } = props

  const pokemonNumber = pokemonNumberFormat(pokemonData.number)

  const backgroundColor = React.useMemo(() => {
    const background: Array<TypesColor> = []
    pokemonData.type.map((item) => {
      return background.push(changeType(item).color)
    })
    return background
  }, [pokemonData])

  return (
    <Card backgroundColor={backgroundColor}>
      <div className="card-info__title">
        <h4 className="card-info__number">No.{pokemonNumber}</h4>
        <div className="card-info__types">
          {pokemonData.type.map((item, index) => {
            return <Tag key={`${item}-id-${index}`} label={item} />
          })}
        </div>
      </div>
      <div className="card-info__point">
        {pokemonData.isMega && (
          <Image
            src="/assets/icons/mega.webp"
            alt="메가진화_아이콘"
            width="1rem"
            height="1rem"
          />
        )}
        {pokemonData.isRegion && (
          <Image
            src="/assets/icons/regionForm.webp"
            alt="리전폼_아이콘"
            width="1rem"
            height="1rem"
          />
        )}
      </div>
      <div className="card-info__image">
        <Image
          height="11rem"
          width="11rem"
          alt={`pokemon_id_${pokemonData.number}`}
          src={`${imageMode}/${pokemonData.number}.webp`}
          imageCaption={`포켓몬 ${pokemonData.name} 이미지`}
        />
      </div>
      <h3 className="card-info__name">{pokemonData.name}</h3>
    </Card>
  )
}

export default React.memo(CardComponent, isEqual)
