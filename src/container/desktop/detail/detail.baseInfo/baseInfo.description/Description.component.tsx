import { useContext } from 'react'
import styled from 'styled-components'
import TagComponent from '~/components/Tag.component'
import { DetailContext } from '~/context/Detail.context'
import InfoCardTitleComponent from '../components/InfoCardTitle.component'

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
    <Article>
      <InfoCardTitleComponent title="기본 정보" />
      <ul>
        <li>
          <strong>이름</strong>
          <span className="pokemon-name">
            {name}&nbsp;
            {activeType === 'mega'
              ? '(메가진화)'
              : activeType === 'region'
                ? '(리전폼)'
                : ''}
          </span>
        </li>
        <li>
          <strong>전국도감번호</strong>
          <span>No. {pokemonNumber.toString().padStart(3, '0')}</span>
        </li>
        <li>
          <strong>등장 세대</strong>
          <span>{generation} 세대</span>
        </li>
        <li>
          <strong>타입</strong>
          {types.map((type) => {
            return <TagComponent key={type} type={type} />
          })}
        </li>
        <li>
          <strong>진화체</strong>
          <span>{isEvolution ? '진화체 있음' : '진화 불가'}</span>
        </li>
        {isRegion && (
          <li>
            <strong>리전폼</strong>
            <span>리전폼 존재</span>
          </li>
        )}
        {isMega && (
          <li>
            <strong>메가진화</strong>
            <span>메가진화 가능</span>
          </li>
        )}
      </ul>
    </Article>
  )
}

export default DescriptionComponent

const Article = styled.article`
  height: 100%;
  background-color: var(--color-primary-4);
  border: 3px solid var(--color-primary-1);
  border-radius: 1rem;
  outline: 3px solid var(--color-primary-4);
  display: grid;
  padding: 1rem;

  & > ul {
    width: 100%;

    & > li {
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

      & > strong,
      & > span {
        height: 2.5rem;
        font-size: 1.25rem;
        line-height: calc(2.5rem + 2px);
      }

      & > strong {
        width: 12rem;

        &::after {
          content: ':';
          float: right;
        }
      }

      & > span {
        font-weight: 600;
      }
    }
  }
`
