'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useDebounce } from '~/hook/useDebounce'

interface AbilitySearchProps {
  totalCount: number
}

const AbilitySearchComponent = ({ totalCount }: AbilitySearchProps) => {
  const params = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const searchParam = params.get('search') || ''

  const [debouncedKeyword, debounce] = useDebounce()

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

  return (
    <div className="w-full flex flex-col gap-3 mb-6">
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            type="search"
            onChange={handleChangeSearch}
            placeholder="특성 이름으로 검색하세요"
            className="w-full h-12 px-4 border-2 border-solid border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          총{' '}
          <strong className="font-semibold text-gray-900">{totalCount}</strong>
          개의 특성을 볼 수 있어요!
        </p>
        {searchParam && (
          <p className="text-sm text-blue-600">
            &quot;{searchParam}&quot; 검색 결과
          </p>
        )}
      </div>
    </div>
  )
}

export default AbilitySearchComponent
