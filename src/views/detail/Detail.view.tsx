import DetailBottomBanner from '~/components/adSlot/DetailBottomBanner'
import DetailSkillsBanner from '~/components/adSlot/DetailSkillsBanner'
import DetailStatsBanner from '~/components/adSlot/DetailStatsBanner'
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
 * 스탯(StatBar) → [광고 지점1] → 기본정보|특성(+특성 퀴즈 CTA) → 전용기 →
 * 습득 기술 → [광고 지점2] → 타입 상성(+상성 퀴즈 CTA) → 진화 체인 → [광고 지점3].
 * 폼 상태는 DetailProvider(호출부 주입).
 *
 * 광고(RES-004 재도입): 콘텐츠 소비 후 섹션 사이 3지점. 폴드 상단(히어로)엔 두지
 * 않는다(모바일 상단 배너 CTR 0.06% vs 하단 2.02%, 34배 차이 실측). 기기별 성과
 * 분리 추적을 위해 각 광고 컴포넌트가 내부에서 useDevice(서버 주입 isMobile)로
 * 모바일/데스크톱 슬롯을 나눠 렌더한다 — 미노출 유닛의 숨김 렌더는 AdSense 정책
 * 위반이라 CSS 분기 대신 조건부 렌더를 쓴다. 지점1·2는 320×100/728×90 고정(높이
 * 예측), 지점3은 검증된 반응형 슬롯 재사용. 크롬 선택은 호출부 책임.
 */

interface DetailViewProps {
  prevPokemon: AdjacentPokemon | null
  nextPokemon: AdjacentPokemon | null
  /** 진화 체인 번호+이름 (컨텍스트엔 id뿐이라 호출부가 경량 조회해 주입) */
  evolutionPokemons: Array<AdjacentPokemon>
}

const DetailView = ({
  prevPokemon,
  nextPokemon,
  evolutionPokemons,
}: DetailViewProps) => {
  return (
    <>
      {/* 종 내비는 히어로 그라데이션 위 오버레이(사용자 결정) — 헤더와 히어로 사이 공백 제거 */}
      <DetailHeroContainer
        prevPokemon={prevPokemon}
        nextPokemon={nextPokemon}
      />
      <div className="flex w-full flex-col gap-5 desktop:gap-8">
        <DetailFormRowContainer />
        <DetailStatsContainer />
        <div className="flex w-full flex-col gap-5 px-4 desktop:mx-auto desktop:max-w-7xl desktop:gap-8">
          {/* 지점1: 능력치 소비 직후 */}
          <DetailStatsBanner />
          <DetailInfoSectionContainer />
          <DetailExclusiveMovesContainer />
          <DetailSkillsContainer />
          {/* 지점2: 습득 기술 표 소비 직후 */}
          <DetailSkillsBanner />
          <DetailTypeMatchupContainer />
          <DetailEvolutionContainer evolutionPokemons={evolutionPokemons} />
          {/* 지점3: 콘텐츠 최하단(과거 수익 1위 위치). 모바일 하단 탭바와는
              페이지 크롬의 여백으로 분리된다. */}
          <DetailBottomBanner />
        </div>
      </div>
    </>
  )
}

export default DetailView
