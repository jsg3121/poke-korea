import React from 'react'
import styled from 'styled-components'
import { PokemonTypes } from '~/types'
import { TypeFieldButton } from '../components'
import { useRouter } from 'next/router'
import { useSetTypeFieldList } from '../module'
import { ListContext } from '~/context'

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
  const { listFilter } = React.useContext(ListContext)
  const [typeList, onChangeTypeList] = useSetTypeFieldList(
    listFilter.type || []
  )

  const handleClickTypeFilter = (type: string) => {
    onChangeTypeList(type)
  }

  return (
    <FieldTypeInput>
      {Object.entries(PokemonTypes).map(([types, typeName]) => {
        return (
          <TypeFieldButton
            key={`pokemon-type-key-${types}`}
            onClick={handleClickTypeFilter}
            typeValue={types.toLowerCase()}
            typeName={typeName}
            disabled={
              typeList.length === 2 && typeList.indexOf(typeName) < 0
                ? true
                : false
            }
          />
        )
      })}
    </FieldTypeInput>
  )
}

export default FilterPokemonTypeComponent
