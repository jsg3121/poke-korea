import { ChangeEvent } from 'react'

/**
 * 검색 입력 (DS 원자). `<input type="search">` 래퍼.
 *
 * SelectInput과 같은 서비스 무드의 밝은 컨트롤 톤(진한 배경 위에서 떠 보임). 색은 등록된
 * 토큰만 사용한다 — 기존 인라인 검색의 gray/blue 비토큰 색을 primary 토큰으로 정규화한다.
 * 입력 컨트롤이므로 터치 타겟 44px(min-h-touch)을 보장한다.
 *
 * 검색 로직(디바운스·쿼리 바인딩)은 사용처(상위) 책임이다 — 이 원자는 표시·입력만 담당한다.
 * label은 항상 제공한다(접근성). 시각적으로 숨기려면 visuallyHiddenLabel을 쓴다.
 */

interface SearchInputProps {
  /** 접근성 라벨 (필수) */
  label: string
  /** 라벨을 시각적으로 숨김(sr-only). 기본 true(검색창은 placeholder로 충분한 경우가 많음) */
  visuallyHiddenLabel?: boolean
  placeholder?: string
  /** 비제어 기본값 (URL 쿼리 등) */
  defaultValue?: string
  /** 제어 값 (defaultValue와 함께 쓰지 않음) */
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  /** 인풋 식별자 (label과 연결) */
  id?: string
}

const INPUT_CLASS =
  'w-full min-h-touch px-4 bg-primary-4 text-primary-1 border-2 border-solid border-primary-2 rounded-lg text-sm placeholder:text-primary-2 transition-colors hover:border-primary-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-1 disabled:opacity-50 disabled:cursor-not-allowed'

const SearchInputComponent = ({
  label,
  visuallyHiddenLabel = true,
  placeholder,
  defaultValue,
  value,
  onChange,
  disabled = false,
  id,
}: SearchInputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value)
  }

  return (
    <label className="block w-full">
      <span
        className={
          visuallyHiddenLabel ? 'sr-only' : 'block mb-1 text-sm text-primary-4'
        }
      >
        {label}
      </span>
      <input
        id={id}
        type="search"
        placeholder={placeholder}
        // value/defaultValue를 동시에 주면 제어/비제어가 모호해져 React 경고가 난다.
        // value가 있으면 제어, 없으면 비제어(defaultValue)로 하나만 전달한다.
        {...(value !== undefined ? { value } : { defaultValue })}
        onChange={handleChange}
        disabled={disabled}
        className={INPUT_CLASS}
      />
    </label>
  )
}

export default SearchInputComponent
