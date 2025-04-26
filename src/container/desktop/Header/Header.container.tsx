import { useContext } from 'react'
import styled from 'styled-components'
import { ListContext } from '~/context/List.context'
import FilterComponents from './filter/Filter.components'
import LogoComponent from './logo/Logo.component'
import SearchComponent from './search/Search.component'

const Header = styled.header`
  width: 100%;
  height: 20rem;
  background-color: var(--color-primary-2);
  transition: height 0.3s;
  will-change: height;
  position: fixed;
  top: 0;
  z-index: 20;
  padding: 1.5rem 0 0;

  &[data-scrolling='true'],
  &[data-searching='has-query'] {
    height: 11rem;
  }

  & > .header-wrapper {
    width: 100%;
    max-width: 1280px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    padding: 0 20px;
  }
`

const HeaderContainer = () => {
  const { scrolling, searching } = useContext(ListContext)

  return (
    <Header
      data-scrolling={scrolling}
      data-searching={searching ? 'has-query' : ''}
    >
      <div className="header-wrapper">
        <LogoComponent />
        <SearchComponent />
      </div>
      <FilterComponents />
    </Header>
  )
}

export default HeaderContainer
