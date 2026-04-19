'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent } from 'react'
import ImageComponent from '~/components/Image.component'
import { getChangeTypeList } from '~/module/getChangeTypeList'
import { PokemonTypes } from '~/types/pokemonTypes.types'

interface TypeButtonProps {
  typeValue: string
  typeName: string
  checked: boolean
  disabled: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const TypeButton = ({
  typeValue,
  typeName,
  checked,
  disabled,
  onChange,
}: TypeButtonProps) => {
  return (
    <button
      className="group w-8 h-8 flex-shrink-0 text-center duration-200 ease-out cursor-pointer"
      aria-label={`포켓몬 필터 ${typeName}타입`}
    >
      <label
        htmlFor={`champions-mobile-type-${typeValue}`}
        className="w-8 h-8 opacity-60 grayscale drop-shadow-[1px_2px_0px_var(--color-black-1)] block has-[:checked]:opacity-100 has-[:checked]:grayscale-0 has-[:disabled]:opacity-20 cursor-pointer"
      >
        <input
          type="checkbox"
          id={`champions-mobile-type-${typeValue}`}
          disabled={disabled}
          value={typeValue}
          checked={checked}
          onChange={onChange}
          className="hidden"
        />
        <ImageComponent
          alt={`${typeName} 타입 필터 선택`}
          height="100%"
          width="100%"
          src={`/assets/type/${typeValue.toLowerCase()}.svg`}
          fetchPriority="high"
          imageSize={{
            width: 32,
            height: 32,
          }}
        />
      </label>
    </button>
  )
}

const ChampionsTypeFilterMobile = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const typeList = searchParams.get('type')?.split(',') ?? []

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
    <div className="w-[calc(100%-2.5rem)] mt-4 mx-auto">
      <div
        className="w-full h-16 bg-primary-4 rounded-[2rem] flex items-center gap-3 overflow-x-auto px-4"
        role="searchbox"
        aria-label="타입별 포켓몬 필터 검색"
      >
        {Object.entries(PokemonTypes).map(([types, typeName]) => {
          return (
            <TypeButton
              key={`champions-mobile-type-key-${types}`}
              onChange={handleClickTypeFilter}
              typeValue={types}
              typeName={typeName}
              checked={typeList.includes(types)}
              disabled={typeList.length === 2 && !typeList.includes(types)}
            />
          )
        })}
      </div>
      <div className="w-full flex justify-end mt-3 mb-4">
        <button
          className={`text-base ${isEmptyQuery ? 'text-primary-2' : 'text-primary-4'}`}
          onClick={handleClickReset}
          disabled={isEmptyQuery}
        >
          초기화
        </button>
      </div>
    </div>
  )
}

export default ChampionsTypeFilterMobile
