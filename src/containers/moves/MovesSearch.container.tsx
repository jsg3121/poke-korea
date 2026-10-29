'use client'

import { useSearchParamInput } from '~/hooks/useSearchParamInput'
import SearchInput from '~/components/input/SearchInput.component'

interface MovesSearchProps {
  totalCount: number
}

const MovesSearch = ({ totalCount }: MovesSearchProps) => {
  const { keyword, updateKeyword } = useSearchParamInput('search')

  const handleChangeKeyword = (value: string) => {
    updateKeyword(value)
  }

  return (
    <div className="flex flex-col gap-2">
      <SearchInput
        label="기술 이름으로 검색"
        placeholder="기술 이름으로 검색하세요"
        value={keyword}
        onChange={handleChangeKeyword}
      />
      <p className="text-sm text-primary-3">
        총{' '}
        <strong className="text-base font-semibold text-primary-4 desktop:text-lg">
          {totalCount}
        </strong>
        개의 기술을 볼 수 있어요!
      </p>
    </div>
  )
}

export default MovesSearch
