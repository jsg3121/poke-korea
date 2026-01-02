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
    <div
      role="searchbox"
      aria-label="타입별 포켓몬 필터 검색"
      className="w-full max-w-[1280px] h-full flex-between relative mx-auto px-5"
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
      <button
        className="w-24 h-8 flex-center gap-2 bg-[#b8bfc9] rounded-2xl text-[#142129] font-medium leading-8 cursor-pointer"
        onClick={handleClickOpenFilter}
      >
        <ImageComponent
          alt="다른 필터 조건 추가"
          src="/assets/image/filter.svg"
          height="1.5rem"
          width="1.5rem"
        />
        필터
      </button>
      <button
        className="text-primary-4 disabled:text-primary-2"
        onClick={handleClickReset}
        disabled={isEmptyQuery}
      >
        초기화
      </button>
      {isOpenModal && (
        <FilterModalComponent onClickCloseModal={handleClickCloseModal} />
      )}
    </div>
  )
}

export default FilterPokemonTypeComponent
