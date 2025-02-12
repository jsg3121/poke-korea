import styled from 'styled-components'
import Ball from './Ball.component'
import { forwardRef } from 'react'

interface RadioComponentProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
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
    cursor: pointer;

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
      background-color: var(--color-white-3);
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
      color: var(--color-primary-3);
    }
  }

  input:checked + label {
    .ball {
      transform: scale(1);
    }
    .radio__unchecked {
      transform: scale(0);
    }
    & > .radio__text {
      color: var(--color-primary-4);
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

const RadioComponent = forwardRef<HTMLInputElement, RadioComponentProps>(
  (
    { name, label, value, defaultChecked = false, disabled, ...restInputProps },
    ref,
  ) => {
    return (
      <Radio>
        <input
          ref={ref}
          type="radio"
          name={name}
          disabled={disabled}
          id={`${name}__${value}`}
          value={value}
          defaultChecked={defaultChecked}
          {...restInputProps}
        />
        <label htmlFor={`${name}__${value}`}>
          <i className="radio__unchecked" />
          <Ball value={defaultChecked} />
          <span className="radio__text">{label}</span>
        </label>
      </Radio>
    )
  },
)

export default RadioComponent
