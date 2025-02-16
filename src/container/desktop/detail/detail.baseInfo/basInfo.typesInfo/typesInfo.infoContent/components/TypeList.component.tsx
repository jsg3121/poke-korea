import isEqual from 'fast-deep-equal'
import { memo } from 'react'
import styled from 'styled-components'
import TagComponent from '~/components/Tag.component'
import { PokemonType } from '~/graphql/typeGenerated'

interface TypeListComponentProps {
  list: Array<PokemonType>
  title: string
  grade: 'best' | 'better' | 'good' | 'warning' | 'danger'
}

const TypeList = styled.div`
  width: 100%;
  text-align: center;
  padding: 0 0 0.75rem;
  border: 3px solid var(--color-primary-1);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: inset -2px 0px 5px 0 #9a9a9a;

  & > dt {
    height: 1.5rem;
    font-size: 1rem;
    font-weight: 500;
    line-height: calc(1.5rem + 2px);
    margin-bottom: 0.75rem;
    box-shadow: inset -6px 1px 7px -4px #9a9a9a;

    &[data-grade='best'] {
      background-color: #6af073;
    }
    &[data-grade='better'] {
      background-color: #5ce9ff;
    }
    &[data-grade='good'] {
      background-color: #59a0f5;
    }
    &[data-grade='warning'] {
      background-color: #f9bd3d;
    }
    &[data-grade='danger'] {
      background-color: #ff5f42;
    }

    @media screen and (max-width: 475px) {
      letter-spacing: -0.75px;
    }
  }

  & > dd {
    height: calc(100% - 2.25rem);

    & > ul {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
  }
`

const TypeListComponent = ({ list, title, grade }: TypeListComponentProps) => {
  return (
    <TypeList>
      <dt data-grade={grade}>{title}</dt>
      <dd>
        <ul aria-label="상성 타입 리스트">
          {list.map((item, index) => {
            return (
              <li key={index}>
                <TagComponent type={item} />
              </li>
            )
          })}
        </ul>
      </dd>
    </TypeList>
  )
}

export default memo(TypeListComponent, isEqual)
