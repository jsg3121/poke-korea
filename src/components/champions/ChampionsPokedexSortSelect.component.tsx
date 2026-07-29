'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChampionsPokemonSort } from '~/graphql/typeGenerated'

type SortQueryValue = 'usage' | 'dex'

// 데이터 원천이 실게임(championsbattledata)으로 바뀌며 사용률 %는 제공되지 않고
// 채택 순위(usageRank)만 내려온다. 정렬 기준은 순위/도감번호 두 가지를 유지하되,
// 라벨을 '사용률순'→'순위순'으로 정정해 실제 데이터와 정합화한다.
// (쿼리값 'usage'는 백엔드 정렬 인자 하위호환을 위해 유지)
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
        className="bg-primary-4 text-primary-1 border border-solid border-primary-1 rounded-md px-2 py-1 text-xs font-bold cursor-pointer hover:bg-primary-3 transition-colors"
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
