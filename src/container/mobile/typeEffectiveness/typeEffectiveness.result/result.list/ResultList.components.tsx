import { Fragment } from 'react'
import styled, { css } from 'styled-components'
import { PokemonType } from '~/graphql/typeGenerated'
import { PokemonTypes } from '~/types/pokemonTypes.types'
import TypeResultChipComponents from './components/TypeResultChip.components'

interface ResultListComponentsProps {
  title: string
  dataList: Array<PokemonType>
  importantPoint: 1 | 2 | 3 | 4 | 5
}

type StyledProps = {
  importantpoint: 1 | 2 | 3 | 4 | 5
}

const ResultListComponents = ({
  title,
  dataList,
  importantPoint,
}: ResultListComponentsProps) => {
  return (
    <Fragment>
      <Dt importantpoint={importantPoint}>{title}</Dt>
      <Dd importantpoint={importantPoint}>
        {dataList.map((type) => {
          return (
            <TypeResultChipComponents
              key={`type-quad-id-${type}`}
              typeLabel={PokemonTypes[type]}
              typeValue={type}
            />
          )
        })}
      </Dd>
    </Fragment>
  )
}

export default ResultListComponents

const Dt = styled.dt<StyledProps>`
  ${({ importantpoint }) => css`
    width: fit-content;
    height: 1.75rem;
    font-size: 1rem;
    line-height: calc(1.75rem + 2px);
    text-align: left;
    box-shadow: 1px 2px 6px 0 var(--color-primary-1);
    border-radius: 1rem;
    padding: 0 0.75rem;
    background-color: ${() => {
      switch (importantpoint) {
        case 5: {
          return '#feb0b0'
        }
        case 4: {
          return '#ffae76'
        }
        case 3: {
          return '#ffdf61'
        }
        case 2: {
          return '#84efff'
        }
        case 1:
        default: {
          return '#80f7ac'
        }
      }
    }};
  `}
`

const Dd = styled.dd<StyledProps>`
  width: 100%;
  padding: 1rem 0 2rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;

  &:last-child {
    padding: 1rem 0 0;
  }
`
