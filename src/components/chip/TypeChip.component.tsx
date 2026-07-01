import { ChangeEventHandler } from 'react'
import ImageComponent from '~/components/Image.component'

/**
 * 타입 필터 칩 (DS 원자). 포켓몬 18종 타입 중 하나를 나타내는 **선택 가능한 아이콘 토글**.
 *
 * 텍스트 Chip/Tag와 역할이 다르다 — 이건 타입 아이콘(SVG)을 grayscale↔컬러로 토글하는
 * 인터랙티브 필터 컨트롤이다(다중 선택 가능 → checkbox 시맨틱). 색 라벨 표시용 Chip과
 * 구분해 별도 원자로 둔다.
 *
 * 라벨(타입명) 노출은 CSS 반응형 단일로 통합한다(데/모 2벌 → 단일, ADR-0007):
 * - 모바일(base): 아이콘 하단에 라벨 항상 표시
 * - 데스크톱(`desktop:`): 라벨은 기본 숨김, hover/focus-visible 시에만 노출
 *
 * 라벨 텍스트는 시각 숨김 상태에서도 DOM에 유지돼 스크린리더가 항상 읽는다(접근성).
 * 상태: active(선택됨=컬러), disabled(2개 선택 시 나머지 잠금=흐림). 색·크기는 토큰만 사용.
 */

interface TypeChipProps {
  /** 타입 식별자 (예: 'FIRE') — 폼 value 및 아이콘 파일명(소문자)로 사용 */
  value: string
  /** 타입 표시명 (예: '불꽃') */
  label: string
  /** 선택 여부 */
  active: boolean
  /** 잠금 여부 (예: 최대 선택 수 도달 시 미선택 항목) */
  disabled?: boolean
  onChange: ChangeEventHandler<HTMLInputElement>
}

const TypeChipComponent = ({
  value,
  label,
  active,
  disabled = false,
  onChange,
}: TypeChipProps) => {
  const id = `type-chip-${value.toLowerCase()}`
  return (
    <label
      htmlFor={id}
      className="group inline-flex w-14 shrink-0 cursor-pointer flex-col items-center gap-1 has-[:disabled]:cursor-not-allowed"
    >
      <input
        id={id}
        type="checkbox"
        value={value}
        checked={active}
        disabled={disabled}
        onChange={onChange}
        className="sr-only peer"
        aria-label={`${label} 타입 필터`}
      />
      {/* 아이콘 — 미선택은 흐린 흑백, 선택 시 컬러. 잠금 시 더 흐림.
          hover/focus 시 살짝 확대(라벨은 흔들리지 않게 아이콘 span에만). 잠금(disabled)
          상태에선 peer-enabled 조건으로 확대를 막는다 */}
      <span className="block h-8 w-8 grayscale opacity-40 drop-shadow-[1px_2px_0px_var(--color-black-1)] transition-[filter,opacity,transform] peer-enabled:group-hover:scale-110 peer-checked:grayscale-0 peer-checked:opacity-100 peer-focus-visible:opacity-100 peer-focus-visible:scale-110 peer-disabled:opacity-20 peer-disabled:grayscale">
        <ImageComponent
          alt=""
          aria-hidden="true"
          src={`/assets/type/${value.toLowerCase()}.svg`}
          width="100%"
          height="100%"
          imageSize={{ width: 32, height: 32 }}
        />
      </span>
      {/* 라벨 — 모바일 항상 표시, 데스크톱 hover/focus 시에만. DOM엔 항상 유지(SR용) */}
      <span className="text-sm leading-4 text-primary-1 opacity-60 transition-opacity peer-checked:font-bold peer-checked:opacity-100 desktop:opacity-0 desktop:group-hover:opacity-100 peer-focus-visible:opacity-100">
        {label}
      </span>
    </label>
  )
}

export default TypeChipComponent
