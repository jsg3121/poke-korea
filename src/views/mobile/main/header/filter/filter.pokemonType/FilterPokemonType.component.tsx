'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent, useState } from 'react'
import ImageComponent from '~/components/Image.component'
import { useBodyScrollLock } from '~/hook/useBodyScrollLock'
import { getChangeTypeList } from '~/module/getChangeTypeList'
import { PokemonTypes } from '~/types/pokemonTypes.types'
import TypeFieldButtonComponents from './components/TypeFieldButton.components'
import FilterModalComponent from './filter.modal/FilterModal.component'

const FilterPokemonTypeComponent = () => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const router = useRouter()
  const routerQuery = useSearchParams()
  const pathname = usePathname()

  useBodyScrollLock(isOpenModal)

  const typeList = routerQuery.get('type')?.split(',') ?? []

  const handleClickTypeFilter = (e: ChangeEvent<HTMLInputElement>) => {
    const type = e.target.value
    const changeList = getChangeTypeList(typeList, type)
    const params = new URLSearchParams(routerQuery)

    if (changeList.length > 0) {
      params.set('type', changeList)
    } else {
      params.delete('type')
    }

    router.replace(`${pathname}?${params.toString()}`)
  }

  const handleClickOpenFilter = () => {
    setIsOpenModal(true)
  }

  const handleClickCloseModal = () => {
    setIsOpenModal(false)
  }

  const handleClickReset = () => {
    router.replace(pathname)
  }

  const isEmptyQuery = routerQuery.size === 0

  return (
    <div className="w-[calc(100%-3rem)] mt-4 mx-auto">
      <div
        className="w-full h-24 bg-primary-4 rounded-[2rem] flex items-center gap-4 overflow-x-scroll px-6"
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
      <div className="w-full border-b border-solid border-primary-4 flex items-center justify-between mt-4 pb-4">
        <button
          className="h-10 flex items-center gap-1 bg-primary-4 rounded-[3rem] px-4"
          onClick={handleClickOpenFilter}
        >
          <ImageComponent
            alt="다른 필터 조건 추가"
            src="/assets/image/filter.svg"
            height="1.5rem"
            width="1.5rem"
          />
          <span className="h-10 text-lg leading-[calc(2.5rem+2px)] text-primary-1">
            필터
          </span>
        </button>
        <button
          className={`text-lg leading-10 ${
            isEmptyQuery ? 'text-primary-2' : 'text-primary-4'
          }`}
          onClick={handleClickReset}
          disabled={isEmptyQuery}
        >
          초기화
        </button>
        {isOpenModal && (
          <FilterModalComponent onClickCloseModal={handleClickCloseModal} />
        )}
      </div>
    </div>
  )
}

export default FilterPokemonTypeComponent
