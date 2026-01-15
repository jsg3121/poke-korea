'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from '~/hook/useDebounce'

const FilterSearchComponent = () => {
  const params = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const updateSearchParams = useDebouncedCallback((value: string) => {
    const queryString = new URLSearchParams(params)
    const trimmedValue = value.trim()

    if (trimmedValue) {
      queryString.set('search', trimmedValue)
    } else {
      queryString.delete('search')
    }

    router.replace(`${pathname}?${queryString}`, { scroll: false })
  })

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSearchParams(e.target.value)
  }

  return (
    <input
      type="search"
      name="move search"
      onChange={handleChangeSearch}
      defaultValue={params.get('search') || ''}
      placeholder="기술 이름으로 검색하세요"
      className="w-full h-12 px-4 border-2 border-solid border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none"
    />
  )
}

export default FilterSearchComponent
