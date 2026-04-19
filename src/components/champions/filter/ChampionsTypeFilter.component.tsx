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
      className="group w-8 text-center duration-200 ease-out cursor-pointer hover:scale-[1.4] active:scale-120"
      aria-label={`포켓몬 필터 ${typeName}타입`}
    >
      <label
        htmlFor={`champions-type-${typeValue}`}
        className="w-8 h-8 opacity-60 grayscale drop-shadow-[1px_2px_0px_var(--color-black-1)] block has-[:checked]:opacity-100 has-[:checked]:grayscale-0 has-[:disabled]:opacity-20 cursor-pointer"
      >
        <input
          type="checkbox"
          id={`champions-type-${typeValue}`}
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
      <span
        className="field__tooltip w-0 h-0 overflow-hidden text-xs leading-5 text-center text-[#142129] bg-[#f3f6f7] rounded-lg absolute left-1/2 top-10 -translate-x-1/2 group-hover:w-12 group-hover:h-5 group-hover:opacity-100"
        role="tooltip"
      >
        {typeName}
      </span>
    </button>
  )
}

const ChampionsTypeFilter = () => {
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
    <div
      role="searchbox"
      aria-label="타입별 포켓몬 필터 검색"
      className="w-full max-w-[1280px] h-full flex items-center justify-between relative mx-auto px-5"
    >
      {Object.entries(PokemonTypes).map(([types, typeName]) => {
        return (
          <TypeButton
            key={`champions-type-key-${types}`}
            onChange={handleClickTypeFilter}
            typeValue={types}
            typeName={typeName}
            checked={typeList.includes(types)}
            disabled={typeList.length === 2 && !typeList.includes(types)}
          />
        )
      })}
      <button
        className="text-primary-4 disabled:text-primary-2"
        onClick={handleClickReset}
        disabled={isEmptyQuery}
      >
        초기화
      </button>
    </div>
  )
}

export default ChampionsTypeFilter
