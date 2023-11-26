import React, { useContext } from 'react'
import isEqual from 'fast-deep-equal'
import styled from 'styled-components'
import { ListContext } from '~/context'

interface SearchSelectComponentProps {}

const SearchSelect = styled.aside`
  width: 100%;
  min-height: 10rem;
  background-color: #ffffff;
  border: 1px solid #333333;
  border-radius: 2.22222222rem;
  position: absolute;
  top: 3.5rem;
  z-index: 111;
  left: 0;
`

const SearchSelectComponent: React.FC<SearchSelectComponentProps> = () => {
  const { selectOption } = useContext(ListContext)

  return <SearchSelect></SearchSelect>
}

export default React.memo(SearchSelectComponent, isEqual)
