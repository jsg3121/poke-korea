'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import SearchInputComponent from '~/components/input/SearchInput.component'
import { useDebouncedCallback } from '~/hook/useDebounce'

/**
 * 기술 검색 영역 (반응형 단일, UX-008). SearchInput DS 원자 + 결과 카운트.
 *
 * ability의 AbilitySearchContainer와 동형 — 검색은 목록의 1차 과업이라 필터보다
 * 위(승격)에 둔다. sticky는 이 컴포넌트가 아니라 상위(MovesList.container)가
 * 검색+필터바를 한 블록으로 묶어 담당한다(기술 목록은 필터바도 sticky 크롬에
 * 포함되는 구조라 ability와 달리 sticky 책임을 위로 올린다).
 *
 * 입력은 URL query(?search=)만 갱신한다 — 목록 데이터 페칭(page.tsx → MovesProvider)이
 * 이 query를 구독하므로 상태를 중복 보관하지 않는다(단일 진실원). 나머지 쿼리
 * (타입·분류·세대 필터)는 보존한다. 디바운스로 과도한 라우팅을 막는다.
 */

interface MovesSearchContainerProps {
  totalCount: number
}

const MovesSearchContainer = ({ totalCount }: MovesSearchContainerProps) => {
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
    <div className="flex flex-col gap-2">
      <SearchInputComponent
        label="기술 이름으로 검색"
        placeholder="기술 이름으로 검색하세요"
        defaultValue={params.get('search') || ''}
        onChange={updateSearchParams}
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

export default MovesSearchContainer
