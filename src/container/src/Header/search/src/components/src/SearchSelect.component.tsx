import React from 'react'
import isEqual from 'fast-deep-equal'
import styled from 'styled-components'

interface SearchSelectComponentProps {}

const SearchSelect = styled.aside`
  width: calc(100% - 2.77777778rem);
  min-height: 10rem;
  background-color: #ffffff;
  border: 1px solid #333333;
  position: absolute;
  top: 4rem;
  z-index: 111;
  left: 1.38888889rem;
`

const SearchSelectComponent: React.FC<SearchSelectComponentProps> = (props) => {
  const {} = props

  return <SearchSelect></SearchSelect>
}

export default React.memo(SearchSelectComponent, isEqual)
