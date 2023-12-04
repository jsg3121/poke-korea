import isEqual from 'fast-deep-equal'
import React from 'react'
import styled, { css } from 'styled-components'
import { changeType, imageMode } from '~/common'
import { Ball, Image, Tag } from '~/components'
import { PokemonCardFragment } from '~/graphql/typeGenerated'
import { CardColor } from '~/types'
import { pokemonNumberFormat } from '../../module'

interface CardComponentProps {
  pokemonData: PokemonCardFragment
}

type CardType = { background: Array<CardColor> }

const Card = styled.article<CardType>`
  ${({ background }) => css`
    width: 14rem;
    height: 20rem;
    border: 1px solid #333333;
    border-radius: 10px;
    padding: 0.83333333rem 0.55555556rem;
    outline: 0.25rem solid #ffffff;
    position: relative;
    overflow: hidden;
    box-shadow: inset 10px 0 0 0 #334150;
    background: ${() => {
      if (background.length === 1) {
        return `${background[0]}`
      } else {
        return `linear-gradient(
              135deg,
              ${background[0]} 35%,
              ${background[1]} 65%
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

      .card-info__icon {
        width: 2rem;
        height: 2rem;
        flex-shrink: 0;
        margin-right: 0.5rem;
      }

      .card-info__text {
        width: 100%;
        height: 1.25rem;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        border-bottom: 1px solid #334150;
        padding-bottom: 0.25rem;

        .card-info__number {
          height: 1rem;
          font-size: 1rem;
          font-weight: 500;
        }

        .card-info__name {
          width: 100%;
          font-size: 1rem;
          font-weight: 600;
          text-align: right;
        }
      }
    }

    .card-info__stat {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-column-gap: 1rem;
      margin-top: 0.55555556rem;
      padding: 0 0.55555556rem;

      .stat__info {
        width: 100%;
        height: 1.25rem;
        display: flex;
        align-items: center;
        justify-content: space-between;

        p {
          font-size: 0.875rem;
          line-height: 1.25rem;

          &.info__title {
            font-weight: 500;
          }
        }
      }
    }

    .card-info__types {
      display: flex;
      align-items: center;
      gap: 0.38888889rem;
      padding: 0 0.55555556rem;
    }

    .card-info__point {
      width: 100%;
      height: 1rem;
    }

    .card-info__image {
      width: fit-content;
      margin: 0 auto 1rem;
      filter: drop-shadow(2px 3px 2px #333333);
      position: relative;
    }
  `}
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
    <Card background={backgroundColor}>
      <div className="card-info__title">
        <div className="card-info__icon">
          <Ball />
        </div>
        <div className="card-info__text">
          <p className="card-info__number">No.{pokemonNumber}</p>
          <h3 className="card-info__name">{pokemonData.name}</h3>
        </div>
      </div>
      <div className="card-info__image">
        <div className="card-info__image--background"></div>
        <Image
          height="10rem"
          width="10rem"
          alt={`pokemon_id_${pokemonData.number}`}
          src={`${imageMode}/${pokemonData.number}.webp`}
          imageCaption={`포켓몬 ${pokemonData.name} 이미지`}
          sizes="10rem"
          priority
        />
      </div>
      <div className="card-info__types">
        {pokemonData.type.map((item, index) => {
          return <Tag key={`${item}-id-${index}`} label={item} />
        })}
      </div>
      <div className="card-info__stat">
        <div className="stat__info">
          <p className="info__title">체력</p>
          <p className="info__description">{pokemonData.stats.hp}</p>
        </div>
        <div className="stat__info">
          <p className="info__title">공격</p>
          <p className="info__description">{pokemonData.stats.attack}</p>
        </div>
        <div className="stat__info">
          <p className="info__title">특수공격</p>
          <p className="info__description">{pokemonData.stats.specialAttack}</p>
        </div>
        <div className="stat__info">
          <p className="info__title">방어</p>
          <p className="info__description">{pokemonData.stats.defense}</p>
        </div>
        <div className="stat__info">
          <p className="info__title">특수방어</p>
          <p className="info__description">
            {pokemonData.stats.specialDefense}
          </p>
        </div>
        <div className="stat__info">
          <p className="info__title">스피드</p>
          <p className="info__description">{pokemonData.stats.speed}</p>
        </div>
      </div>

      {/* {(pokemonData.isMega || pokemonData.isRegion) && (
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
      )} */}
    </Card>
  )
}

export default React.memo(CardComponent, isEqual)
