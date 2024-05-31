import { FC } from 'react'
import styled from 'styled-components'
import { useRelationType } from '~/hook'
import { InfoContent } from './typesInfo.infoContent'

interface IFProps {
  type: Array<string>
}

const TypesInfoComponent: FC<IFProps> = (props) => {
  const { type } = props

  const relationType = useRelationType(type)

  return (
    <Section>
      <h2>타입, 상성, 특성, 진화가능성 추가해</h2>
      <h2>이름, 도감번호 관련 진화 포켓몬</h2>
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
  padding: 1rem 1rem 0;

  & > h2 {
    width: 100%;
    font-size: 1.5rem;
    line-height: 2rem;
    border-bottom: 1px solid var(--color-primary-1);
  }
`
