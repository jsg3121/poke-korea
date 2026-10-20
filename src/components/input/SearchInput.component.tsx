import { ChangeEvent, forwardRef, InputHTMLAttributes } from 'react'

interface SearchInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'type' | 'className'
  > {
  label: string
  visuallyHiddenLabel?: boolean
  type?: 'search' | 'text'
  onChange?: (value: string) => void
}

const INPUT_CLASS =
  'w-full min-h-touch px-4 bg-primary-4 text-primary-1 border-2 border-solid border-primary-2 rounded-lg text-md placeholder:text-primary-2 transition-colors hover:border-primary-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-4 disabled:opacity-50 disabled:cursor-not-allowed'

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      label,
      visuallyHiddenLabel = true,
      type = 'search',
      value,
      defaultValue,
      onChange,
      disabled = false,
      ...inputProps
    },
    ref,
  ) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value)
    }

    return (
      <label className="block w-full">
        <span
          className={
            visuallyHiddenLabel
              ? 'sr-only'
              : 'block mb-3 text-sm text-primary-4'
          }
        >
          {label}
        </span>
        <input
          {...inputProps}
          ref={ref}
          type={type}
          {...(value !== undefined ? { value } : { defaultValue })}
          onChange={handleChange}
          disabled={disabled}
          className={INPUT_CLASS}
        />
      </label>
    )
  },
)

SearchInput.displayName = 'SearchInput'

export default SearchInput
