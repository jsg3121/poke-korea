import React from 'react'
import isEqual from 'fast-deep-equal'
import { FilterPokemonType } from './filter.pokemonType'
import styled from 'styled-components'

interface FilterComponentsProps {}

const Filter = styled.div`
  width: 100%;
  height: 4.8rem;
  background-color: var(--color-primary-1);
  box-shadow: 0 1px 6px -2px var(--color-black-1);
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 20;
`

const FilterComponents: React.FC<FilterComponentsProps> = () => {
  return (
    <Filter>
      <FilterPokemonType />
    </Filter>
  )
}

export default React.memo(FilterComponents, isEqual)
