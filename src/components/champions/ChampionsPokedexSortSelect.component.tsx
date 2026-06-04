'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChampionsPokemonSort } from '~/graphql/typeGenerated'

type SortQueryValue = 'usage' | 'dex'

const SORT_OPTIONS: Array<{ value: SortQueryValue; label: string }> = [
  { value: 'usage', label: '사용률순' },
  { value: 'dex', label: '도감번호순' },
]

const sortEnumToQuery = (sort: ChampionsPokemonSort): SortQueryValue => {
  return sort === ChampionsPokemonSort.DEX ? 'dex' : 'usage'
}

interface ChampionsPokedexSortSelectProps {
  currentSort: ChampionsPokemonSort
}

const ChampionsPokedexSortSelect = ({
  currentSort,
}: ChampionsPokedexSortSelectProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentValue = sortEnumToQuery(currentSort)

  const handleChange = (value: SortQueryValue) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'usage') {
      params.delete('sort')
    } else {
      params.set('sort', value)
    }
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  return (
    <label className="inline-flex items-center gap-2">
      <span className="sr-only">정렬 기준 선택</span>
      <select
        value={currentValue}
        onChange={(e) => handleChange(e.target.value as SortQueryValue)}
        className="bg-primary-4 text-primary-1 border-[2px] border-solid border-primary-1 rounded-md px-3 py-1.5 text-sm font-bold cursor-pointer hover:bg-primary-3 transition-colors"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export default ChampionsPokedexSortSelect
