import isEqual from 'fast-deep-equal'
import React from 'react'
import styled from 'styled-components'
import { ListContext } from '~/context'
import { PokemonTypes } from '~/types'
import { TypeFieldButton } from '../components'
import { useCheckSelectTypeListField } from '../hook'

interface FieldTypeComponentProps {}

const FieldTypeInput = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 1rem;
  justify-content: space-between;
  position: relative;
`

const FieldTypeComponent: React.FC<FieldTypeComponentProps> = () => {
  const { listFilter, onChangeFilter } = React.useContext(ListContext)
  const [typeList, setTypeList] = useCheckSelectTypeListField(
    listFilter.type || []
  )

  const handleChageFilter = React.useCallback(
    (value: string) => {
      setTypeList(value)
      if (onChangeFilter) {
        onChangeFilter({
          type: [...typeList],
        })
      }
    },
    [onChangeFilter, setTypeList, typeList]
  )

  return (
    <FieldTypeInput>
      {Object.entries(PokemonTypes).map((key) => {
        return (
          <TypeFieldButton
            key={key[0]}
            onClick={handleChageFilter}
            typeValue={key[0].toLowerCase()}
            typeName={key[1]}
          />
        )
      })}
    </FieldTypeInput>
  )
}

export default React.memo(FieldTypeComponent, isEqual)
