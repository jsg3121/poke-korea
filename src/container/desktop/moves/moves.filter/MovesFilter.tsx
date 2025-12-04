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
    <div className="w-full min-h-6 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <p className="w-fit text-[1rem] h-6 text-primary-4 leading-6 font-thin">
          총 <b className="font-[600]">{totalCount}</b>개의 기술을 볼 수 있어요!
        </p>
        <div className="flex items-center gap-4">
          <button
            className={`flex gap-1 items-center text-primary-4 text-[0.8rem] ${!isActiveFilter && 'disabled:grayscale disabled:opacity-50'}`}
            disabled={!isActiveFilter}
            onClick={handleClickResetFilter}
          >
            선택 필터 초기화
          </button>
          <button
            aria-pressed={isFilterOpen}
            className="flex gap-1 items-center text-primary-4"
            onClick={handleClickToggleFilter}
          >
            필터 조건 {isFilterOpen ? '닫기' : '열기'}
          </button>
        </div>
      </div>

      <ul
        className={`w-full flex gap-3 flex-col transition-all duration-300 ${!isFilterOpen ? 'h-0 opacity-0' : 'h-auto opacity-100'} overflow-hidden`}
      >
        <li className="flex items-start gap-3">
          <p className="text-primary-4 font-semibold min-w-[4rem] pt-1">
            기술 타입
          </p>
          <div className="flex items-center flex-wrap gap-2 flex-1">
            {Object.entries(PokemonTypes).map(([types, typeName]) => {
              return (
                <button
                  key={types}
                  className={`min-w-[3rem] h-7 px-3 text-[0.875rem] text-white leading-[1.75rem] rounded-full chip-type-${types.toLowerCase()} transition-all ${typeFilter && typeFilter === types ? 'opacity-100 scale-105 ring-2 ring-offset-2 ring-primary-2' : 'opacity-60 hover:opacity-80'}`}
                  onClick={handleClickSelectTypeFilter(types)}
                >
                  {typeName}
                </button>
              )
            })}
          </div>
        </li>
        <li className="flex items-start gap-3">
          <p className="text-primary-4 font-semibold min-w-[4rem] pt-1">
            기술 유형
          </p>
          <div className="flex items-center gap-3">
            <button
              className={`w-14 h-7 leading-[1.75rem] rounded-lg bg-[#fd8181] text-white transition-all ${damageTypeFilter && damageTypeFilter === '물리' ? 'opacity-100 scale-105 ring-2 ring-offset-2 ring-[#fd8181]' : 'opacity-60 hover:opacity-80'}`}
              onClick={handleClickSelectDamageTypeFilter('물리')}
            >
              물리
            </button>
            <button
              className={`w-14 h-7 leading-[1.75rem] rounded-lg bg-[#9b9bfa] text-white transition-all ${damageTypeFilter && damageTypeFilter === '특수' ? 'opacity-100 scale-105 ring-2 ring-offset-2 ring-[#9b9bfa]' : 'opacity-60 hover:opacity-80'}`}
              onClick={handleClickSelectDamageTypeFilter('특수')}
            >
              특수
            </button>
            <button
              className={`w-14 h-7 leading-[1.75rem] rounded-lg bg-[#72d372] text-white transition-all ${damageTypeFilter && damageTypeFilter === '변화' ? 'opacity-100 scale-105 ring-2 ring-offset-2 ring-[#72d372]' : 'opacity-60 hover:opacity-80'}`}
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
