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
      <div className="relation-pokemon-list">
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

export default RelationPokemonComponent

const Div = styled.div`
  width: 24rem;
  height: 16rem;
  background-color: var(--color-primary-4);
  border: 3px solid var(--color-primary-1);
  border-radius: 1rem;
  outline: 3px solid var(--color-primary-4);
  padding: 1rem;
  margin: 2rem auto 0;

  & > h2 {
    width: 100%;
    height: 2rem;
    font-size: 1.5rem;
    line-height: 2rem;
    border-bottom: 1px solid var(--color-primary-1);
  }

  & > .relation-pokemon-list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem 0;
  }
`
