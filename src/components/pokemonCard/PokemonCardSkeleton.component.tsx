import { POKEMON_CARD_SIZE } from './PokemonCardShell.component'

/**
 * 포켓몬 카드 로딩 스켈레톤 (DS). 리스트 추가 로드(더보기/자동 로드) 중 그리드
 * 끝에 표시해 "카드가 올 자리"를 예약한다.
 *
 * PokemonCardShell과 크기 SSOT(POKEMON_CARD_SIZE)를 공유한다 — 로딩 자리와
 * 실카드 크기가 어긋나면 로드 완료 시 레이아웃이 밀려 CLS가 발생하므로,
 * 크기 규격은 한 곳에서만 가져온다. 셸의 rounded·좌측 card-accent 띠를 유지해
 * 카드 실루엣을 암시하고, 내부는 헤더/이미지/스탯 위치의 회색 pulse 블록.
 *
 * 장식 요소라 aria-hidden — "불러오는 중" 안내(role="status")는 리스트 컨테이너
 * 책임이다(스켈레톤 개수만큼 중복 낭독 방지).
 */

const PokemonCardSkeletonComponent = () => {
  return (
    <div className={POKEMON_CARD_SIZE.width} aria-hidden="true">
      <div
        className={`w-full ${POKEMON_CARD_SIZE.height} flex flex-col gap-3 rounded-[10px] border border-solid border-primary-2 bg-primary-2/30 p-2 desktop:p-3 shadow-[inset_10px_0_0_0_rgb(51_65_80)] animate-pulse`}
      >
        {/* 헤더 — 포켓볼 자리 + 이름 바 */}
        <div className="flex items-center gap-2">
          <span className="h-6 w-6 shrink-0 rounded-full bg-primary-3/40 desktop:h-8 desktop:w-8" />
          <span className="h-4 w-2/3 rounded bg-primary-3/40" />
        </div>
        {/* 이미지 자리 — 남는 공간 흡수(셸과 동일한 flex 구조) */}
        <div className="min-h-0 flex-1 rounded-lg bg-primary-3/30" />
        {/* 타입 태그 자리 */}
        <div className="flex gap-2">
          <span className="h-5 w-12 rounded-lg bg-primary-3/40" />
          <span className="h-5 w-12 rounded-lg bg-primary-3/40" />
        </div>
        {/* 스탯 자리 */}
        <div className="flex flex-col gap-1.5">
          <span className="h-3 w-full rounded bg-primary-3/30" />
          <span className="h-3 w-full rounded bg-primary-3/30" />
          <span className="h-3 w-5/6 rounded bg-primary-3/30" />
        </div>
      </div>
    </div>
  )
}

export default PokemonCardSkeletonComponent
