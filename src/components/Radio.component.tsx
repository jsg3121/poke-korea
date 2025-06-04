import Ball from './Ball.component'
import { forwardRef, InputHTMLAttributes } from 'react'

interface RadioComponentProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

const RadioComponent = forwardRef<HTMLInputElement, RadioComponentProps>(
  (
    { name, label, value, defaultChecked = false, disabled, ...restInputProps },
    ref,
  ) => {
    return (
      <label
        htmlFor={`${name}__${value}`}
        className="flex items-center relative h-[1.3rem] cursor-pointer"
      >
        <input
          ref={ref}
          type="radio"
          name={name}
          disabled={disabled}
          id={`${name}__${value}`}
          value={value}
          defaultChecked={defaultChecked}
          className="sr-only peer"
          {...restInputProps}
        />

        {/* Unchecked state - 라디오가 선택되지 않았을 때 보이는 원 */}
        <div className="w-[1.2rem] h-[1.2rem] rounded-full border border-black-1 bg-white-3 absolute left-0 z-10 scale-100 transition-transform duration-300 will-change-transform peer-checked:scale-0" />

        {/* Ball - 선택되었을 때 보이는 포켓볼 */}
        <div className="w-[1.2rem] h-[1.2rem] absolute left-0 scale-0 transition-transform duration-300 will-change-transform peer-checked:scale-100">
          <Ball value={defaultChecked} />
          {/* Disabled overlay */}
          <div className="w-full h-full rounded-full absolute top-0 left-0 bg-black/35 z-10 hidden peer-disabled:block" />
        </div>

        <span className="ml-6 text-base text-primary-3 peer-checked:text-primary-4 peer-disabled:text-black/35">
          {label}
        </span>
      </label>
    )
  },
)

export default RadioComponent
