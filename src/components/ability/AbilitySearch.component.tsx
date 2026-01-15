'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from '~/hook/useDebounce'

interface AbilitySearchProps {
  totalCount: number
}

const AbilitySearchComponent = ({ totalCount }: AbilitySearchProps) => {
  const params = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const updateSearchParams = useDebouncedCallback((value: string) => {
    const queryString = new URLSearchParams(params)
    const trimmedValue = value.trim()

    if (trimmedValue) {
      queryString.set('search', trimmedValue)
      router.replace(`${pathname}?${queryString}`, { scroll: false })
    } else {
      queryString.delete('search')
      router.replace(`${pathname}`, { scroll: false })
    }
  })

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSearchParams(e.target.value)
  }

  return (
    <div className="w-[calc(100%-2.5rem)] md:w-full mx-auto h-24 flex flex-col py-3 gap-2 sticky mb-6 top-16 md:top-40 bg-primary-1 z-10 shadow-[0px_10px_7px_-6px_#27374d] ">
      <div className="flex items-center gap-3">
        <div className="w-full relative">
          <input
            type="search"
            onChange={handleChangeSearch}
            defaultValue={params.get('search') || ''}
            placeholder="특성 이름으로 검색하세요"
            className="w-full h-12 px-4 border-2 border-solid border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>
      <div className="flex-between">
        <p className="text-xs text-primary-3">
          총{' '}
          <strong className="text-base font-semibold text-primary-4">
            {totalCount}
          </strong>
          개의 특성을 볼 수 있어요!
        </p>
      </div>
    </div>
  )
}

export default AbilitySearchComponent
