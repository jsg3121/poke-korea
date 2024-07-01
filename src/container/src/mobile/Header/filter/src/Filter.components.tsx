import React from 'react'
import isEqual from 'fast-deep-equal'
import { FilterPokemonType } from './filter.pokemonType'
import styled from 'styled-components'

interface FilterComponentsProps {}

const Filter = styled.div``

const FilterComponents: React.FC<FilterComponentsProps> = () => {
  return (
    <Filter>
      <FilterPokemonType />
    </Filter>
  )
}

export default React.memo(FilterComponents, isEqual)
