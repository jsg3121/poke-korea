import { ChipColor } from './chip.types'

/**
 * 공통 베이스 (레이아웃·트랜지션·줄바꿈 방지).
 *
 * 높이 h-7(28px). 칩은 슬림한 게 일반적이라 버튼의 44px을 강제하지 않는다. clickable로
 * 쓸 때 28px은 WCAG 2.2 2.5.8(AA, 24px)을 넘되 44px엔 못 미치므로, "항목 중심 간격 24px
 * 이상 확보"가 전제다. 따라서 clickable 칩을 그룹으로 배치하는 상위(필터 컴포넌트)에서
 * 항목 간 간격(gap)을 24px 이상 둬야 한다.
 */
// text-aligned-md: Gmarket Sans는 글리프가 위로 치우쳐 line-height가 높이+2px
// (h-7 28→30px)이어야 수직 중앙에 온다(globals.css 유틸). 이 보정은 flex의
// items-center와 상쇄되므로(라인박스가 통째로 재중앙화) inline-block 블록 흐름으로
// 라인박스를 상단에 고정해 line-height가 글리프 위치를 제어하게 한다.
const BASE_CLASS =
  'inline-block px-3 h-7 rounded-lg text-sm text-aligned-md font-medium whitespace-nowrap transition-all'

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
const getChipClass = ({
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

/**
 * 칩 (DS 원자). 라벨 + 색을 가진 작은 라벨/필터 칩.
 *
 * - color 있음 → 데미지 유형(물리/특수/변화) 색 칩. 없으면 기본(무색) 칩(세대 칩 등).
 * - clickable=false(기본) → 순수 표시. `<span>`으로 렌더(포커스 안 됨).
 * - clickable=true → 클릭 가능. `<button>`으로 렌더(키보드 포커스·Enter/Space 기본 제공).
 *   active로 선택 상태를, hover/focus로 피드백을 표현한다.
 *
 * clickable 칩을 그룹 배치할 때는 상위(필터 컴포넌트)가 항목 간격 24px 이상을 확보해야
 * 한다(BASE_CLASS 주석 참조). 그룹 시맨틱(role 등)도 상위 책임이다.
 *
 * 포켓몬 타입(불꽃/물 등 18종) 라벨은 Tag 컴포넌트가 담당한다 — Chip과 역할이 다르다.
 */

interface ChipBaseProps {
  /** 표시 텍스트 (예: '물리', '1세대') */
  label: string
  /** 데미지 유형 색. 없으면 기본(무색) 칩 */
  color?: ChipColor
}

/** 표시 전용(기본) — span. active/onClick 불가(타입 차단) */
interface ChipDisplayProps extends ChipBaseProps {
  clickable?: false
  active?: never
  onClick?: never
}

/** 클릭형 — button. active/onClick 허용 */
interface ChipClickableProps extends ChipBaseProps {
  clickable: true
  active?: boolean
  onClick?: () => void
}

type ChipProps = ChipDisplayProps | ChipClickableProps

const ChipComponent = (props: ChipProps) => {
  const { label, color } = props

  // 표시 전용 — span (포커스/클릭 없음)
  if (!props.clickable) {
    return <span className={getChipClass({ color })}>{label}</span>
  }

  // 클릭형 — props가 ChipClickableProps로 좁혀져 active/onClick 구조분해 가능.
  // button(네이티브 포커스·키보드 동작 제공), 선택 상태는 aria-pressed로 노출.
  const { active = false, onClick } = props
  return (
    <button
      type="button"
      className={getChipClass({ color, clickable: true, active })}
      aria-pressed={active}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

export default ChipComponent
