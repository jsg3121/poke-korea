import React from 'react'
import isEqual from 'fast-deep-equal'
import { FilterPokemonType } from './filter.pokemonType'
import styled from 'styled-components'

interface FilterComponentsProps {}

const Section = styled.section``

const FilterComponents: React.FC<FilterComponentsProps> = () => {
  return (
    <Section>
      <FilterPokemonType />
    </Section>
  )
}

export default React.memo(FilterComponents, isEqual)
