import { FC } from 'react'
import styled from 'styled-components'
import { PokemonImage } from './baseInfo.pokemonImage'
import { InfoTitle } from './components'
import { Pokemon } from '~/graphql/typeGenerated'
import { Abilities } from './baseInfo.abilities'

import { TypesColor } from '~/types'
import { changeColor } from '~/common'
interface IFProps {
  info: Pokemon
}

type TStyledProps = { backgroundColor: Array<TypesColor> }

const Div = styled.div<TStyledProps>`
  width: 100%;
  margin: 0 auto;
  position: relative;

  &::before {
    content: '';
    width: 100%;
    height: 20rem;
    background-color: #ffffff;
    display: block;
    z-index: -1;
  }

  &::after {
    content: '';
    width: 100%;
    height: 20rem;
    display: block;
    position: absolute;
    top: 0;
    z-index: 0;
    background: ${(props) => {
      if (props.backgroundColor.length === 1) {
        return `${props.backgroundColor[0]}66`
      } else {
        return `linear-gradient(
              135deg,
              ${props.backgroundColor[0]}88 35%,
              ${props.backgroundColor[1]}88 65%
            )`
      }
    }};
  }

  & > .detail-profile {
    width: 100%;
    max-width: 1320px;
    height: 20rem;
    position: relative;
    top: -17rem;
    left: 0;
    z-index: 1;
    margin: 0 auto;
    padding: 0 20px;
  }
`

const DetailSummaryContainer: FC<IFProps> = (props) => {
  const { info } = props

  const newColor = changeColor(info.type)

  return (
    <Div backgroundColor={newColor}>
      <div className="detail-profile">
        <PokemonImage name={info.name} pokemonNumber={info.number} />
        <InfoTitle name={info.name} />
      </div>
      <div className="detail-description">
        <Abilities {...info.stats} />
      </div>
    </Div>
  )
}

export default DetailSummaryContainer
