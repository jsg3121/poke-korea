import FilterHeaderComponent from './movesFilter/filterHeader/FilterHeader.component'
import FilterOptionsComponent from './movesFilter/filterOptions/FilterOptions.component'
import FilterSearchComponent from './movesFilter/filterSearch/FilterSearch.component'

const MovesSearchAndFilter = () => {
  return (
    <article className="w-full md:min-h-auto  mx-auto flex flex-col pt-3 pb-3 md:pb-0 gap-3 md:gap-0 sticky mb-6 top-16 md:top-40 bg-primary-1 z-10 shadow-[0px_2px_7px_5px_#27374d] px-4 md:px-0">
      <FilterSearchComponent />
      <FilterHeaderComponent />
      <FilterOptionsComponent />
    </article>
  )
}

export default MovesSearchAndFilter
