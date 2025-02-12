import { useRouter } from 'next/router'
import React from 'react'
import styled, { css } from 'styled-components'
import { PokemonCardFragment } from '~/graphql/typeGenerated'
import { imageMode } from '~/module/buildMode'
import { CardColor } from '~/types'
import { pokemonNumberFormat } from '../module/pokemonNumberFormat'
import ImageComponent from '~/components/Image.component'
import TagComponent from '~/components/Tag.component'
import BallComponent from '~/components/Ball.component'

interface CardComponentProps {
  pokemonData: PokemonCardFragment
}

type CardType = { background: Array<CardColor> }

const Card = styled.article<CardType>`
  ${({ background }) => css`
    width: 100%;
    height: 22rem;
    border: 1px solid #333333;
    border-radius: 10px;
    padding: 0.83333333rem 0.55555556rem;
    outline: 0.25rem solid #ffffff;
    position: relative;
    overflow: hidden;
    box-shadow: inset 10px 0 0 0 #334150;
    cursor: pointer;
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
      max-width: 19rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-column-gap: 0.75rem;
      margin: 1rem auto 0;
      padding-left: 0.5rem;

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
      width: 100%;
      max-width: 18rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0 0.5rem;
      margin: 0 auto;
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

const CardComponent = ({ pokemonData }: CardComponentProps) => {
  const router = useRouter()

  const pokemonNumber = pokemonNumberFormat(pokemonData.number)

  const backgroundColor = React.useMemo(() => {
    const background: Array<CardColor> = []
    pokemonData.types.map((item) => {
      return background.push(CardColor[item])
    })
    return background
  }, [pokemonData])

  const handleRouteDetailPokemon = () => {
    router.push(`/detail/${pokemonData.number}`)
  }

  return (
    <Card
      background={backgroundColor}
      onClick={handleRouteDetailPokemon}
      aria-label={`포켓몬 ${pokemonData.name} 카드`}
    >
      <header className="card-info__title">
        <i className="card-info__icon">
          <BallComponent />
        </i>
        <div className="card-info__text">
          <p className="card-info__number">No.{pokemonNumber}</p>
          <h3 className="card-info__name">{pokemonData.name}</h3>
        </div>
      </header>
      <div className="card-info__image" aria-description="포켓몬 이미지">
        <ImageComponent
          height="10rem"
          width="10rem"
          alt={`pokemon_id_${pokemonData.number}`}
          src={`${imageMode}/${pokemonData.number}.webp`}
          sizes="10rem"
          unoptimized
        />
      </div>
      <div className="card-info__types" aria-description="포켓몬 타입 정보">
        {pokemonData.types.map((item, index) => {
          return <TagComponent key={`${item}-id-${index}`} type={item} />
        })}
      </div>
      <ul className="card-info__stat" aria-description="포켓몬 능력치 정보">
        <li className="stat__info">
          <p className="info__title">체력</p>
          <p className="info__description">{pokemonData.pokemonStats.hp}</p>
        </li>
        <li className="stat__info">
          <p className="info__title">공격</p>
          <p className="info__description">{pokemonData.pokemonStats.attack}</p>
        </li>
        <li className="stat__info">
          <p className="info__title">특수공격</p>
          <p className="info__description">
            {pokemonData.pokemonStats.specialAttack}
          </p>
        </li>
        <li className="stat__info">
          <p className="info__title">방어</p>
          <p className="info__description">
            {pokemonData.pokemonStats.defense}
          </p>
        </li>
        <li className="stat__info">
          <p className="info__title">특수방어</p>
          <p className="info__description">
            {pokemonData.pokemonStats.specialDefense}
          </p>
        </li>
        <li className="stat__info">
          <p className="info__title">스피드</p>
          <p className="info__description">{pokemonData.pokemonStats.speed}</p>
        </li>
      </ul>
    </Card>
  )
}

export default CardComponent
