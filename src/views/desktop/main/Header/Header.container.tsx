import LogoIcon from '~/assets/logo.svg'
import FilterComponents from './filter/Filter.components'
import SearchComponent from './search/Search.component'

const HeaderContainer = () => {
  return (
    <header
      className={`w-full h-44 bg-primary-2 transition-[height] duration-300 will-change-[height] fixed top-0 z-20 pt-6`}
    >
      <div className="w-full max-w-[1280px] h-12 mx-auto px-5 relative">
        <h1 className="sr-only">포켓몬의 모든 정보 Poke Korea</h1>
        <div className="w-56 h-12">
          <LogoIcon />
        </div>
        <SearchComponent />
      </div>
      <FilterComponents />
    </header>
  )
}

export default HeaderContainer
