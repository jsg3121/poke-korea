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
        className="w-fit flex items-center relative h-[1.3rem] cursor-pointer"
      >
        <input
          id={id}
          ref={inputRef}
          type="checkbox"
          defaultChecked={defaultChecked}
          className="sr-only peer"
          {...restProps}
        />

        <div className="w-4 h-4 relative">
          {/* Unchecked state - 체크되지 않았을 때 보이는 박스 */}
          <div className="w-4 h-4 rounded-[0.3rem] border border-black-1 bg-white-2 absolute top-1/2 left-1/2 z-10 scale-100 -translate-x-1/2 -translate-y-1/2 origin-top-left transition-transform duration-300 will-change-transform peer-checked:scale-0" />

          {/* Ball - 체크되었을 때 보이는 포켓볼 */}
          <div className="w-4 h-4 absolute top-1/2 left-1/2 scale-0 -translate-x-1/2 -translate-y-1/2 origin-top-left transition-transform duration-300 will-change-transform peer-checked:scale-100">
            <Ball value={defaultChecked} />
          </div>

          {/* Disabled overlay */}
          <div className="w-4 h-4 rounded-full absolute top-0 left-0 bg-black/35 z-10 hidden peer-disabled:block" />
        </div>

        <span className="h-full ml-[0.3rem] text-base leading-[1.5] text-primary-3 peer-checked:text-primary-4 peer-disabled:text-black/35">
          {label}
        </span>
      </label>
    )
  },
)

export default CheckboxComponent
