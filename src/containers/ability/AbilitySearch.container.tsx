'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { useDebouncedCallback } from '~/hooks/useDebounce'
import SearchInput from '~/components/input/SearchInput.component'

interface AbilitySearchProps {
  totalCount: number
}

const AbilitySearch = ({ totalCount }: AbilitySearchProps) => {
  const params = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const updateSearchParams = useDebouncedCallback((value: string) => {
    const queryString = new URLSearchParams(params.toString())
    const trimmedValue = value.trim()

    if (trimmedValue) {
      queryString.set('search', trimmedValue)
    } else {
      queryString.delete('search')
    }

    const search = queryString.toString()
    router.replace(search ? `${pathname}?${search}` : pathname, {
      scroll: false,
    })
  })

  return (
    <div className="sticky top-12 z-30 -mx-4 flex flex-col gap-2 bg-primary-1 px-4 pb-3 pt-4 desktop:top-30">
      <SearchInput
        label="특성 이름으로 검색"
        placeholder="특성 이름으로 검색하세요"
        defaultValue={params.get('search') || ''}
        onChange={updateSearchParams}
      />
      <p className="text-sm text-primary-3">
        총{' '}
        <strong className="text-base font-semibold text-primary-4 desktop:text-lg">
          {totalCount}
        </strong>
        개의 특성을 볼 수 있어요!
      </p>
    </div>
  )
}

export default AbilitySearch
