import styled from 'styled-components'
import { PokemonType } from '~/graphql/typeGenerated'
import { calculateRelationType } from '~/module/calculateRelationType'
import InfoCardTitleComponent from '../components/InfoCardTitle.component'
import InfoContentComponent from './typesInfo.infoContent/InfoContent.component'

interface TypesInfoComponentProps {
  type: Array<PokemonType>
}

const TypesInfoComponent = ({ type }: TypesInfoComponentProps) => {
  const relationType = calculateRelationType(type)

  return (
    <Section>
      <InfoCardTitleComponent title="타입 상성" />
      <InfoContentComponent relationType={relationType} />
    </Section>
  )
}

export default TypesInfoComponent

const Section = styled.section`
  width: 100%;
  height: 100%;
  background-color: var(--color-primary-4);
  border: 3px solid var(--color-primary-1);
  border-radius: 1rem;
  outline: 3px solid var(--color-primary-4);
  padding: 1rem;
`
