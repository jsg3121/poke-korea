import React from 'react'
import styled from 'styled-components'
import Radio from './Radio.component'

interface RadioComponentProps {
  title?: string
  name: string
  options: Array<{ label: string; value: string }>
  defaultValue?: string
  onSelect: (data: { name: string; value: string }) => void
}

const RadioGroup = styled.div`
  width: 100%;

  .item__title {
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #333333;
  }

  .radio__item {
    display: grid;
    grid-template-columns: repeat(3, auto);
  }
`

const RadioGroupComponent: React.FC<RadioComponentProps> = (props) => {
  const { title, name, options, defaultValue, onSelect } = props

  const handleCheck = React.useCallback(
    (data: string) => {
      onSelect({ name, value: data })
    },
    [name, onSelect]
  )

  return (
    <RadioGroup>
      {title && <p className="item__title">{title}</p>}
      <div className="radio__item">
        {options.map((item, index) => {
          const { label, value } = item
          return (
            <Radio
              key={index}
              name={name}
              label={label}
              value={value}
              onChecked={handleCheck}
              defaultChecked={defaultValue === value}
            />
          )
        })}
      </div>
    </RadioGroup>
  )
}

export default RadioGroupComponent
