'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useContext } from 'react'
import { MovesContext } from '~/context/Moves.context'

const FilterHeaderComponent = () => {
  const params = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const { totalCount } = useContext(MovesContext)
  const typeFilter = params.get('typeFilter')
  const damageTypeFilter = params.get('damageTypeFilter')
  const searchFilter = params.get('search')
  const firstGenerationId = params.get('firstGenerationId')
  const isActiveFilter = !!(
    typeFilter ||
    damageTypeFilter ||
    searchFilter ||
    firstGenerationId
  )

  const handleClickResetFilter = () => {
    router.replace(pathname)
  }

  return (
    <header className="flex justify-between items-center md:my-2">
      <p className="text-base text-primary-3 md:text-primary-4 leading-6">
        총{' '}
        <strong className="text-base font-semibold text-primary-4">
          {totalCount}
        </strong>
        개의 기술을 볼 수 있어요!
      </p>
      <div className="flex items-center gap-3 md:gap-4">
        <button
          className={`flex gap-1 items-center text-primary-4 text-base md:text-base ${!isActiveFilter && 'disabled:grayscale disabled:opacity-50'}`}
          disabled={!isActiveFilter}
          onClick={handleClickResetFilter}
        >
          초기화
        </button>
      </div>
    </header>
  )
}

export default FilterHeaderComponent
