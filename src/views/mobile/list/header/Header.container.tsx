import FilterComponents from './filter/Filter.components'
import SearchComponent from './search/Search.component'

const HeaderContainer = () => {
  return (
    <header className="w-full min-h-60">
      <SearchComponent />
      <FilterComponents />
    </header>
  )
}

export default HeaderContainer
