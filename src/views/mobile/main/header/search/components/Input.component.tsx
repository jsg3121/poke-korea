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
}

const InputComponents = forwardRef<HTMLInputElement, InputComponentsProps>(
  ({ dataLabel, ...restProps }, ref) => {
    return (
      <input
        id={dataLabel}
        ref={ref}
        type="text"
        placeholder="포켓몬의 이름을 입력해주세요"
        className="w-full h-full rounded-[2.5rem] text-[14px] leading-[calc(3rem-2px)] border-0 px-[10px] placeholder:text-primary-2"
        {...restProps}
      />
    )
  },
)

export default InputComponents
