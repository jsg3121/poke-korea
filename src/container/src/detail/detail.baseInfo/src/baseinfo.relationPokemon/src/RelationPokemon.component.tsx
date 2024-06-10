import Link from 'next/link'
import { FC } from 'react'
import styled from 'styled-components'
import { imageMode } from '~/common'
import { Image } from '~/components'
import { InfoCardTitle } from '../../../components'

interface IFProps {
  evolutionId: Array<number>
  name: string
}

const RelationPokemonComponent: FC<IFProps> = ({ name, evolutionId }) => {
  return (
    <Section>
      <InfoCardTitle title="진화 체인" />
      <div className="relation-pokemon-list">
        {evolutionId.map((id) => {
          return (
            <Link key={`relation-pokemon-id-${id}`} href={`/detail/${id}`}>
              <Image
                src={`${imageMode}/${id}.webp`}
                width="12rem"
                height="12rem"
                alt={`포켓몬 ${name}`}
                unoptimized
              />
            </Link>
          )
        })}
      </div>
    </Section>
  )
}

export default RelationPokemonComponent

const Section = styled.section`
  width: 100%;
  height: 100%;
  background-color: var(--color-primary-4);
  border: 3px solid var(--color-primary-1);
  border-radius: 1rem;
  outline: 3px solid var(--color-primary-4);
  padding: 1rem;
  margin: 0 auto;

  & > .relation-pokemon-list {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 1rem 0 0;
  }
`
