import { ChangeEvent } from 'react'

interface SelectOption<T extends string> {
  value: T
  label: string
}

type SelectInputTone = 'onDark' | 'onLight'

interface SelectInputProps<T extends string> {
  label: string
  visuallyHiddenLabel?: boolean
  value: T
  options: ReadonlyArray<SelectOption<T>>
  onChange: (value: T) => void
  disabled?: boolean
  id?: string
  tone?: SelectInputTone
  fullWidth?: boolean
}

/**
 * 글자는 16px(`text-md`) — iOS Safari는 16px 미만 입력 요소에 포커스하면 화면을 확대한다.
 */
const SELECT_CLASS =
  'min-h-touch desktop:min-h-9 cursor-pointer appearance-none bg-primary-4 text-primary-1 border-2 border-solid border-primary-2 rounded-md pl-3 pr-11 text-md font-medium transition-colors hover:bg-primary-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-1 disabled:opacity-50 disabled:cursor-not-allowed'

const LABEL_TONE_CLASS: Record<SelectInputTone, string> = {
  onDark: 'text-sm text-primary-4',
  onLight: 'text-sm font-bold text-primary-1',
}

const SelectInput = <T extends string>({
  label,
  visuallyHiddenLabel = false,
  value,
  options,
  onChange,
  disabled = false,
  id,
  tone = 'onDark',
  fullWidth = false,
}: SelectInputProps<T>) => {
  const handleChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const selected = options.find((option) => option.value === e.target.value)
    if (selected) onChange(selected.value)
  }

  return (
    <label
      className={`items-center gap-2 ${fullWidth ? 'flex w-full' : 'inline-flex'}`}
    >
      <span
        className={
          visuallyHiddenLabel ? 'sr-only' : `shrink-0 ${LABEL_TONE_CLASS[tone]}`
        }
      >
        {label}
      </span>
      <span
        className={`relative ${fullWidth ? 'min-w-0 flex-1' : 'inline-flex'}`}
      >
        <select
          id={id}
          value={value}
          onChange={handleChangeSelect}
          disabled={disabled}
          className={`${SELECT_CLASS} ${fullWidth ? 'w-full' : ''}`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-1"
        >
          <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </label>
  )
}

export default SelectInput
