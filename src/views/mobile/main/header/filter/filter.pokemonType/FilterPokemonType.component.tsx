import { useRouter } from 'next/router'
import { ChangeEvent, useState } from 'react'
import styled from 'styled-components'
import ImageComponent from '~/components/Image.component'
import { useBodyScrollLock } from '~/hook/useBodyScrollLock'
import { getChangeTypeList } from '~/module/getChangeTypeList'
import { PokemonTypes } from '~/types/pokemonTypes.types'
import TypeFieldButtonComponents from './components/TypeFieldButton.components'
import FilterModalComponent from './filter.modal/FilterModal.component'

const Div = styled.div`
  width: calc(100% - 3rem);
  margin: 1rem auto 0;

  & > .select-types-wrapper {
    width: 100%;
    height: 6rem;
    background-color: var(--color-primary-4);
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    overflow-x: scroll;
    padding: 0 1.5rem;
  }

  & > .select-filter-wrapper {
    width: 100%;
    border-bottom: 1px solid var(--color-primary-4);
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1rem;
    padding-bottom: 1rem;

    & > .button--filter {
      height: 2.5rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      background-color: var(--color-primary-4);
      border-radius: 3rem;
      padding: 0 1rem;

      & > span {
        height: 2.5rem;
        font-size: 1.125rem;
        line-height: calc(2.5rem + 2px);
        color: var(--color-primary-1);
      }
    }

    & > .button--reset {
      font-size: 1.125rem;
      line-height: 2.5rem;
      color: var(--color-primary-4);

      &:disabled {
        color: var(--color-primary-2);
      }
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
    <Div>
      <div
        className="select-types-wrapper"
        role="searchbox"
        aria-label="타입별 포켓몬 필터 검색"
      >
        {Object.entries(PokemonTypes).map(([types, typeName]) => {
          return (
            <TypeFieldButtonComponents
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
      </div>
      <div className="select-filter-wrapper">
        <button className="button--filter" onClick={handleClickOpenFilter}>
          <ImageComponent
            alt="다른 필터 조건 추가"
            src="/assets/image/filter.svg"
            height="1.5rem"
            width="1.5rem"
          />
          <span>필터</span>
        </button>
        <button
          className="button--reset"
          onClick={handleClickReset}
          disabled={isEmptyQuery}
        >
          초기화
        </button>
        {isOpenModal && (
          <FilterModalComponent onClickCloseModal={handleClickCloseModal} />
        )}
      </div>
    </Div>
  )
}

export default FilterPokemonTypeComponent
