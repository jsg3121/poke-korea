import Ball from './Ball.component'
import { forwardRef, InputHTMLAttributes } from 'react'

interface CheckboxComponentProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

const CheckboxComponent = forwardRef<HTMLInputElement, CheckboxComponentProps>(
  ({ id, label, defaultChecked = false, ...restProps }, inputRef) => {
    return (
      <label
        htmlFor={id}
        className="flex items-center relative h-[1.3rem] cursor-pointer"
      >
        <input
          id={id}
          ref={inputRef}
          type="checkbox"
          defaultChecked={defaultChecked}
          className="sr-only peer"
          {...restProps}
        />
        {/* Unchecked state - 체크되지 않았을 때 보이는 박스 */}
        <div className="w-4 h-4 rounded-[0.3rem] border border-black-1 bg-white-3 absolute left-0 z-10 scale-100 transition-transform duration-300 will-change-transform peer-checked:scale-0" />
        {/* Ball - 체크되었을 때 보이는 포켓볼 */}
        <div className="w-4 h-4 absolute left-0 scale-0 transition-transform duration-300 will-change-transform peer-checked:scale-100">
          <Ball value={defaultChecked} />
        </div>
        <span className="h-full ml-5 text-base leading-[1.5] text-primary-3 peer-checked:text-primary-4 peer-disabled:text-black/35">
          {label}
        </span>
      </label>
    )
  },
)

export default CheckboxComponent
