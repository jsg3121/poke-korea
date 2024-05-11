import { FC } from 'react'
import styled from 'styled-components'
import { changeColor, imageMode } from '~/common'
import { Image } from '~/components'
import { TypesColor } from '~/types'

interface IFProps {
  name: string
  pokemonNumber: number
  type: Array<string>
}

type TStyledProps = { backgroundColor: Array<TypesColor> }

const PokemonImageCompoment: FC<IFProps> = (props) => {
  const { name, pokemonNumber, type } = props

  const newColor = changeColor(type)

  return (
    <Div backgroundColor={newColor}>
      <div className="pokemon-main">
        <Image
          src={`${imageMode}/${pokemonNumber}.webp`}
          width="23rem"
          height="23rem"
          alt={`포켓몬 ${name}의 모습`}
          className="pokemon-main"
          unoptimized
        />
      </div>
    </Div>
  )
}

export default PokemonImageCompoment

const Div = styled.div<TStyledProps>`
  width: 100%;
  height: 20rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
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

  & > .pokemon-main {
    width: 23rem;
    height: 23rem;
    position: absolute;
    bottom: -6.5rem;
    filter: drop-shadow(0px -3px 3px #000000);
  }
`
