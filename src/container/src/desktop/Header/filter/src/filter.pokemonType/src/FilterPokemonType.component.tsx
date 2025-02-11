import { useRouter } from 'next/router'
import React, { ChangeEvent, useState } from 'react'
import { PokemonTypes } from '~/types'
import { TypeFieldButton } from '../components'
import { Image } from '~/components'
import { FilterModal } from '../filter.modal'
import { useBodyScrollLock } from '~/hook/useBodyScrollLock'
import styled from 'styled-components'
import { getChangeTypeList } from '~/module/getChangeTypeList'

const FieldTypeInput = styled.div`
  width: 100%;
  max-width: 1280px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  margin: 0 auto;
  padding: 0 20px;

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

  .button--reset {
    color: var(--color-primary-4);

    &:disabled {
      color: var(--color-primary-2);
    }
  }
`

const isEmptyQueryCheck = (obj: object): boolean =>
  Object.keys(obj).length === 0

const FilterPokemonTypeComponent = () => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const router = useRouter()
  useBodyScrollLock(isOpenModal)

  const typeList = router.query.type
    ? (router.query.type as string).split(',')
    : []

  const handleClickTypeFilter = (e: ChangeEvent<HTMLInputElement>) => {
    const type = e.target.value
    const changeList = getChangeTypeList(typeList, type)

    router.replace({
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
    router.replace({
      pathname: router.pathname,
    })
  }

  const isEmptyQuery = isEmptyQueryCheck(router.query)

  return (
    <FieldTypeInput role="searchbox" aria-label="타입별 포켓몬 필터 검색">
      {Object.entries(PokemonTypes).map(([types, typeName]) => {
        return (
          <TypeFieldButton
            key={`pokemon-type-key-${types}`}
            onChange={handleClickTypeFilter}
            typeValue={types}
            typeName={typeName}
            checked={typeList.includes(types)}
            disabled={
              typeList.length === 2 && typeList.indexOf(types) < 0
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
      <button
        className="button--reset"
        onClick={handleClickReset}
        disabled={isEmptyQuery}
      >
        초기화
      </button>
      {isOpenModal && <FilterModal onClickCloseModal={handleClickCloseModal} />}
    </FieldTypeInput>
  )
}

export default FilterPokemonTypeComponent
