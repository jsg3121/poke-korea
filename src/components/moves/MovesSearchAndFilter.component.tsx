'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDebounce } from '~/hook/useDebounce'
import { PokemonTypes } from '~/types/pokemonTypes.types'

interface MovesSearchAndFilterProps {
  totalCount: number
}

const MovesSearchAndFilter = ({ totalCount }: MovesSearchAndFilterProps) => {
  const params = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const typeFilter = params.get('typeFilter')
  const damageTypeFilter = params.get('damageTypeFilter')
  const isActiveFilter = !!(typeFilter || damageTypeFilter)

  const [debouncedKeyword, debounce] = useDebounce()
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(isActiveFilter)

  useEffect(() => {
    const queryString = new URLSearchParams(params)
    queryString.set('search', debouncedKeyword.trim())

    if (queryString.get('search')) {
      router.replace(`${pathname}?${queryString}`, { scroll: false })
    } else {
      router.replace(`${pathname}`, { scroll: false })
    }
  }, [debouncedKeyword])

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    debounce(value)
  }

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
    <div className="w-[calc(100%-2.5rem)] md:w-full mx-auto flex flex-col py-3 gap-3 sticky mb-6 top-16 md:top-40 bg-primary-1 z-10 shadow-[0px_10px_7px_-6px_#27374d] px-2 md:px-0">
      {/* 검색 바 */}
      <div className="flex items-center gap-3">
        <div className="w-full relative">
          <input
            type="search"
            onChange={handleChangeSearch}
            placeholder="기술 이름으로 검색하세요"
            className="w-full h-12 px-4 border-2 border-solid border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* 필터 헤더 */}
      <div className="flex justify-between items-center">
        <p className="text-[0.875rem] md:text-[1rem] text-primary-3 md:text-primary-4 leading-6">
          총{' '}
          <strong className="text-[1rem] font-semibold text-primary-4">
            {totalCount}
          </strong>
          개의 기술을 볼 수 있어요!
        </p>
        <div className="flex items-center gap-3 md:gap-4">
          <button
            className={`flex gap-1 items-center text-primary-4 text-[0.75rem] md:text-[0.8rem] ${!isActiveFilter && 'disabled:grayscale disabled:opacity-50'}`}
            disabled={!isActiveFilter}
            onClick={handleClickResetFilter}
          >
            초기화
          </button>
          <button
            aria-pressed={isFilterOpen}
            className="flex gap-1 items-center text-primary-4 text-[0.875rem] md:text-[1rem]"
            onClick={handleClickToggleFilter}
          >
            필터 {isFilterOpen ? '닫기' : '열기'}
          </button>
        </div>
      </div>

      {/* 필터 옵션 */}
      <ul
        className={`w-full flex gap-3 flex-col transition-all duration-300 ${!isFilterOpen ? 'h-0 opacity-0' : 'h-auto opacity-100'} overflow-hidden`}
      >
        <li className="flex flex-col md:flex-row md:items-start gap-2 md:gap-3">
          <p className="text-primary-4 font-semibold text-[0.875rem] md:min-w-[4rem] md:pt-1">
            기술 타입
          </p>
          <div className="flex items-center flex-wrap gap-2 flex-1">
            {Object.entries(PokemonTypes).map(([types, typeName]) => {
              return (
                <button
                  key={types}
                  className={`min-w-[3rem] h-7 px-3 text-[0.75rem] md:text-[0.875rem] text-white leading-[1.75rem] rounded-full chip-type-${types.toLowerCase()} transition-all ${typeFilter && typeFilter === types ? 'opacity-100 scale-105 ring-2 ring-offset-1 md:ring-offset-2 ring-primary-2' : 'opacity-60 hover:opacity-80'}`}
                  onClick={handleClickSelectTypeFilter(types)}
                >
                  {typeName}
                </button>
              )
            })}
          </div>
        </li>
        <li className="flex flex-col md:flex-row md:items-start gap-2 md:gap-3 pb-2">
          <p className="text-primary-4 font-semibold text-[0.875rem] md:min-w-[4rem] md:pt-1">
            기술 유형
          </p>
          <div className="flex items-center gap-2 md:gap-3">
            <button
              className={`w-14 h-7 text-[0.75rem] leading-[1.75rem] rounded-lg bg-[#fd8181] text-white transition-all ${damageTypeFilter && damageTypeFilter === '물리' ? 'opacity-100 scale-105 ring-2 ring-offset-1 md:ring-offset-2 ring-[#fd8181]' : 'opacity-60 hover:opacity-80'}`}
              onClick={handleClickSelectDamageTypeFilter('물리')}
            >
              물리
            </button>
            <button
              className={`w-14 h-7 text-[0.75rem] leading-[1.75rem] rounded-lg bg-[#9b9bfa] text-white transition-all ${damageTypeFilter && damageTypeFilter === '특수' ? 'opacity-100 scale-105 ring-2 ring-offset-1 md:ring-offset-2 ring-[#9b9bfa]' : 'opacity-60 hover:opacity-80'}`}
              onClick={handleClickSelectDamageTypeFilter('특수')}
            >
              특수
            </button>
            <button
              className={`w-14 h-7 text-[0.75rem] leading-[1.75rem] rounded-lg bg-[#72d372] text-white transition-all ${damageTypeFilter && damageTypeFilter === '변화' ? 'opacity-100 scale-105 ring-2 ring-offset-1 md:ring-offset-2 ring-[#72d372]' : 'opacity-60 hover:opacity-80'}`}
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

export default MovesSearchAndFilter
