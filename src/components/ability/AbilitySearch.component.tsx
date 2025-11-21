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
    <div className="w-[calc(100%-2.5rem)] md:w-full mx-auto h-24 flex flex-col py-3 gap-2 sticky mb-6 top-16 md:top-40 bg-primary-1 z-10 shadow-[0px_10px_7px_-6px_#27374d] ">
      <div className="flex items-center gap-3">
        <div className="w-full relative">
          <input
            type="search"
            onChange={handleChangeSearch}
            placeholder="특성 이름으로 검색하세요"
            className="w-full h-12 px-4 border-2 border-solid border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-[0.75rem] text-primary-3">
          총{' '}
          <strong className="text-[1rem] font-semibold text-primary-4">
            {totalCount}
          </strong>
          개의 특성을 볼 수 있어요!
        </p>
      </div>
    </div>
  )
}

export default AbilitySearchComponent
