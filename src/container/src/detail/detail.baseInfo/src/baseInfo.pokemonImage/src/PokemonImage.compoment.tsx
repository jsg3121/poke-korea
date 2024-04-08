import { FC } from 'react'
import styled from 'styled-components'
import { imageMode } from '~/common'
import { Image } from '~/components'

interface IFProps {
  name: string
  pokemonNumber: number
  evolutionId: Array<number>
}

const PokemonImageCompoment: FC<IFProps> = (props) => {
  const { name, pokemonNumber, evolutionId } = props
  return (
    <Div>
      <div className="pokemon-image">
        <Image
          src={`${imageMode}/${pokemonNumber}.webp`}
          width="25rem"
          height="25rem"
          alt={`포켓몬 ${name}`}
          unoptimized
        />
      </div>
      <div className="relation-pokemon">
        {evolutionId.map((id) => {
          return (
            <Image
              key={`relation-pokemon-id-${id}`}
              src={`${imageMode}/${id}.webp`}
              width="10rem"
              height="10rem"
              alt={`포켓몬 ${name}`}
              unoptimized
            />
          )
        })}
      </div>
    </Div>
  )
}

export default PokemonImageCompoment

const Div = styled.div``
