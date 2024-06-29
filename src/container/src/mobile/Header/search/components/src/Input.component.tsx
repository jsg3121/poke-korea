import React from 'react'
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
  width: calc(100% - 2.5rem);
  height: 5rem;
  border-radius: 2.5rem;
  font-size: 14px;
  border: 0;
  padding: 0 1.5rem;
`

const InputComponents = React.forwardRef<
  HTMLInputElement,
  InputComponentsProps
>((props, ref) => {
  const { dataLabel, ...restProps } = props

  return (
    <Input
      id={dataLabel}
      ref={ref}
      type="text"
      placeholder="포켓몬의 이름을 입력해주세요"
      {...restProps}
    />
  )
})

export default InputComponents
