import { useContext } from 'react'
import styled from 'styled-components'
import { DetailContext } from '~/context/Detail.context'
import InfoCardTitleComponent from '../components/InfoCardTitle.component'

const AbilitiesInfoComponent = () => {
  const { activeTypeInfo } = useContext(DetailContext)
  const { abilities } = activeTypeInfo

  return (
    <Section aria-label="포켓몬 특성 정보">
      <InfoCardTitleComponent title="특성" />
      <dl>
        {abilities.map((ability, index) => {
          return (
            <div key={`ability-id-${index}`}>
              <dt>
                {ability.name}&nbsp;
                {ability.isHidden && <span>(숨겨진 특성)</span>}
              </dt>
              <dd>{ability.description}</dd>
            </div>
          )
        })}
      </dl>
    </Section>
  )
}

export default AbilitiesInfoComponent

const Section = styled.section`
  width: 100%;
  height: 100%;
  background-color: var(--color-primary-4);
  border: 3px solid var(--color-primary-1);
  border-radius: 1rem;
  box-shadow: 0 0 0px 3px var(--color-primary-4);
  padding: 1rem;

  & > dl {
    width: 100%;
    height: calc(100% - 4.25rem);
    display: flex;
    flex-direction: column;
    gap: 1rem;

    & > div {
      width: 100%;
      border-bottom: 1px solid var(--color-primary-3);
      padding: 0.5rem 0;

      &:last-child {
        border-bottom: 0;
        padding: 0;
      }

      & > dt {
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

      & > dd {
        width: 100%;
        min-height: 1.5rem;
        font-size: 1rem;
        line-height: 1.5rem;
      }
    }
  }
`
