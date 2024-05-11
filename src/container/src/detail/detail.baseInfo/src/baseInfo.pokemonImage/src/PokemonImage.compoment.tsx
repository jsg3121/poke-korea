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
    <Article>
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
    </Article>
  )
}

export default PokemonImageCompoment

const Article = styled.article`
  .pokemon-image {
    width: 25rem;
    height: 25rem;
  }

  .relation-pokemon {
    width: 21rem;
    height: 10rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;
  }
`
