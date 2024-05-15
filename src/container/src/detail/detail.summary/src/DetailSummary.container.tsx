import { FC } from 'react'
import styled from 'styled-components'
import { PokemonImage } from './baseInfo.pokemonImage'
import { InfoTitle } from './components'
import { Pokemon } from '~/graphql/typeGenerated'
import { Abilities } from './baseInfo.abilities'

import { TypesColor } from '~/types'
import { changeColor } from '~/common'
import { Switch } from '~/components'
interface IFProps {
  info: Pokemon
}

type TStyledProps = { gradient: Array<TypesColor> }

const Div = styled.div<TStyledProps>`
  width: 100%;
  height: 30rem;
  margin: 0 auto;
  position: relative;
  margin-bottom: 10rem;

  &::before {
    content: '';
    width: 100%;
    height: 20rem;
    background-color: #ffffff;
    display: block;
  }

  &::after {
    content: '';
    width: 100%;
    height: 20rem;
    display: block;
    position: absolute;
    top: 0;
    background: ${(props) => {
      if (props.gradient.length === 1) {
        return `${props.gradient[0]}66`
      } else {
        return `linear-gradient(
              135deg,
              ${props.gradient[0]}88 35%,
              ${props.gradient[1]}88 65%
            )`
      }
    }};
  }

  & > .detail-profile {
    width: 100%;
    max-width: 1320px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    top: -17rem;
    left: 0;
    z-index: 1;
    margin: 0 auto;
    padding: 0 20px;

    & > .profile-description {
      display: flex;
      align-items: flex-start;
      gap: 2rem;

      & > .button-switch {
        width: 10rem;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }
    }
  }
`

const DetailSummaryContainer: FC<IFProps> = (props) => {
  const { info } = props

  const newColor = changeColor(info.type)

  const handleChangeMega = () => {}

  return (
    <Div gradient={newColor}>
      <div className="detail-profile">
        <div className="profile-image">
          <PokemonImage name={info.name} pokemonNumber={info.number} />
          <InfoTitle name={info.name} />
        </div>
        <div className="profile-description">
          <div className="button-switch">
            이로치치치
            <Switch name="shiny-switch" onChange={handleChangeMega} />
          </div>
          <Abilities {...info.stats} />
        </div>
      </div>
    </Div>
  )
}

export default DetailSummaryContainer
