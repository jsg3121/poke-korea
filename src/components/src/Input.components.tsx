import React from 'react'
import isEqual from 'fast-deep-equal'
import styled from 'styled-components'

interface InputComponentsProps {
  /**
   * input 타입을 지정
   * @example  <input type={type} {...otherProps} />
   */
  type: 'text' | 'password' | 'select'
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
  inputValue?: string | React.ReactNode
}

const Input = styled.label`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  cursor: pointer;
  border-radius: 40px;
  padding: 0 25px;

  .input__label {
    width: 100%;
    height: 14px;
    font-size: 12px;
    font-weight: 700;
    text-align: left;
    line-height: 14px;
  }

  .wrapper__input,
  .input__paceholder {
    width: 100%;
    height: 20px;
    font-size: 16px;
    font-weight: normal;
    line-height: 20px;
    border: 0;
    padding: 0;
    cursor: pointer;

    &::placeholder {
      color: #999999;
    }
  }

  .wrapper__select {
    width: 100%;
    height: 20px;
    display: flex;
    align-items: center;
  }

  .input__paceholder {
    color: #999999;
  }
`

const InputComponents: React.FC<InputComponentsProps> = (props) => {
  const { dataLabel, label, type, placeholder, inputValue } = props

  return (
    <Input htmlFor={dataLabel}>
      <p className="input__label">{label}</p>
      {type !== 'select' ? (
        <input
          type={type}
          className="wrapper__input"
          id={dataLabel}
          placeholder={placeholder}
        />
      ) : (
        <div className="wrapper__select">
          {!inputValue ? (
            <span className="input__paceholder">{placeholder}</span>
          ) : (
            <>{inputValue}</>
          )}
        </div>
      )}
    </Input>
  )
}

export default React.memo(InputComponents, isEqual)
