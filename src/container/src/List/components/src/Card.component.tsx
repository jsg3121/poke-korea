import isEqual from 'fast-deep-equal'
import React from 'react'
import styled from 'styled-components'
import { changeType, imageMode } from '~/common'
import { Ball, Image, Tag } from '~/components'
import { PokemonCardFragment } from '~/graphql/typeGenerated'
import { CardColor } from '~/types'
import { pokemonNumberFormat } from '../../module'

interface CardComponentProps {
  pokemonData: PokemonCardFragment
}

type CardType = { backgroundColor: Array<CardColor> }

const Card = styled.article<CardType>`
  width: 14rem;
  height: 20rem;
  border: 1px solid #333333;
  border-radius: 10px;
  padding: 0.83333333rem 0.55555556rem;
  margin: 0.55555556rem 0;
  outline: 0.25rem solid #ffffff;
  position: relative;
  overflow: hidden;
  box-shadow: inset 10px 0 0 0 #334150;
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

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    border-top: 1.5rem solid #334150;
    border-left: 1.5rem solid #334150;
    border-right: 1.5rem solid transparent;
    border-bottom: 1.5rem solid transparent;
  }

  .card-info__title {
    width: 100%;
    height: 2rem;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    .ball__icon {
      width: 2rem;
      height: 2rem;
      flex-shrink: 0;
      margin-right: 0.5rem;
    }

    .card-info__number {
      height: 1rem;
      font-size: 1rem;
      font-weight: 500;
    }

    .card-info__name {
      width: 100%;
      height: 2rem;
      font-size: 1.25rem;
      line-height: 2rem;
      font-weight: 600;
      text-align: right;
    }
  }

  .card-info__types {
    display: flex;
    align-items: center;
    gap: 0.38888889rem;
  }

  .card-info__point {
    width: 100%;
    height: 1rem;
  }

  .card-info__image {
    width: fit-content;
    margin: 1.11111111rem auto;
    filter: drop-shadow(2px 3px 2px #333333);
  }
`

const CardComponent: React.FC<CardComponentProps> = (props) => {
  const { pokemonData } = props

  const pokemonNumber = pokemonNumberFormat(pokemonData.number)

  const backgroundColor = React.useMemo(() => {
    const background: Array<CardColor> = []
    pokemonData.type.map((item) => {
      return background.push(changeType(item).cardColor)
    })
    return background
  }, [pokemonData])

  return (
    <Card backgroundColor={backgroundColor}>
      <div className="card-info__title">
        <div className="ball__icon">
          <Ball />
        </div>
        <p className="card-info__number">No.{pokemonNumber}</p>
        <h3 className="card-info__name">{pokemonData.name}</h3>
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
      <div className="card-info__types">
        {pokemonData.type.map((item, index) => {
          return <Tag key={`${item}-id-${index}`} label={item} />
        })}
      </div>
    </Card>
  )
}

export default React.memo(CardComponent, isEqual)
