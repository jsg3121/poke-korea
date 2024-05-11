import { FC } from 'react'
import styled from 'styled-components'
import { imageMode } from '~/common'
import { Image } from '~/components'

interface IFProps {
  evolutionId: Array<number>
  name: string
}

const RelationPokemonComponent: FC<IFProps> = ({ name, evolutionId }) => {
  return (
    <Div>
      <h2>진화 체인</h2>
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
    </Div>
  )
}

export default RelationPokemonComponent

const Div = styled.div`
  width: 100%;
  height: 10rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`
