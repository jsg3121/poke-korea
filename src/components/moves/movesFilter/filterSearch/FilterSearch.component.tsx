'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useDebounce } from '~/hook/useDebounce'

const FilterSearchComponent = () => {
  const params = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const queryString = new URLSearchParams(params)

  const [debouncedKeyword, debounce] = useDebounce()

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    debounce(value)
  }

  useEffect(() => {
    const trimmedKeyword = debouncedKeyword.trim()

    if (trimmedKeyword) {
      queryString.set('search', trimmedKeyword)
    }

    if (trimmedKeyword === '') {
      queryString.delete('search')
    }

    router.replace(`${pathname}?${queryString}`, { scroll: false })
  }, [debouncedKeyword])

  return (
    <input
      type="search"
      onChange={handleChangeSearch}
      defaultValue={queryString.get('search') || ''}
      placeholder="기술 이름으로 검색하세요"
      className="w-full h-12 px-4 border-2 border-solid border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none"
    />
  )
}

export default FilterSearchComponent
