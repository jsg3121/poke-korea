import React, { InputHTMLAttributes } from 'react'
import styled from 'styled-components'

interface InputComponentsProps extends InputHTMLAttributes<HTMLInputElement> {
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
}

const Input = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  cursor: text;
  border-radius: 2.22222222rem;
  padding: 0 1.38888889rem;

  .input__label {
    width: 100%;
    height: 0.77777778rem;
    font-size: 0.66666667rem;
    font-weight: 700;
    text-align: left;
    line-height: 0.77777778rem;
  }

  .wrapper__input {
    width: 100%;
    height: 1.11111111rem;
    font-size: 0.83333333rem;
    font-weight: normal;
    line-height: 1.11111111rem;
    border: 0;
    padding: 0;
    cursor: text;
    background-color: transparent;

    &::placeholder {
      color: #999999;
    }
  }
`

const InputComponents: React.FC<InputComponentsProps> = (props) => {
  const { dataLabel, label, ...restProps } = props

  return (
    <Input>
      <p className="input__label">{label}</p>
      <input className="wrapper__input" id={dataLabel} {...restProps} />
    </Input>
  )
}

export default InputComponents
