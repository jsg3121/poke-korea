import { FC } from 'react'
import styled from 'styled-components'
import { InfoCardTitle } from '../../../components'

const DescriptionComponent: FC = () => {
  return (
    <Article>
      <InfoCardTitle title="포켓몬 정보" />
      <ul>
        <li>이름</li>
        <li>도감번호</li>
        <li>등장 세대</li>
        <li>타입</li>
        <li>진화여부</li>
      </ul>
    </Article>
  )
}

export default DescriptionComponent

const Article = styled.article`
  width: 100%;
  height: 100%;
  background-color: var(--color-primary-4);
  border: 3px solid var(--color-primary-1);
  border-radius: 1rem;
  outline: 3px solid var(--color-primary-4);
  padding: 1rem;
`
