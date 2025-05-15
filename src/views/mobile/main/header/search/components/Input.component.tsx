import { forwardRef } from 'react'
import styled from 'styled-components'

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

const Input = styled.input`
  width: 100%;
  height: 100%;
  border-radius: 2.5rem;
  font-size: 14px;
  line-height: calc(3rem - 2px);
  border: 0;
  padding: 0 10px;

  &::placeholder {
    color: var(--color-primary-2);
  }
`

const InputComponents = forwardRef<HTMLInputElement, InputComponentsProps>(
  ({ dataLabel, ...restProps }, ref) => {
    return (
      <Input
        id={dataLabel}
        ref={ref}
        type="text"
        placeholder="포켓몬의 이름을 입력해주세요"
        {...restProps}
      />
    )
  },
)

export default InputComponents
