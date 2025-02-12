import Link from 'next/link'
import styled from 'styled-components'
import { imageMode } from '~/module/buildMode'
import InfoCardTitleComponent from '../components/InfoCardTitle.component'
import ImageComponent from '~/components/Image.component'

interface IFProps {
  evolutionId: Array<number>
  name: string
}

const RelationPokemonComponent = ({ name, evolutionId }: IFProps) => {
  return (
    <Section>
      <InfoCardTitleComponent title="진화 체인" />
      <div className="relation-pokemon-list">
        {evolutionId.map((id) => {
          return (
            <Link key={`relation-pokemon-id-${id}`} href={`/detail/${id}`}>
              <ImageComponent
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
