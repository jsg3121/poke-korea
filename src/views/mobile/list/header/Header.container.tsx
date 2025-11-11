import LogoComponent from './logo/Logo.component'
import SearchComponent from './search/Search.component'
import FilterComponents from './filter/Filter.components'

const HeaderContainer = () => {
  return (
    <header className="w-full min-h-60 pt-12">
      <LogoComponent />
      <SearchComponent />
      <FilterComponents />
    </header>
  )
}

export default HeaderContainer
