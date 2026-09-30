interface SelectOption<T extends string> {
  value: T
  label: string
}

interface SelectInputProps<T extends string> {
  label: string
  visuallyHiddenLabel?: boolean
  value: T
  options: ReadonlyArray<SelectOption<T>>
  onChange: (value: T) => void
  disabled?: boolean
  id?: string
}

const SELECT_CLASS =
  'min-h-touch desktop:min-h-9 bg-primary-4 text-primary-1 border-2 border-solid border-primary-2 rounded-md px-3 text-sm font-medium cursor-pointer transition-colors hover:bg-primary-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-1 disabled:opacity-50 disabled:cursor-not-allowed'

const SelectInput = <T extends string>({
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

export default SelectInput
