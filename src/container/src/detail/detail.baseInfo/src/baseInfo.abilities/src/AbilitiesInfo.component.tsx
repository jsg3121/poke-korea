import { FC, useContext } from 'react'
import styled from 'styled-components'
import { InfoCardTitle } from '../../../components'
import { DetailContext } from '~/context/src/Detail.context'

const AbilitiesInfoComponent: FC = () => {
  const { activeTypeInfo } = useContext(DetailContext)
  const { abilities } = activeTypeInfo

  return (
    <Article>
      <InfoCardTitle title="특성 정보" />
      <ul>
        {abilities.map((ability, index) => {
          return (
            <li key={`ability-id-${index}`}>
              {ability.isHidden ? '숨겨진 특성' : ''}
              {ability.name}
              {ability.description}
            </li>
          )
        })}
      </ul>
    </Article>
  )
}

export default AbilitiesInfoComponent

const Article = styled.article`
  width: 100%;
  height: 100%;
  grid-column: 2/4;
  background-color: var(--color-primary-4);
  border: 3px solid var(--color-primary-1);
  border-radius: 1rem;
  outline: 3px solid var(--color-primary-4);
  display: grid;
  padding: 1rem;
`
