'use client'

import MovesListContainer from '~/container/moves/MovesList.container'

/**
 * 기술 도감 목록 뷰 (반응형 단일 — UX-008). 데/모 2벌(Moves.desktop/.mobile)의
 * 콘텐츠를 대체한다. UA 분기·display:none 없이 CSS(desktop:)만으로 반응(ADR-0007).
 *
 * 데이터는 호출부(page.tsx)의 MovesProvider(context)가 공급하므로 props가 없다.
 * 크롬(전역 헤더/푸터/탭바) 선택은 호출부(page.tsx) 책임 — ability 뷰와 동일 패턴.
 */

const MovesListView = () => {
  return <MovesListContainer />
}

export default MovesListView
