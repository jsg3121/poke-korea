import React from 'react'
import styled from 'styled-components'
import { ListContext } from '~/context'
import { PokemonTypes } from '~/types'
import { TypeFieldButton } from '../components'
import { useCheckSelectTypeListField } from '../hook'

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
  const [typeList, onChangeTypeList] = useCheckSelectTypeListField(
    listFilter.type || []
  )

  const handleClickTypeFilter = (type: string) => {
    onChangeTypeList(type)
  }

  React.useEffect(() => {
    if (onChangeFilter) {
      onChangeFilter({ type: typeList })
    }
  }, [onChangeFilter, typeList])

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
