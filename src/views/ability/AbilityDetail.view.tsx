'use client'

import PokemonByAbilityContainer from '~/container/ability/PokemonByAbility.container'
import { Ability, PokemonWithAbility } from '~/graphql/typeGenerated'

/**
 * 특성별 포켓몬 뷰 (반응형 단일 — UX-007). 데/모 2벌(AbilityDetail.desktop/.mobile)의
 * 콘텐츠를 대체한다. UA 분기·display:none 없이 CSS(desktop:)만으로 반응(ADR-0007).
 *
 * 크롬(전역 헤더/푸터/탭바) 선택은 호출부(page.tsx) 책임 — list 뷰와 동일 패턴.
 */

interface AbilityDetailViewProps {
  abilityId: number
  initialAbility: Ability
  initialPokemon: Array<PokemonWithAbility>
  totalCount: number
}

const AbilityDetailView = ({
  abilityId,
  initialAbility,
  initialPokemon,
  totalCount,
}: AbilityDetailViewProps) => {
  return (
    <PokemonByAbilityContainer
      abilityId={abilityId}
      initialAbility={initialAbility}
      initialPokemon={initialPokemon}
      totalCount={totalCount}
    />
  )
}

export default AbilityDetailView
