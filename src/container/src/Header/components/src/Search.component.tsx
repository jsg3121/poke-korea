import React from 'react'
import isEqual from 'fast-deep-equal'
import styled from 'styled-components'

const Search = styled.div`
  min-width: 50%;
  height: 80px;
  background-color: blue;
  margin: 0 20px;
`

const SearchComponent: React.FC = () => {
  return <Search></Search>
}

export default React.memo(SearchComponent, isEqual)
