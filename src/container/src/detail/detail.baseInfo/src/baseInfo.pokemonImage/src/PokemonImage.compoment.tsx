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
        포켓몬 메인 이미지
        {/* <Image
          src={`${imageMode}/${pokemonNumber}.webp`}
          width="25rem"
          height="25rem"
          alt={`포켓몬 ${name}`}
          unoptimized
        /> */}
      </div>
      <div className="relation-pokemon">
        <div className="image-dummy">진화 관련 이미지</div>
        <div className="image-dummy">진화 관련 이미지</div>
        {/* {evolutionId.map((id) => {
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
        })} */}
      </div>
    </Div>
  )
}

export default PokemonImageCompoment

const Div = styled.div`
  .pokemon-image {
    width: 25rem;
    height: 25rem;
    background-color: #eeeeee;
  }

  .relation-pokemon {
    width: 21rem;
    height: 10rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;

    .image-dummy {
      width: 10rem;
      height: 10rem;
      background-color: #4b924b;
    }
  }
`
