import isEqual from 'fast-deep-equal'
import styled from 'styled-components'
import FilterPokemonTypeComponent from './filter.pokemonType/FilterPokemonType.component'
import { memo } from 'react'

const Section = styled.section`
  width: 100%;
  height: 4.8rem;
  background-color: var(--color-primary-1);
  box-shadow: 0 1px 6px -2px var(--color-black-1);
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 20;
`

const FilterComponents = () => {
  return (
    <Section>
      <FilterPokemonTypeComponent />
    </Section>
  )
}

export default memo(FilterComponents, isEqual)
