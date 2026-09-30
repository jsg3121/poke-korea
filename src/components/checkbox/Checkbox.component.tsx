import { forwardRef, InputHTMLAttributes, useId } from 'react'

import Ball from '~/components/ball/Ball.component'

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ id: passedId, label, disabled, ...inputProps }, ref) => {
    const autoId = useId()
    const id = passedId ?? autoId
    return (
      <label
        htmlFor={id}
        className="inline-flex items-center relative h-5 cursor-pointer"
      >
        <input
          ref={ref}
          id={id}
          type="checkbox"
          disabled={disabled}
          className="sr-only peer"
          {...inputProps}
        />
        <span
          aria-hidden="true"
          className="w-4 h-4 rounded border border-solid border-black-1 bg-white-3 absolute left-0 z-10 opacity-100 transition-opacity duration-300 peer-checked:opacity-0 peer-disabled:opacity-50"
        />
        <span
          aria-hidden="true"
          className="block w-4 h-4 absolute left-0 z-20 scale-0 transition-transform duration-300 will-change-transform peer-checked:scale-100 peer-disabled:opacity-50"
        >
          <Ball />
        </span>
        <span className="ml-5 h-5 text-base leading-5 text-primary-3 peer-checked:text-primary-4 peer-disabled:text-primary-2">
          {label}
        </span>
      </label>
    )
  },
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
