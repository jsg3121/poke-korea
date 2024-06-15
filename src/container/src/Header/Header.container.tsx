import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import React from 'react'
import styled from 'styled-components'
import { ListContext } from '~/context'
import { Filter } from './filter'
import { Logo } from './logo'
import HeaderNav from './nav/header.nav'
import { Search } from './search'

const Header = styled.header`
  width: 100%;
  height: 31rem;
  background-color: var(--color-primary-2);
  transition: height 0.3s;
  will-change: height;
  position: fixed;
  top: 0;
  z-index: 20;
  padding: 1.5rem 0 0;

  &[data-scrolling='true'] {
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

const checkRouteQuery = (query: ParsedUrlQuery) => {
  const values = Object.values(query)
  return (
    values.some((value) => value !== '') &&
    !values.every((value) => value === '')
  )
}

const HeaderContainer: React.FC = () => {
  const { scrolling } = React.useContext(ListContext)
  const router = useRouter()

  const dat = checkRouteQuery(router.query ?? {})

  return (
    <Header data-scrolling={scrolling}>
      <HeaderNav />
      <div className="header-wrapper">
        <Logo />
        <Search />
      </div>
      <Filter />
    </Header>
  )
}

export default HeaderContainer
