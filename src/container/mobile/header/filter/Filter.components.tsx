import isEqual from 'fast-deep-equal'
import styled from 'styled-components'
import FilterPokemonTypeComponent from './filter.pokemonType/FilterPokemonType.component'
import { memo } from 'react'

const Section = styled.section``

const FilterComponents = () => {
  return (
    <Section>
      <FilterPokemonTypeComponent />
    </Section>
  )
}

export default memo(FilterComponents, isEqual)
