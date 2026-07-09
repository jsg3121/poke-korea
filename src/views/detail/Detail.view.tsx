import DetailEvolutionContainer from '~/container/detail/DetailEvolution.container'
import DetailExclusiveMovesContainer from '~/container/detail/DetailExclusiveMoves.container'
import DetailFormRowContainer from '~/container/detail/DetailFormRow.container'
import DetailHeroContainer from '~/container/detail/DetailHero.container'
import DetailInfoSectionContainer from '~/container/detail/DetailInfoSection.container'
import DetailSkillsContainer from '~/container/detail/DetailSkills.container'
import { AdjacentPokemon } from '~/container/detail/DetailSpeciesNav.container'
import DetailStatsContainer from '~/container/detail/DetailStats.container'
import DetailTypeMatchupContainer from '~/container/detail/DetailTypeMatchup.container'

/**
 * 포켓몬 상세 뷰 (반응형 단일 — UX-005). 데/모 2벌(Detail.desktop/mobile)의
 * 콘텐츠를 대체한다. UA 분기·display:none 없이 CSS(desktop:)만으로 반응(ADR-0007).
 *
 * IA(§2·§7): 종 내비 → 히어로(식별 정보 승격) → 폼 로우(히어로 외부 분리) →
 * 스탯(StatBar) → 기본정보|특성(+특성 퀴즈 CTA) → 전용기 → 습득 기술 →
 * 타입 상성(+상성 퀴즈 CTA) → 진화 체인. 폼 상태는 DetailProvider(호출부 주입).
 *
 * 광고 배너는 이 페이지에서 일단 제거(리스트 개편과 동일한 사용자 결정) — UA 분기
 * 없는 반응형 광고 유닛이 정해지면 스탯 아래·최하단에 재도입한다. 크롬(헤더/푸터/
 * 탭바) 선택은 호출부(page) 책임.
 */

interface DetailViewProps {
  prevPokemon: AdjacentPokemon | null
  nextPokemon: AdjacentPokemon | null
}

const DetailView = ({ prevPokemon, nextPokemon }: DetailViewProps) => {
  return (
    <>
      {/* 종 내비는 히어로 그라데이션 위 오버레이(사용자 결정) — 헤더와 히어로 사이 공백 제거 */}
      <DetailHeroContainer
        prevPokemon={prevPokemon}
        nextPokemon={nextPokemon}
      />
      <div className="flex w-full flex-col gap-8 py-8">
        <DetailFormRowContainer />
        <DetailStatsContainer />
        <div className="flex w-full flex-col gap-8 px-4 desktop:mx-auto desktop:max-w-7xl">
          <DetailInfoSectionContainer />
          <DetailExclusiveMovesContainer />
          <DetailSkillsContainer />
          <DetailTypeMatchupContainer />
          <DetailEvolutionContainer />
        </div>
      </div>
    </>
  )
}

export default DetailView
