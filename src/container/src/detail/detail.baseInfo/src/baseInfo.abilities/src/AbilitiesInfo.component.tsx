import { FC, useContext } from 'react'
import styled from 'styled-components'
import { InfoCardTitle } from '../../../components'
import { DetailContext } from '~/context/src/Detail.context'

const AbilitiesInfoComponent: FC = () => {
  const { activeTypeInfo } = useContext(DetailContext)
  const { abilities } = activeTypeInfo

  return (
    <Article>
      <InfoCardTitle title="특성" />
      <ul>
        {abilities.map((ability, index) => {
          return (
            <li key={`ability-id-${index}`}>
              <div>
                <h3>
                  {ability.name}&nbsp;
                  {ability.isHidden && <span>(숨겨진 특성)</span>}
                </h3>
                <p>{ability.description}</p>
              </div>
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
  padding: 1rem;

  & > ul {
    width: 100%;
    height: calc(100% - 4.25rem);
    display: flex;
    flex-direction: column;
    gap: 1rem;

    & > li {
      width: 100%;

      & > div {
        border-bottom: 1px solid var(--color-primary-3);
        padding-bottom: 0.5rem;
        position: relative;
        overflow: hidden;

        & > h3 {
          width: 100%;
          height: 1.75rem;
          font-size: 1.25rem;
          font-weight: bold;
          line-height: 1.5rem;
          padding-bottom: 0.5rem;

          & > span {
            font-size: 0.75rem;
            font-weight: normal;
          }
        }

        & > p {
          width: 100%;
          min-height: 1.5rem;
          font-size: 1rem;
          line-height: 1.5rem;
        }
      }
    }
  }
`
