import isEqual from 'fast-deep-equal'
import FilterPokemonTypeComponent from './filter.pokemonType/FilterPokemonType.component'
import { memo } from 'react'

const FilterComponents = () => {
  return (
    <section className="w-full h-[4.8rem] bg-primary-1 shadow-[0_1px_6px_-2px_var(--color-black-1)] absolute bottom-0 left-0 z-20">
      <FilterPokemonTypeComponent />
    </section>
  )
}

export default memo(FilterComponents, isEqual)
