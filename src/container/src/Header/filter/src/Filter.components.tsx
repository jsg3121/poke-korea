import React from 'react'
import isEqual from 'fast-deep-equal'
import styled from 'styled-components'
import { FilterPokemonType } from './filter.pokemonType'

interface FilterComponentsProps {}

const Filter = styled.div`
  width: 100%;
  max-width: 2160px;
  height: 3rem;
`

const FilterComponents: React.FC<FilterComponentsProps> = (props) => {
  const {} = props

  return (
    <Filter>
      <FilterPokemonType />
    </Filter>
  )
}

export default React.memo(FilterComponents, isEqual)
