import React from 'react'
import styled from 'styled-components'
import Ball from './Ball.component'

interface CheckboxComponentProps {
  value: string
  label: string
  disabled?: boolean
  defaultChecked?: boolean
  onChecked: (value: string) => void
}

const Checkbox = styled.div`
  width: fit-content;

  input {
    display: none;
  }

  label {
    display: flex;
    align-items: center;
    position: relative;
    height: 1.3rem;
    cursor: pointer;

    .check__icon {
      width: 1rem;
      height: 1rem;
      position: relative;

      .ball {
        width: 1em;
        height: 1rem;
        position: absolute;
        transform-origin: top left;
        transform: scale(0) translate(-50%, -50%);
        top: 50%;
        left: 50%;
      }

      .checkbox__unchecked {
        width: 1rem;
        height: 1rem;
        border-radius: 0.3rem;
        border: 1px solid black;
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 10;
        transform: scale(1) translate(-50%, -50%);
        transform-origin: top left;
        transition: transform 0.3s;
        will-change: transform;
      }
    }

    & > .checkbox__text {
      height: 100%;
      margin-left: 0.3rem;
      font-size: 1rem;
      line-height: 1.5;
    }
  }

  input:checked + label {
    .ball {
      transform: scale(1) translate(-50%, -50%);
    }
    .checkbox__unchecked {
      transform: scale(0) translate(-50%, -50%);
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

    .checkbox__text {
      color: rgba(0, 0, 0, 0.35);
    }
  }
`

const CheckboxComponent: React.FC<CheckboxComponentProps> = (props) => {
  const {
    label,
    value,
    defaultChecked = false,
    disabled = false,
    onChecked,
  } = props
  const checkboxRef = React.useRef<HTMLInputElement>(null)

  const handleCheck = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChecked(e.target.value)
    },
    [onChecked]
  )

  React.useEffect(() => {
    if (!defaultChecked) {
      if (checkboxRef.current) {
        checkboxRef.current.checked = false
      }
    }
  }, [defaultChecked])

  return (
    <Checkbox>
      <input
        ref={checkboxRef}
        type="checkbox"
        disabled={disabled}
        id={value}
        value={value}
        defaultChecked={defaultChecked}
        onChange={handleCheck}
      />
      <label htmlFor={value}>
        <div className="check__icon">
          <i className="checkbox__unchecked" />
          <Ball value={defaultChecked} />
        </div>
        <span className="checkbox__text">{label}</span>
      </label>
    </Checkbox>
  )
}

export default CheckboxComponent
