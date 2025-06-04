import isEqual from 'fast-deep-equal'
import FilterPokemonTypeComponent from './filter.pokemonType/FilterPokemonType.component'
import { memo } from 'react'

const FilterComponents = () => {
  return (
    <section>
      <FilterPokemonTypeComponent />
    </section>
  )
}

export default memo(FilterComponents, isEqual)
