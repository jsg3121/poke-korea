'use client'

import { Ability } from '~/graphql/typeGenerated'
import AbilityListContent from '~/containers/ability/AbilityListContent.container'

/**
 * 특성 도감 목록 뷰 (반응형 단일 — UX-007). 데/모 2벌(AbilityList.desktop/.mobile)의
 * 콘텐츠를 대체한다. UA 분기·display:none 없이 CSS(desktop:)만으로 반응(ADR-0007).
 *
 * 크롬(전역 헤더/푸터/탭바) 선택은 호출부(page.tsx) 책임 — list 뷰와 동일 패턴.
 */

interface AbilityListProps {
  initialAbilities: Array<Ability>
  totalCount: number
}

const AbilityList = ({ initialAbilities, totalCount }: AbilityListProps) => {
  return (
    <AbilityListContent
      initialAbilities={initialAbilities}
      totalCount={totalCount}
    />
  )
}

export default AbilityList
