'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import SearchInputComponent from '~/components/input/SearchInput.component'
import { useDebouncedCallback } from '~/hook/useDebounce'

/**
 * 특성 검색 영역 (반응형 단일). SearchInput DS 원자 + 결과 카운트.
 *
 * 검색 영역을 "특성이란?" 설명 블록보다 위로 승격하고(UX-007), 전역 헤더 아래에
 * 이어붙는 sticky(모바일 top-12=헤더 48px / 데스크톱 top-30=fixed 헤더)로 둔다 —
 * list의 FilterBar sticky 좌표 규칙과 동일. 스크롤해도 검색이 항상 손 닿는 곳에 있다.
 *
 * 입력은 URL query(?search=)만 갱신한다 — 목록 데이터 페칭(useAbilityList)이 이
 * query를 구독하므로 상태를 중복 보관하지 않는다(단일 진실원). 디바운스로 과도한
 * 라우팅을 막는다. 인풋 마크업은 SearchInput DS로 교체(구버전 gray/blue 비토큰 색 제거).
 */

interface AbilitySearchContainerProps {
  totalCount: number
}

const AbilitySearchContainer = ({
  totalCount,
}: AbilitySearchContainerProps) => {
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

  return (
    <div className="sticky top-12 z-30 -mx-4 flex flex-col gap-2 bg-primary-1 px-4 pb-3 pt-4 desktop:top-30">
      <SearchInputComponent
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

export default AbilitySearchContainer
