'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { ChampionsPokemonSort } from '~/graphql/typeGenerated'
import SelectInput from '~/components/input/SelectInput.component'

type SortQueryValue = 'usage' | 'dex'

const SORT_OPTIONS: Array<{ value: SortQueryValue; label: string }> = [
  { value: 'usage', label: '순위순' },
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

  const handleChangeSort = (value: SortQueryValue) => {
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
    <SelectInput
      label="정렬 기준 선택"
      visuallyHiddenLabel
      value={currentValue}
      options={SORT_OPTIONS}
      onChange={handleChangeSort}
    />
  )
}

export default ChampionsPokedexSortSelect
