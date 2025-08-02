import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { PokemonTypes } from '~/types/pokemonTypes.types'

interface MovesFilterProps {
  totalCount: number
}

const MovesFilter = ({ totalCount }: MovesFilterProps) => {
  const params = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const typeFilter = params.get('typeFilter')
  const damageTypeFilter = params.get('damageTypeFilter')
  const isActiveFilter = !!(typeFilter || damageTypeFilter)

  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(isActiveFilter)

  const handleClickToggleFilter = () => {
    setIsFilterOpen((prev) => !prev)
  }

  const handleClickSelectTypeFilter = (types: string) => () => {
    const queryString = new URLSearchParams(params)
    if (typeFilter === types) {
      queryString.delete('typeFilter')
    } else {
      queryString.set('typeFilter', types)
    }
    router.replace(`${pathname}?${queryString}`)
  }

  const handleClickSelectDamageTypeFilter = (damageTypes: string) => () => {
    const queryString = new URLSearchParams(params)
    if (damageTypeFilter === damageTypes) {
      queryString.delete('damageTypeFilter')
    } else {
      queryString.set('damageTypeFilter', damageTypes)
    }
    router.replace(`${pathname}?${queryString}`)
  }

  const handleClickResetFilter = () => {
    setIsFilterOpen(false)
    router.replace(pathname)
  }

  return (
    <div
      className="w-full min-h-3 flex justify-between flex-wrap items-baseline relative px-2"
      role="search"
    >
      <p className="w-fit text-[1rem] h-6 text-primary-4 leading-6 font-thin">
        총 <b className="font-[600]">{totalCount}</b>개의 기술을 볼 수 있어요!
      </p>
      <div className="flex items-baseline gap-4">
        <button
          className={`flex gap-1 items-center text-primary-4 text-[0.8rem] ${!isActiveFilter && 'disabled:grayscale disabled:opacity-50'}`}
          disabled={!isActiveFilter}
          onClick={handleClickResetFilter}
        >
          필터 초기화
        </button>
        <button
          aria-pressed={isFilterOpen}
          className="flex gap-1 items-center text-primary-4"
          onClick={handleClickToggleFilter}
        >
          필터 조건 {isFilterOpen ? '닫기' : '열기'}
        </button>
      </div>
      <ul
        className={`w-full absolute top-[1.5rem] left-0 border-t border-solid border-primary-4 px-2 bg-primary-1 flex gap-2 flex-col justify-center transition-[height] ${!isFilterOpen ? 'h-0' : 'h-[15.5rem]'} overflow-hidden [&>li]:min-h-8 [&>li>p]:w-24 [&>li>p]:text-primary-4 [&>li>p]:shrink-0`}
      >
        <li className="w-full my-4">
          <p className="mb-2">기술 타입</p>
          <div className="flex items-center flex-wrap gap-3 justify-start">
            {Object.entries(PokemonTypes).map(([types, typeName]) => {
              return (
                <button
                  key={types}
                  className={`min-w-[3rem] h-6 px-2 text-[0.875rem] text-primary-4 leading-[calc(1.5rem+2px)] block rounded-[1rem] chip-type-${types.toLowerCase()} ${typeFilter && typeFilter === types ? 'opacity-100 grayscale-0' : 'opacity-50 grayscale'}`}
                  onClick={handleClickSelectTypeFilter(types)}
                >
                  {typeName}
                </button>
              )
            })}
          </div>
        </li>
        <li className="w-full my-4">
          <p className="mb-2">기술 유형</p>
          <div className="flex items-center gap-3">
            <button
              className={`w-12 h-6 leading-[calc(1.5rem+2px)] rounded-lg bg-[#fd8181] text-primary-1 ${damageTypeFilter && damageTypeFilter === '물리' ? 'opacity-100 grayscale-0' : 'opacity-50 grayscale'}`}
              onClick={handleClickSelectDamageTypeFilter('물리')}
            >
              물리
            </button>
            <button
              className={`w-12 h-6 leading-[calc(1.5rem+2px)] rounded-lg bg-[#9b9bfa] text-primary-1 ${damageTypeFilter && damageTypeFilter === '특수' ? 'opacity-100 grayscale-0' : 'opacity-50 grayscale'}`}
              onClick={handleClickSelectDamageTypeFilter('특수')}
            >
              특수
            </button>
            <button
              className={`w-12 h-6 leading-[calc(1.5rem+2px)] rounded-lg bg-[#72d372] text-primary-1 ${damageTypeFilter && damageTypeFilter === '변화' ? 'opacity-100 grayscale-0' : 'opacity-50 grayscale'}`}
              onClick={handleClickSelectDamageTypeFilter('변화')}
            >
              변화
            </button>
          </div>
        </li>
      </ul>
    </div>
  )
}

export default MovesFilter
