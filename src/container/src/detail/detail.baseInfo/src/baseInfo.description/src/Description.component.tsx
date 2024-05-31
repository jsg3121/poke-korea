import { FC, useContext } from 'react'
import styled from 'styled-components'
import { InfoCardTitle } from '../../../components'
import { DetailContext } from '~/context/src/Detail.context'
import { Tag } from '~/components'

const DescriptionComponent: FC = () => {
  const { activeTypeInfo } = useContext(DetailContext)
  const { types, generation, isEvolution, name, pokemonNumber, activeType } =
    activeTypeInfo

  return (
    <Article>
      <InfoCardTitle title="포켓몬 정보" />
      <ul>
        <li>
          <div>
            <strong>이름 :</strong>
            <span className="pokemon-name">
              {name}&nbsp;
              {activeType === 'mega'
                ? '(메가진화)'
                : activeType === 'region'
                  ? '(리전폼)'
                  : ''}
            </span>
          </div>
        </li>
        <li>
          <div>
            <strong>전국도감번호 : </strong>
            <span>No. {pokemonNumber.toString().padStart(3, '0')}</span>
          </div>
        </li>
        <li>
          <div>
            <strong>등장 세대 : </strong>
            <span>{generation} 세대</span>
          </div>
        </li>
        <li>
          <div>
            <strong>타입 : </strong>
            {types.map((type) => {
              return <Tag key={type} label={type} />
            })}
          </div>
        </li>
        <li>
          <div>
            <strong>진화체 : </strong>
            <span>{isEvolution ? '진화체 있음' : '진화 불가'}</span>
          </div>
        </li>
      </ul>
    </Article>
  )
}

export default DescriptionComponent

const Article = styled.article`
  width: 18rem;
  height: 100%;
  flex-shrink: 0;
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

      & > div {
        width: 100%;
        height: 2rem;
        border-bottom: 1px solid var(--color-primary-3);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding-bottom: 0.5rem;

        & > strong,
        & > span {
          height: 2.5rem;
          font-size: 1.25rem;
          line-height: calc(2.5rem + 2px);
        }

        & > span {
          font-weight: 600;
        }
      }
    }
  }
`
