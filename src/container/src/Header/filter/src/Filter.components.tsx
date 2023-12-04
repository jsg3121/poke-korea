import React from 'react'
import isEqual from 'fast-deep-equal'
import styled from 'styled-components'
import { FilterPokemonType } from './filter.pokemonType'

interface FilterComponentsProps {}

const Filter = styled.div`
  width: 100%;
  height: 3rem;
  background-color: #142129;
  padding: 0 2rem;
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
