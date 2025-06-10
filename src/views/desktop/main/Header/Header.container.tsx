'use client'
import { useContext } from 'react'
import { ListContext } from '~/context/List.context'
import FilterComponents from './filter/Filter.components'
import LogoComponent from './logo/Logo.component'
import SearchComponent from './search/Search.component'

const HeaderContainer = () => {
  const { scrolling, searching } = useContext(ListContext)

  return (
    <header
      className={`w-full bg-primary-2 transition-[height] duration-300 will-change-[height] fixed top-0 z-20 pt-6 ${
        scrolling || searching ? 'h-44' : 'h-80'
      }`}
      data-scrolling={scrolling}
      data-searching={searching ? 'has-query' : ''}
    >
      <div className="w-full max-w-[1280px] absolute left-1/2 -translate-x-1/2 translate-y-0 px-5">
        <LogoComponent />
        <SearchComponent />
      </div>
      <FilterComponents />
    </header>
  )
}

export default HeaderContainer
