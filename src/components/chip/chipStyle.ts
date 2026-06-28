/**
 * Chip 스타일 (DS 원자). 라벨 + 색을 가진 작은 칩의 시각 규격.
 *
 * 하나의 Chip으로 여러 칩 케이스를 포괄한다([[ds-build-new-components]]):
 * - color 있음 → 데미지 유형(물리/특수/변화) 색 칩
 * - color 없음 → 기본(무색) 칩. 세대 칩처럼 색 없는 라벨 칩.
 *
 * 색은 등록된 토큰만 사용한다(임의값 금지, styling.md).
 * - 데미지 색: damage-physical/special/status 토큰(글자 primary-1) — 기존 badge-damage
 *   유틸과 동일 색을 컴포넌트로 재사용한다.
 * - 기본 칩: 세대 칩 현재값(bg-primary-3 + 흰 글자)을 따른다.
 *
 * 포켓몬 타입(불꽃/물 등 18종) 라벨은 Tag 컴포넌트가 담당한다 — Chip과 역할이 다르다.
 */

export type ChipColor = 'physical' | 'special' | 'status'

/**
 * 공통 베이스 (레이아웃·트랜지션·줄바꿈 방지).
 *
 * 높이 h-7(28px). 칩은 슬림한 게 일반적이라 버튼의 44px을 강제하지 않는다. clickable로
 * 쓸 때 28px은 WCAG 2.2 2.5.8(AA, 24px)을 넘되 44px엔 못 미치므로, "항목 중심 간격 24px
 * 이상 확보"가 전제다(ADR-0011의 슬림 인터랙티브 예외를 칩으로 확장). 따라서 clickable
 * 칩을 그룹으로 배치하는 상위(필터 컴포넌트)에서 항목 간 간격(gap)을 24px 이상 둬야 한다.
 */
const BASE_CLASS =
  'inline-flex items-center justify-center px-3 h-7 rounded-lg text-sm font-medium whitespace-nowrap transition-all'

/** color별 배경/글자 — 정적 매핑(purge 안전). 없을 때는 DEFAULT_COLOR_CLASS 사용 */
const COLOR_CLASS: Record<ChipColor, string> = {
  physical: 'bg-damage-physical text-primary-1',
  special: 'bg-damage-special text-primary-1',
  status: 'bg-damage-status text-primary-1',
}

/** 색이 없을 때 기본 칩(세대 칩 현재값) */
const DEFAULT_COLOR_CLASS = 'bg-primary-3 text-white'

/**
 * clickable일 때 상태 스타일.
 * - active: 선택됨 강조(확대 + 불투명)
 * - inactive: 살짝 흐리게, hover로 복귀(필터 칩 관례)
 * 표시 전용(clickable=false)에는 이 스타일을 적용하지 않는다.
 */
const CLICKABLE_ACTIVE_CLASS = 'opacity-100 scale-105'
const CLICKABLE_INACTIVE_CLASS =
  'opacity-60 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-4'

interface ChipStyleParams {
  color?: ChipColor
  clickable?: boolean
  active?: boolean
}

/** color·clickable·active로 칩 클래스 문자열을 조합한다. */
export const getChipClass = ({
  color,
  clickable = false,
  active = false,
}: ChipStyleParams): string =>
  [
    BASE_CLASS,
    color ? COLOR_CLASS[color] : DEFAULT_COLOR_CLASS,
    clickable
      ? `cursor-pointer ${active ? CLICKABLE_ACTIVE_CLASS : CLICKABLE_INACTIVE_CLASS}`
      : '',
  ]
    .filter(Boolean)
    .join(' ')
