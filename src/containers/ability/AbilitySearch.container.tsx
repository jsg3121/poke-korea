'use client'

import { useSearchParamInput } from '~/hooks/useSearchParamInput'
import SearchInput from '~/components/input/SearchInput.component'

interface AbilitySearchProps {
  totalCount: number
}

const AbilitySearch = ({ totalCount }: AbilitySearchProps) => {
  const { keyword, updateKeyword } = useSearchParamInput('search')

  const handleChangeKeyword = (value: string) => {
    updateKeyword(value)
  }

  return (
    <div className="sticky top-12 z-30 -mx-4 flex flex-col gap-2 bg-primary-1 px-4 pb-3 pt-4 desktop:top-30">
      <SearchInput
        label="특성 이름으로 검색"
        placeholder="특성 이름으로 검색하세요"
        value={keyword}
        onChange={handleChangeKeyword}
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
