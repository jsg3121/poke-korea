import DetailMovesHeroContainer from '~/container/detail/moves/DetailMovesHero.container'
import DetailMovesListContainer from '~/container/detail/moves/DetailMovesList.container'
import DetailMovesStickyNavContainer from '~/container/detail/moves/DetailMovesStickyNav.container'

/**
 * 습득 기술 페이지 뷰 (반응형 단일 — UX-006). 데/모 2벌(DetailMoves.desktop/mobile)의
 * 콘텐츠를 대체한다. UA 분기·display:none 없이 CSS(desktop:)만으로 반응(ADR-0007).
 *
 * IA: 요약 히어로(식별 정보 + 폼 전환) → sticky 크롬 블록(학습법 탭 + 버전 선택
 * nav) → 습득 기술 표(현재 학습법 한 종류). 레벨업/기술머신은 path 분리
 * (/moves ↔ /moves/machine)라 한 페이지에 한 종류만 노출한다 — 토글·동시 노출 폐기.
 *
 * 광고 배너는 이 페이지에서 일단 제거(리스트·상세 개편과 동일한 사용자 결정) — UA
 * 분기 없는 반응형 광고 유닛이 정해지면 재도입한다. 크롬(헤더/푸터/탭바) 선택은
 * 호출부(page) 책임. 상태(폼·버전·학습법)는 DetailMovesProvider(호출부 주입).
 */

interface DetailMovesViewProps {
  pokemonName: string
}

const DetailMovesView = ({ pokemonName }: DetailMovesViewProps) => {
  return (
    <>
      <h1 className="sr-only">
        {pokemonName.replace('_', ' ')} 상세 습득 기술 정보
      </h1>
      <div className="flex w-full flex-col gap-5 py-6 desktop:gap-6 desktop:py-8">
        <DetailMovesHeroContainer />
        <DetailMovesStickyNavContainer />
        <div className="w-full px-4 desktop:mx-auto desktop:max-w-7xl">
          <DetailMovesListContainer />
        </div>
      </div>
    </>
  )
}

export default DetailMovesView
