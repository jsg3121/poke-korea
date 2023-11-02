import React from 'react'
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
  /**
   * type이 select인 경우 옵션을 선택할 수 있는 modal 오픈 트리거 함수
   */
  onSelectInputClick?: () => void
}

const Input = styled.label`
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

  .wrapper__input,
  .input__paceholder {
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

  .wrapper__select {
    width: 100%;
    height: 1.11111111rem;
    display: flex;
    align-items: center;
  }

  .input__paceholder {
    color: #999999;
  }
`

const InputComponents: React.FC<InputComponentsProps> = (props) => {
  const {
    dataLabel,
    label,
    type,
    placeholder,
    inputValue,
    onChange,
    onSelectInputClick,
  } = props

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value)
    }
  }

  const handleSelectModalClick = () => {
    if (type === 'select' && onSelectInputClick) {
      onSelectInputClick()
    }
  }

  return (
    <Input htmlFor={dataLabel} onClick={handleSelectModalClick}>
      <p className="input__label">{label}</p>
      {type !== 'select' ? (
        <input
          type={type}
          className="wrapper__input"
          id={dataLabel}
          placeholder={placeholder}
          defaultValue={inputValue as string}
          onChange={handleInputChange}
        />
      ) : (
        <div className="wrapper__select" id={dataLabel}>
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

export default InputComponents
