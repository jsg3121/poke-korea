/**
 * 셀렉트 입력 (DS 원자). native `<select>` 래퍼.
 *
 * 서비스 무드 톤(밝은 컨트롤): 진한 배경 위에서 떠 보이도록 밝은 배경 + 진한 글자.
 * 색은 등록된 토큰만 사용한다(임의값 금지). 입력 컨트롤이므로 터치 타겟 44px
 * (min-h-touch)을 보장한다(탭·칩의 슬림 예외와 다름).
 *
 * options/value는 제네릭 <T extends string>으로 타입 안전성을 준다 — 사용처가
 * 'usage' | 'dex' 같은 문자열 유니온을 쓰므로 onChange가 정확한 값 타입을 받는다.
 *
 * 라벨은 항상 제공한다(접근성). 시각적으로 숨기려면 visuallyHiddenLabel을 쓴다.
 */

interface SelectOption<T extends string> {
  value: T
  label: string
}

interface SelectInputProps<T extends string> {
  /** 접근성 라벨 (필수) */
  label: string
  /** 라벨을 시각적으로 숨김(sr-only). 기본 false */
  visuallyHiddenLabel?: boolean
  value: T
  options: ReadonlyArray<SelectOption<T>>
  onChange: (value: T) => void
  disabled?: boolean
  /** 셀렉트 식별자 (label과 연결) */
  id?: string
}

// 높이는 모바일 퍼스트로 차등한다(ADR-0011): 모바일은 손가락 터치라 44px(min-h-touch),
// 데스크톱은 마우스 정밀도가 높아 컴팩트하게 36px(min-h-9). 폰트(text-sm)와 비율을 맞춘다.
const SELECT_CLASS =
  'min-h-touch desktop:min-h-9 bg-primary-4 text-primary-1 border-2 border-solid border-primary-2 rounded-md px-3 text-sm font-medium cursor-pointer transition-colors hover:bg-primary-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-1 disabled:opacity-50 disabled:cursor-not-allowed'

const SelectInputComponent = <T extends string>({
  label,
  visuallyHiddenLabel = false,
  value,
  options,
  onChange,
  disabled = false,
  id,
}: SelectInputProps<T>) => {
  return (
    <label className="inline-flex items-center gap-2">
      <span
        className={visuallyHiddenLabel ? 'sr-only' : 'text-sm text-primary-4'}
      >
        {label}
      </span>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        disabled={disabled}
        className={SELECT_CLASS}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export default SelectInputComponent
