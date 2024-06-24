import { useRouter } from 'next/router'
import React, { ChangeEvent } from 'react'
import { PokemonTypes } from '~/types'
import { TypeFieldButton } from '../components'
import { Image } from '~/components'
import { getChangeTypeList } from '../module'
import { FilterModal } from '../filter.modal'
import { useBodyScrollLock } from '~/hook/src/useBodyScrollLock'
import styled from 'styled-components'

interface FilterPokemonTypeComponentProps {}

const Div = styled.div`
  width: 100%;

  & > .select-types-wrapper {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    justify-items: center;
    row-gap: 1rem;
    margin-top: 1rem;
    padding: 0 1rem;
  }
`

const isEmptyQueryCheck = (obj: object): boolean =>
  Object.keys(obj).length === 0

const FilterPokemonTypeComponent: React.FC<
  FilterPokemonTypeComponentProps
> = () => {
  const [isOpenModal, setIsOpenModal] = React.useState<boolean>(false)
  const router = useRouter()
  useBodyScrollLock(isOpenModal)

  const typeList = router.query.type
    ? (router.query.type as string).split(',')
    : []

  const handleClickTypeFilter = (e: ChangeEvent<HTMLInputElement>) => {
    const type = e.target.value
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

  const handleClickReset = () => {
    router.push({
      pathname: router.pathname,
    })
  }

  const isEmptyQuery = isEmptyQueryCheck(router.query)

  return (
    <Div>
      <div className="select-types-wrapper" role="searchbox">
        {Object.entries(PokemonTypes).map(([types, typeName]) => {
          return (
            <TypeFieldButton
              key={`pokemon-type-key-${types}`}
              onChange={handleClickTypeFilter}
              typeValue={types.toLowerCase()}
              typeName={typeName}
              checked={typeList.includes(typeName)}
              disabled={
                typeList.length === 2 && typeList.indexOf(typeName) < 0
                  ? true
                  : false
              }
            />
          )
        })}
      </div>
      <button className="button--filter" onClick={handleClickOpenFilter}>
        <Image
          alt="다른 필터 조건 추가"
          src="/assets/image/filter.svg"
          height="1.5rem"
          width="1.5rem"
        />
        필터
      </button>
      <button
        className="button--reset"
        onClick={handleClickReset}
        disabled={isEmptyQuery}
      >
        초기화
      </button>
      {isOpenModal && <FilterModal onClickCloseModal={handleClickCloseModal} />}
    </Div>
  )
}

export default FilterPokemonTypeComponent
