'use client'

import { ChangeEvent } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { PokemonTypes } from '~/types/pokemonTypes.types'
import { getChangeTypeList } from '~/modules/getChangeTypeList.module'
import TypeChip from '~/components/chip/TypeChip.component'

const MAX_TYPE_SELECTION = 2

const TYPE_ENTRIES = Object.entries(PokemonTypes) as Array<
  [string, PokemonTypes]
>

const ChampionsTypeFilter = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const typeList = searchParams.get('type')?.split(',').filter(Boolean) ?? []

  const handleClickTypeFilter = (e: ChangeEvent<HTMLInputElement>) => {
    const type = e.target.value
    const changeList = getChangeTypeList(typeList, type)
    const params = new URLSearchParams(searchParams)

    if (changeList.length > 0) {
      params.set('type', changeList)
    } else {
      params.delete('type')
    }

    router.replace(`${pathname}?${params.toString()}`)
  }

  const handleClickReset = () => {
    router.replace(pathname)
  }

  const isEmptyQuery = searchParams.size === 0

  return (
    <div
      role="search"
      aria-label="타입별 포켓몬 필터 검색"
      className="w-full h-full flex items-center relative gap-2"
    >
      <ul className="flex-1 min-w-0 flex items-start gap-2 overflow-x-auto py-1 desktop:overflow-visible desktop:justify-between [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {TYPE_ENTRIES.map(([value, name]) => {
          const active = typeList.includes(value)
          const disabled = !active && typeList.length >= MAX_TYPE_SELECTION
          return (
            <li key={`champions-type-filter-${value}`}>
              <TypeChip
                value={value}
                label={name}
                active={active}
                disabled={disabled}
                onChange={handleClickTypeFilter}
              />
            </li>
          )
        })}
      </ul>
      <button
        className="flex-shrink-0 text-primary-4 disabled:text-primary-2 text-xs whitespace-nowrap desktop:ml-4"
        onClick={handleClickReset}
        disabled={isEmptyQuery}
      >
        초기화
      </button>
    </div>
  )
}

export default ChampionsTypeFilter
