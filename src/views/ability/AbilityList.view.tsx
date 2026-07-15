'use client'

import AbilityListContainer from '~/container/ability/AbilityList.container'
import { Ability } from '~/graphql/typeGenerated'

/**
 * 특성 도감 목록 뷰 (반응형 단일 — UX-007). 데/모 2벌(AbilityList.desktop/.mobile)의
 * 콘텐츠를 대체한다. UA 분기·display:none 없이 CSS(desktop:)만으로 반응(ADR-0007).
 *
 * 크롬(전역 헤더/푸터/탭바) 선택은 호출부(page.tsx) 책임 — list 뷰와 동일 패턴.
 */

interface AbilityListViewProps {
  initialAbilities: Array<Ability>
  totalCount: number
}

const AbilityListView = ({
  initialAbilities,
  totalCount,
}: AbilityListViewProps) => {
  return (
    <AbilityListContainer
      initialAbilities={initialAbilities}
      totalCount={totalCount}
    />
  )
}

export default AbilityListView
