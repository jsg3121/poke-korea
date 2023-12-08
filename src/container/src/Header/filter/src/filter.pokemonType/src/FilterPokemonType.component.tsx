import { useRouter } from 'next/router'
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

const getChangeTypeList = (typeList: Array<string>, type: string) => {
  return typeList.includes(type)
    ? typeList.filter((list) => list !== type)
    : [...typeList, type]
}

const FilterPokemonTypeComponent: React.FC<
  FilterPokemonTypeComponentProps
> = () => {
  const router = useRouter()
  const typeList = router.query.type
    ? (router.query.type as string).split(',')
    : []

  const handleClickTypeFilter = (type: string) => {
    const changeList = getChangeTypeList(typeList, type).join(',')

    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        type: changeList,
      },
    })
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
