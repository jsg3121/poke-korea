import isEqual from 'fast-deep-equal'
import React, { useContext } from 'react'
import styled from 'styled-components'
import { ListContext } from '~/context'
import { InputFieldType } from '../select.field'

interface SearchSelectComponentProps {}

const SearchSelect = styled.aside`
  width: fit-content;
  min-height: fit-content;
  background-color: #1c2c36;
  outline: 1px solid #ced9de;
  border-radius: 2.22222222rem;
  position: absolute;
  top: 3.5rem;
  z-index: 111;
  left: 50%;
  transform: translate(-50%, 0);
`

const SearchSelectComponent: React.FC<SearchSelectComponentProps> = () => {
  const { listFilter, selectOption, onChagneFilter } = useContext(ListContext)

  return (
    <SearchSelect>
      {selectOption === 'type' && <InputFieldType filter={listFilter.type} />}
    </SearchSelect>
  )
}

export default React.memo(SearchSelectComponent, isEqual)
