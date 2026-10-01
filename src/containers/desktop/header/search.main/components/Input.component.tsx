import { forwardRef } from 'react'

interface InputComponentsProps {
  dataLabel: string
  label: string
  hasValue: boolean
}

const InputComponents = forwardRef<HTMLInputElement, InputComponentsProps>(
  ({ hasValue = false, dataLabel, label, ...restProps }, ref) => {
    return (
      <div className="w-full h-full flex cursor-text rounded-[2.22222222rem] px-[1.38888889rem] relative">
        <label
          htmlFor={dataLabel}
          className={`w-full h-4 text-[0.66666667rem] font-bold text-left leading-4 absolute top-2 left-[1.38888889rem] transition-[opacity,transform] duration-200 z-10 pointer-events-none
            ${hasValue ? 'opacity-0 -translate-y-1' : 'opacity-100'}`}
        >
          {label}
        </label>
        <input
          id={dataLabel}
          ref={ref}
          type="text"
          placeholder="포켓몬의 이름을 입력해주세요"
          className={`
            w-full h-8 text-base font-normal leading-8 border-0 p-0 cursor-text bg-transparent absolute left-[1.38888889rem] transition-[top] duration-300 placeholder:text-[#999999] placeholder:text-[0.83333333rem]
            ${hasValue ? 'top-[0.6rem]' : 'top-[1.125rem]'}
            `}
          {...restProps}
        />
      </div>
    )
  },
)

export default InputComponents
