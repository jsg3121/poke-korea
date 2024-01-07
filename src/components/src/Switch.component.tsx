import React from 'react'
import styled from 'styled-components'
import Ball from './Ball.component'

interface SwitchComponentProps {
  onChange: (data: { name: string; value: boolean }) => void
  name: string
  value?: boolean
  disabled?: boolean
}

const Switch = styled.div<{ disabled?: boolean }>`
  width: max-content;
  position: relative;

  .switch__checkbox {
    display: none;

    & + label {
      background-color: #dddddd;

      .ball {
        transform: translate(0, 0) rotate(-360deg);
      }
    }

    &:checked {
      & + label {
        background-color: #4797f8;

        .ball {
          transform: translate(2rem, 0) rotate(0);
        }
      }
    }
  }

  label {
    width: 4rem;
    height: 1.9rem;
    display: flex;
    align-items: center;
    border: 1px solid #bbbbbb;
    border-radius: 0.85rem;
    box-sizing: border-box;
    padding: 0.2rem;
    position: relative;
    transition: background-color 0.3s;
    cursor: pointer;
    overflow: hidden;

    .ball {
      width: 1.3rem;
      height: 1.3rem;
    }

    p {
      margin: 0 0.3rem;
    }

    ${(props) => {
      if (props.disabled) {
        return `
          background-color: #dddddd !important;
          cursor:not-allowed;
          
          &::after {
            content: '';
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            background-color: #90909079;
            z-index: 10;
          }
        `
      }
    }}
  }
`
const SwitchComponent: React.FC<SwitchComponentProps> = (props) => {
  const { name, value = false, disabled = false, onChange } = props

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ name, value: e.target.checked })
    },
    [name, onChange]
  )

  return (
    <Switch disabled={disabled}>
      <input
        type="checkbox"
        id={name}
        className="switch__checkbox"
        onChange={handleChange}
        disabled={disabled}
        defaultChecked={value}
      />
      <label htmlFor={name}>
        <Ball value={value} />
      </label>
    </Switch>
  )
}

export default SwitchComponent
