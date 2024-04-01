import isEqual from 'fast-deep-equal'
import React from 'react'
import styled from 'styled-components'
import Ball from './Ball.component'

interface RadioComponentProps {
  name: string
  label: string
  value: string
  defaultChecked?: boolean
  disabled?: boolean
  onChecked: (value: string) => void
}

const Radio = styled.div`
  input {
    display: none;
  }

  label {
    display: flex;
    align-items: center;
    position: relative;
    height: 1.3rem;

    .ball {
      width: 1.2rem;
      height: 1.2rem;
      position: absolute;
      transform: scale(0);
      left: 0;
    }

    .radio__unchecked {
      width: 1.2rem;
      height: 1.2rem;
      border-radius: 50%;
      border: 1px solid black;
      position: absolute;
      left: 0;
      z-index: 10;
      transform: scale(1);
      transition: transform 0.3s;
      will-change: transform;
    }

    & > .radio__text {
      margin-left: 1.5rem;
      font-size: 1rem;
    }
  }

  input:checked + label {
    .ball {
      transform: scale(1);
    }
    .radio__unchecked {
      transform: scale(0);
    }
  }

  input:disabled + label {
    .ball {
      &::after {
        content: '';
        width: 100%;
        height: 100%;
        border-radius: 50%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.35);
        z-index: 10;
      }
    }

    .radio__text {
      color: rgba(0, 0, 0, 0.35);
    }
  }
`

const RadioComponent: React.FC<RadioComponentProps> = (props) => {
  const {
    name,
    label,
    value,
    defaultChecked = false,
    disabled,
    onChecked,
  } = props

  const radioRef = React.useRef<HTMLInputElement>(null)

  const handleCheck = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChecked(e.target.value)
    },
    [onChecked]
  )

  React.useEffect(() => {
    if (!defaultChecked) {
      if (radioRef.current) {
        radioRef.current.checked = false
      }
    }
  }, [defaultChecked])

  return (
    <Radio>
      <input
        ref={radioRef}
        type="radio"
        name={name}
        disabled={disabled}
        id={`${name}__${value}`}
        value={value}
        defaultChecked={defaultChecked}
        onChange={handleCheck}
      />
      <label htmlFor={`${name}__${value}`}>
        <i className="radio__unchecked" />
        <Ball value={defaultChecked} />
        <span className="radio__text">{label}</span>
      </label>
    </Radio>
  )
}

export default RadioComponent
