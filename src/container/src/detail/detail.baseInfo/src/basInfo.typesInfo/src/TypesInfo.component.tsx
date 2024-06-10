import { FC } from 'react'
import styled from 'styled-components'
import { useRelationType } from '~/hook'
import { InfoContent } from './typesInfo.infoContent'
import { InfoCardTitle } from '../../../components'

interface IFProps {
  type: Array<string>
}

const TypesInfoComponent: FC<IFProps> = (props) => {
  const { type } = props

  const relationType = useRelationType(type)

  return (
    <Section>
      <InfoCardTitle title="타입 상성" />
      <InfoContent relationType={relationType} />
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
