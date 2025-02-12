import React from 'react'
import isEqual from 'fast-deep-equal'
import styled from 'styled-components'
import FilterPokemonTypeComponent from './filter.pokemonType/FilterPokemonType.component'

interface FilterComponentsProps {}

const Section = styled.section``

const FilterComponents: React.FC<FilterComponentsProps> = () => {
  return (
    <Section>
      <FilterPokemonTypeComponent />
    </Section>
  )
}

export default React.memo(FilterComponents, isEqual)
