import { ChangeEvent } from 'react'

interface SearchInputProps {
  label: string
  visuallyHiddenLabel?: boolean
  placeholder?: string
  defaultValue?: string
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  id?: string
}

const INPUT_CLASS =
  'w-full min-h-touch px-4 bg-primary-4 text-primary-1 border-2 border-solid border-primary-2 rounded-lg text-sm placeholder:text-primary-2 transition-colors hover:border-primary-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-1 disabled:opacity-50 disabled:cursor-not-allowed'

const SearchInput = ({
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
        {...(value !== undefined ? { value } : { defaultValue })}
        onChange={handleChange}
        disabled={disabled}
        className={INPUT_CLASS}
      />
    </label>
  )
}

export default SearchInput
