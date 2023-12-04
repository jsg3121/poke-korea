import isEqual from 'fast-deep-equal'
import React from 'react'
import styled from 'styled-components'
import { ListContext } from '~/context'
import { PokemonTypes } from '~/types'
import { TypeFieldButton } from '../components'

interface FilterPokemonTypeComponentProps {}

const FieldTypeInput = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
`

const FilterPokemonTypeComponent: React.FC<
  FilterPokemonTypeComponentProps
> = () => {
  const { listFilter, onChangeFilter } = React.useContext(ListContext)

  const handleChageFilter = (value: string) => {
    const typeList = listFilter.type || []
    if (onChangeFilter) {
      if (typeList.indexOf(value) === -1) {
        onChangeFilter({ type: [...typeList, value] })
      }
    }
  }

  return (
    <FieldTypeInput>
      {Object.entries(PokemonTypes).map(([types, typeName]) => {
        return (
          <TypeFieldButton
            key={`pokemon-type-key-${types}`}
            onClick={handleChageFilter}
            typeValue={types.toLowerCase()}
            typeName={typeName}
          />
        )
      })}
    </FieldTypeInput>
  )
}

export default FilterPokemonTypeComponent
