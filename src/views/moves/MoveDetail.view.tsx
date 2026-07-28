'use client'

import MoveDetailHeroContainer from '~/container/moves/MoveDetailHero.container'
import MoveDetailVersionNavContainer from '~/container/moves/MoveDetailVersionNav.container'
import PokemonBySkillListContainer from '~/container/moves/PokemonBySkillList.container'
import {
  PokemonLearnInfo,
  PokemonSkillDetail,
  VersionGroup,
} from '~/graphql/typeGenerated'

/**
 * 기술 상세 뷰 (반응형 단일 — UX-008). 데/모 2벌(MoveDetail.desktop/.mobile)의
 * 콘텐츠를 대체한다. UA 분기·display:none 없이 CSS(desktop:)만으로 반응(ADR-0007).
 *
 * 섹션 순서: 미니 히어로(뒤로가기+기술 정보) → 버전 nav(sticky, 전체 폭 배경) →
 * 기술별 포켓몬 그리드. 버전 nav가 전체 폭 sticky라 히어로/그리드와 달리 gutter
 * 래핑 밖에 두고, 나머지는 max-w-[1280px]+px-4로 가둔다.
 *
 * /moves/[id]와 /moves/[id]/version/[versionGroupId]가 이 뷰를 공유한다 —
 * selectedVersionGroupId 유무만 다르다(구버전 optional prop 패턴 승계).
 * 크롬(전역 헤더/푸터/탭바) 선택은 호출부(page.tsx) 책임 — ability 뷰와 동일 패턴.
 */

interface MoveDetailViewProps {
  skillId: number
  initialSkill: PokemonSkillDetail
  initialPokemonList: Array<PokemonLearnInfo>
  totalCount: number
  selectedVersionGroupId?: number
  versionGroups?: Array<VersionGroup> | null
}

const MoveDetailView = ({
  skillId,
  initialSkill,
  initialPokemonList,
  totalCount,
  selectedVersionGroupId,
  versionGroups,
}: MoveDetailViewProps) => {
  return (
    <>
      <div className="w-full max-w-[1280px] mx-auto px-4 py-6">
        <MoveDetailHeroContainer
          skillData={initialSkill}
          selectedVersionGroupId={selectedVersionGroupId}
          learnablePokemonCount={totalCount}
          versionGroups={versionGroups}
        />
      </div>

      <MoveDetailVersionNavContainer
        skillId={skillId}
        versionGroups={versionGroups}
        selectedVersionGroupId={selectedVersionGroupId}
      />

      <div className="w-full max-w-[1280px] mx-auto px-4 py-6 pb-8">
        <PokemonBySkillListContainer
          skillId={skillId}
          initialPokemonList={initialPokemonList}
          totalCount={totalCount}
          selectedVersionGroupId={selectedVersionGroupId}
        />
      </div>
    </>
  )
}

export default MoveDetailView
