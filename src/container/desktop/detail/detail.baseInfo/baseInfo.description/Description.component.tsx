import { useContext } from 'react'
import styled from 'styled-components'
import TagComponent from '~/components/Tag.component'
import { DetailContext } from '~/context/Detail.context'
import InfoCardTitleComponent from '../components/InfoCardTitle.component'
import { PokemonTypes } from '~/types/pokemonTypes.types'

const DescriptionComponent = () => {
  const { activeTypeInfo } = useContext(DetailContext)
  const {
    types,
    generation,
    isEvolution,
    name,
    pokemonNumber,
    activeType,
    isMega,
    isRegion,
  } = activeTypeInfo

  return (
    <Section aria-labelledby="pokemon-base-info">
      <InfoCardTitleComponent title="기본 정보" id="pokemon-base-info" />
      <dl>
        <div>
          <dt>이름</dt>
          <dd className="pokemon-name">
            {name}&nbsp;
            {activeType === 'mega'
              ? '(메가진화)'
              : activeType === 'region'
                ? '(리전폼)'
                : ''}
          </dd>
        </div>
        <div>
          <dt>전국도감번호</dt>
          <dd>No. {pokemonNumber.toString().padStart(3, '0')}</dd>
        </div>
        <div>
          <dt>등장 세대</dt>
          <dd>{generation} 세대</dd>
        </div>
        <div>
          <dt>타입</dt>
          <dd aria-label={types.map((type) => PokemonTypes[type]).join(',')}>
            {types.map((type) => {
              return <TagComponent key={type} type={type} />
            })}
          </dd>
        </div>
        <div>
          <dt>진화체</dt>
          <dd>{isEvolution ? '진화체 있음' : '진화 불가'}</dd>
        </div>
        {isRegion && (
          <div>
            <dt>리전폼</dt>
            <dd>리전폼 존재</dd>
          </div>
        )}
        {isMega && (
          <div>
            <dt>메가진화</dt>
            <dd>메가진화 가능</dd>
          </div>
        )}
      </dl>
    </Section>
  )
}

export default DescriptionComponent

const Section = styled.section`
  height: 100%;
  background-color: var(--color-primary-4);
  border: 3px solid var(--color-primary-1);
  border-radius: 1rem;
  box-shadow: 0 0 0px 3px var(--color-primary-4);
  display: grid;
  padding: 1rem;

  & > dl {
    width: 100%;

    & > div {
      width: 100%;
      height: 3rem;
      width: 100%;
      border-bottom: 1px solid var(--color-primary-3);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0;

      &:last-child {
        border-bottom: 0;
        padding: 0;
      }

      & > dt,
      & > dd {
        height: 2.5rem;
        font-size: 1.25rem;
        line-height: calc(2.5rem + 2px);
      }

      & > dt {
        width: 12rem;

        &::after {
          content: ':';
          float: right;
        }
      }

      & > dd {
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
    }
  }
`
