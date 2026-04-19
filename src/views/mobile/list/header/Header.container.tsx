import FilterComponents from '~/components/filter/Filter.components'
import SearchComponent from './search/Search.component'

const HeaderContainer = () => {
  return (
    <header className="w-full min-h-60">
      <h1 className="sr-only">포켓몬 도감</h1>
      <SearchComponent />
      <FilterComponents />
    </header>
  )
}

export default HeaderContainer
