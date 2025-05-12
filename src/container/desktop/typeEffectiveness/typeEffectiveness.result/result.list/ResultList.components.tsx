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
    width: 100%;
    height: 1.5rem;
    font-size: 1.25rem;
    line-height: 1.5rem;
    text-align: left;
    background-color: ${() => {
      switch (importantpoint) {
        case 5: {
          return '#ff5f42'
        }
        case 4: {
          return '#f9bd3d'
        }
        case 3: {
          return '#59a0f5'
        }
        case 2: {
          return '#5ce9ff'
        }
        case 1:
        default: {
          return '#6af073'
        }
      }
    }};
  `}
`

const Dd = styled.dd<StyledProps>`
  width: 100%;
  padding: 1rem 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
`
