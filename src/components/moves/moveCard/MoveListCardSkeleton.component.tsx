/**
 * 기술 목록 카드 로딩 스켈레톤 (DS). 리스트 추가 로드(무한스크롤) 중 그리드 끝에
 * 표시해 "카드가 올 자리"를 예약한다.
 *
 * MoveListCard와 크기·셸(bg-primary-4 / border-2 primary-1 / rounded-xl /
 * shadow 0 0 0 3px / p-3 / min-h-44)을 맞춘다 — 로딩 자리와 실카드 크기가
 * 어긋나면 로드 완료 시 레이아웃이 밀려 CLS가 발생한다. AbilityCardSkeleton과
 * 내부 구성(스탯 3분할)이 달라 재사용하지 않고 별도로 둔다.
 *
 * 장식 요소라 aria-hidden — "불러오는 중" 안내(role="status")는 리스트 컨테이너
 * 책임이다(스켈레톤 개수만큼 중복 낭독 방지).
 */

const MoveListCardSkeletonComponent = () => {
  return (
    <div
      className="w-full min-h-44 bg-primary-4 border-2 border-solid border-primary-1 rounded-xl shadow-[0_0_0_3px_var(--color-primary-4)] p-3 animate-pulse"
      aria-hidden="true"
    >
      {/* 헤더 — {id}. 기술명 + 배지 자리 + 하단 구분선 */}
      <div className="mb-3 flex items-start justify-between gap-2 border-b border-solid border-primary-1 pb-2">
        <span className="block h-6 w-1/2 rounded bg-primary-3/50" />
        <span className="block h-6 w-1/4 rounded bg-primary-3/40" />
      </div>
      {/* 위력/명중률/PP 3분할 자리 */}
      <div className="grid grid-cols-3 gap-2">
        <span className="block h-12 rounded bg-primary-3/40" />
        <span className="block h-12 rounded bg-primary-3/40" />
        <span className="block h-12 rounded bg-primary-3/40" />
      </div>
    </div>
  )
}

export default MoveListCardSkeletonComponent
