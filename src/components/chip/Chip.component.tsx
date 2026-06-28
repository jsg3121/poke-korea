import { ChipColor, getChipClass } from './chipStyle'

/**
 * 칩 (DS 원자). 라벨 + 색을 가진 작은 라벨/필터 칩.
 *
 * - color 있음 → 데미지 유형(물리/특수/변화) 색 칩. 없으면 기본(무색) 칩(세대 칩 등).
 * - clickable=false(기본) → 순수 표시. `<span>`으로 렌더(포커스 안 됨).
 * - clickable=true → 클릭 가능. `<button>`으로 렌더(키보드 포커스·Enter/Space 기본 제공).
 *   active로 선택 상태를, hover/focus로 피드백을 표현한다.
 *
 * clickable 칩을 그룹 배치할 때는 상위(필터 컴포넌트)가 항목 간격 24px 이상을 확보해야
 * 한다(터치타겟, chipStyle 주석 참조). 그룹 시맨틱(role 등)도 상위 책임이다.
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
