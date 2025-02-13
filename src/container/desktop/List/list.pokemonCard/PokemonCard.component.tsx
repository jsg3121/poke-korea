import Link from 'next/link'
import { useMemo } from 'react'
import styled, { css } from 'styled-components'
import BallComponent from '~/components/Ball.component'
import ImageComponent from '~/components/Image.component'
import TagComponent from '~/components/Tag.component'
import { PokemonCardFragment } from '~/graphql/typeGenerated'
import { imageMode } from '~/module/buildMode'
import { CardColor } from '~/types/pokemonTypes.types'
import { pokemonNumberFormat } from '../module/pokemonNumberFormat'

interface CardComponentProps {
  pokemonData: PokemonCardFragment
}

type CardType = { background: Array<CardColor> }

const Card = styled.article<CardType>`
  ${({ background }) => css`
    width: 14rem;
    height: 20rem;
    color: #333333;
    border: 1px solid #333333;
    border-radius: 10px;
    display: block;
    padding: 0.83333333rem 0.55555556rem;
    outline: 0.25rem solid #ffffff;
    position: relative;
    overflow: hidden;
    box-shadow: inset 10px 0 0 0 #334150;
    cursor: pointer;
    transition: transform 0.3s cubic-bezier(0.03, 0.57, 0.37, 1.02);
    transform: scale(1);
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

    &:hover {
      transform: scale(1.2);
      z-index: 10;
    }

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
          color: #333333;
        }

        .card-info__name {
          width: 100%;
          font-size: 1rem;
          font-weight: 600;
          text-align: right;
          color: #000000;
        }
      }
    }

    .card-info__stat {
      width: 100%;
      display: grid;
      grid-template-rows: repeat(3, 1fr);
      grid-template-columns: 35% 15% 35% 15%;
      margin-top: 0.55555556rem;
      padding: 0 0.55555556rem;

      .info__title,
      .info__description {
        height: 1.25rem;
        font-size: 0.875rem;
        line-height: 1.25rem;
      }

      .info__title {
        &:nth-of-type(even) {
          margin-left: 1rem;
        }
      }

      .info__description {
        text-align: right;
        color: #000000;
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
      margin: 0 auto 0.5rem;
      filter: drop-shadow(2px 3px 2px #333333);
      position: relative;
    }
  `}
`

const PokemonCardComponent = ({ pokemonData }: CardComponentProps) => {
  const pokemonNumber = pokemonNumberFormat(pokemonData.number)

  const backgroundColor = useMemo(() => {
    const background: Array<CardColor> = []
    pokemonData.types.map((item) => {
      return background.push(CardColor[item])
    })
    return background
  }, [pokemonData])

  return (
    <Link href={`/detail/${pokemonData.number}`}>
      <Card
        background={backgroundColor}
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
        <dl className="card-info__stat" aria-description="포켓몬 능력치 정보">
          <dt className="info__title">체력</dt>
          <dd className="info__description">{pokemonData.pokemonStats.hp}</dd>
          <dt className="info__title">공격</dt>
          <dd className="info__description">
            {pokemonData.pokemonStats.attack}
          </dd>
          <dt className="info__title">특수공격</dt>
          <dd className="info__description">
            {pokemonData.pokemonStats.specialAttack}
          </dd>
          <dt className="info__title">방어</dt>
          <dd className="info__description">
            {pokemonData.pokemonStats.defense}
          </dd>
          <dt className="info__title">특수방어</dt>
          <dd className="info__description">
            {pokemonData.pokemonStats.specialDefense}
          </dd>
          <dt className="info__title">스피드</dt>
          <dd className="info__description">
            {pokemonData.pokemonStats.speed}
          </dd>
        </dl>
      </Card>
    </Link>
  )
}

export default PokemonCardComponent
