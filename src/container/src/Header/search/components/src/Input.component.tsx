import React, { InputHTMLAttributes, useState } from 'react'
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
  cursor: text;
  border-radius: 2.22222222rem;
  padding: 0 1.38888889rem;
  position: relative;

  &[data-has-value='has-value'] {
    & > .input__label {
      color: #ffffff;
      top: -1.25rem;
    }

    & > .wrapper__input {
      top: 0.6rem;
    }
  }

  .input__label {
    width: 100%;
    height: 1rem;
    font-size: 0.66666667rem;
    font-weight: 700;
    text-align: left;
    line-height: 1rem;
    position: absolute;
    top: 0.5rem;
    left: 1.38888889rem;
    transition: top 0.2s;
    z-index: 10;
  }

  .wrapper__input {
    width: 100%;
    height: 2rem;
    font-size: 1rem;
    font-weight: normal;
    line-height: 2rem;
    border: 0;
    padding: 0;
    cursor: text;
    background-color: transparent;
    position: absolute;
    top: 1.125rem;
    left: 1.38888889rem;
    transition: top 0.3s;

    &::placeholder {
      color: #999999;
      font-size: 0.83333333rem;
    }
  }
`

const InputComponents: React.FC<InputComponentsProps> = (props) => {
  const { dataLabel, label, onChange, ...restProps } = props
  const [hasValue, setHasValue] = useState<boolean>(false)

  const handleChangeSearchKeyword = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value
    setHasValue(!!value)

    if (onChange) {
      onChange(e)
    }
  }

  return (
    <Input data-has-value={hasValue ? 'has-value' : ''}>
      <p className="input__label">{label}</p>
      <input
        className="wrapper__input"
        id={dataLabel}
        onChange={handleChangeSearchKeyword}
        {...restProps}
      />
    </Input>
  )
}

export default InputComponents
