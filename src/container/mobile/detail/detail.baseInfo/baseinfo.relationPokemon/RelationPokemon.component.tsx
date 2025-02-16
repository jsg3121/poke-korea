import Link from 'next/link'
import styled from 'styled-components'
import { imageMode } from '~/module/buildMode'
import InfoCardTitleComponent from '../components/InfoCardTitle.component'
import ImageComponent from '~/components/Image.component'

interface RelationPokemonComponentProps {
  evolutionId: Array<number>
  name: string
}

const RelationPokemonComponent = ({
  name,
  evolutionId,
}: RelationPokemonComponentProps) => {
  return (
    <Section aria-labelledby="pokemon-evelotion-chain">
      <InfoCardTitleComponent title="진화 체인" id="pokemon-evelotion-chain" />
      <ul
        className="relation-pokemon-list"
        aria-label="진화 체인 포켓몬 리스트"
      >
        {evolutionId.map((id) => {
          return (
            <li key={`relation-pokemon-id-${id}`}>
              <Link
                href={`/detail/${id}`}
                aria-label={`${name}와(과) 연관된 포켓몬`}
              >
                <ImageComponent
                  src={`${imageMode}/${id}.webp`}
                  width="11.5rem"
                  height="11.5rem"
                  alt={`포켓몬 ${name} 연관 포켓몬 ${id}`}
                  unoptimized
                />
              </Link>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}

export default RelationPokemonComponent

const Section = styled.section`
  width: 100%;
  height: 20rem;
  background-color: var(--color-primary-4);
  border: 3px solid var(--color-primary-1);
  border-radius: 1rem;
  outline: 3px solid var(--color-primary-4);
  padding: 1rem;
  margin: 0 auto;

  & > .relation-pokemon-list {
    width: fit-content;
    max-width: 100%;
    height: calc(100% - 4.25rem);
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0;
    overflow-x: auto;
    margin: 0 auto;

    &::-webkit-scrollbar {
      display: block;
      height: 5px;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--color-primary-2);
      border-radius: 12px;
    }

    &::-webkit-scrollbar-track {
      background: var(--color-primary-3);
      border-radius: 12px;
    }
  }
`
