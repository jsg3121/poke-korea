import { useRouter } from 'next/router'
import React from 'react'
import styled from 'styled-components'
import { PokemonTypes } from '~/types'
import { TypeFieldButton } from '../components'
import { Image } from '~/components'
import { getChangeTypeList } from '../module'
import { FilterModal } from '../filter.modal'

interface FilterPokemonTypeComponentProps {}

const FieldTypeInput = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  .button--filter {
    width: 6rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background-color: #b8bfc9;
    border-radius: 1rem;
    color: #142129;
    font-weight: 500;
    line-height: 2rem;
    cursor: pointer;
  }
`

const FilterPokemonTypeComponent: React.FC<
  FilterPokemonTypeComponentProps
> = () => {
  const [isOpenModal, setIsOpenModal] = React.useState<boolean>(false)
  const router = useRouter()
  const typeList = router.query.type
    ? (router.query.type as string).split(',')
    : []

  const handleClickTypeFilter = (type: string) => {
    const changeList = getChangeTypeList(typeList, type)

    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        type: changeList !== '' ? changeList : [],
      },
    })
  }

  const handleClickOpenFilter = () => {
    setIsOpenModal(true)
  }

  const handleClickCloseModal = () => {
    setIsOpenModal(false)
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
            defaultChecked={typeList.includes(typeName)}
            disabled={
              typeList.length === 2 && typeList.indexOf(typeName) < 0
                ? true
                : false
            }
          />
        )
      })}
      <button className="button--filter" onClick={handleClickOpenFilter}>
        <Image
          alt="다른 필터 조건 추가"
          src="/assets/image/filter.svg"
          height="1.5rem"
          width="1.5rem"
        />
        필터
      </button>
      <FilterModal onClickCloseModal={handleClickCloseModal} />
    </FieldTypeInput>
  )
}

export default FilterPokemonTypeComponent
