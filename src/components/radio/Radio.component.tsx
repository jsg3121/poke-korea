import { forwardRef, InputHTMLAttributes, useId } from 'react'

import Ball from '~/components/ball/Ball.component'

interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
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
          type="radio"
          disabled={disabled}
          className="sr-only peer"
          {...inputProps}
        />
        <span
          aria-hidden="true"
          className="w-5 h-5 rounded-full border border-solid border-black-1 bg-white-3 absolute left-0 z-10 peer-disabled:opacity-50"
        />
        <span
          aria-hidden="true"
          className="block w-5 h-5 absolute left-0 z-20 scale-0 transition-transform duration-300 will-change-transform peer-checked:scale-100 peer-disabled:opacity-50"
        >
          <Ball />
        </span>
        <span className="ml-6 h-5 text-base leading-5 text-primary-3 peer-checked:text-primary-4 peer-disabled:text-primary-2">
          {label}
        </span>
      </label>
    )
  },
)

Radio.displayName = 'Radio'

export default Radio
