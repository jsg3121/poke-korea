import React from 'react'
import styled from 'styled-components'

interface InputComponentsProps {
  /**
   * input 타입을 지정
   * @example  <input type={type} {...otherProps} />
   */
  type: 'text' | 'password'
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
  placeholder: string
  /**
   * 데이터를 표시
   * @example
   * // type !== select
   * <input
   *   type={type}
   *   className="wrapper__input"
   *   id={dataLabel}
   *   placeholder={placeholder}
   *   defaultValue={inputValue as string}
   * />
   *
   * @example
   * // type === 'select'
   * <div className="wrapper__select">
   *   <PropsNodes/> => React.ReactNode
   * </div>
   *
   */
  inputValue?: string | React.ReactNode
  onChange?: (value: string) => void
}

const Input = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  cursor: pointer;
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
    cursor: pointer;
    background-color: transparent;

    &::placeholder {
      color: #999999;
    }
  }
`

const InputComponents: React.FC<InputComponentsProps> = (props) => {
  const { dataLabel, label, type, placeholder, inputValue, onChange } = props

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.trim()
      if (onChange) {
        onChange(value)
      }
    },
    [onChange]
  )
  return (
    <Input>
      <p className="input__label">{label}</p>
      <input
        type={type}
        className="wrapper__input"
        id={dataLabel}
        placeholder={placeholder}
        defaultValue={inputValue as string}
        onChange={handleInputChange}
      />
    </Input>
  )
}

export default InputComponents
