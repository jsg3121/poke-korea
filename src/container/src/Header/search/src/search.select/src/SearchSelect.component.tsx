import React, { useContext } from 'react'
import isEqual from 'fast-deep-equal'
import styled from 'styled-components'
import { ListContext } from '~/context'
import { PokemonTypes } from '~/types'
import { Checkbox } from '~/components'
import { InputFieldType } from '../select.field'

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
  const { listFilter, selectOption, onChagneFilter } = useContext(ListContext)

  return (
    <SearchSelect>
      {selectOption === 'type' && <InputFieldType filter={listFilter.type} />}
    </SearchSelect>
  )
}

export default React.memo(SearchSelectComponent, isEqual)
