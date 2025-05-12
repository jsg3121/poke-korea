import { Fragment } from 'react'
import styled from 'styled-components'
import { PokemonType } from '~/graphql/typeGenerated'
import { PokemonTypes } from '~/types/pokemonTypes.types'
import TypeResultChipComponents from './components/TypeResultChip.components'

interface ResultListComponentsProps {
  title: string
  dataList: Array<PokemonType>
}

const ResultListComponents = ({
  title,
  dataList,
}: ResultListComponentsProps) => {
  return (
    <Fragment>
      <Dt>{title}</Dt>
      <Dd>
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

const Dt = styled.dt`
  width: 100%;
  height: 1.5rem;
  font-size: 1.25rem;
  line-height: 1.5rem;
  text-align: left;
  background-color: var(--color-primary-3);
`
const Dd = styled.dd`
  width: 100%;
  padding: 1rem 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
`
