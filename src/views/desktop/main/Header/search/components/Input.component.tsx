import { forwardRef } from 'react'

interface InputComponentsProps {
  /**
   * input data 정보를 명시하는 텍스트
   * @example
   * <label>
   *   <input id={dataLabel} {...otherProps} />
   * </label>
   */
  dataLabel: string
  /**
   * 해당 input의 title, name등의 텍스트를 입력
   */
  label: string
  hasValue: boolean
}

const InputComponents = forwardRef<HTMLInputElement, InputComponentsProps>(
  ({ hasValue = false, dataLabel, label, ...restProps }, ref) => {
    return (
      <div
        className={`w-full h-full flex cursor-text rounded-[2.22222222rem] px-[1.38888889rem] relative ${hasValue ? '[&>.input__label]:text-white [&>.input__label]:-top-5 [&>.wrapper__input]:top-[0.6rem]' : ''}`}
      >
        <p
          className={`w-full h-4 text-[0.66666667rem] font-bold text-left leading-4 absolute top-2 left-[1.38888889rem] transition-[top] duration-200 z-10
            ${hasValue && 'text-white top-[-1.25rem]'}`}
        >
          {label}
        </p>
        <input
          id={dataLabel}
          ref={ref}
          type="text"
          placeholder="포켓몬의 이름을 입력해주세요"
          className={`
            w-full h-8 text-base font-normal leading-8 border-0 p-0 cursor-text bg-transparent absolute top-[1.125rem] left-[1.38888889rem] transition-[top] duration-300 placeholder:text-[#999999] placeholder:text-[0.83333333rem]
            ${hasValue && 'top-[0.6rem]'}
            `}
          {...restProps}
        />
      </div>
    )
  },
)

export default InputComponents
