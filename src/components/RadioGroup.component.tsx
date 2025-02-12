import { forwardRef, InputHTMLAttributes } from 'react'
import styled from 'styled-components'
import Radio from './Radio.component'

interface RadioComponentProps extends InputHTMLAttributes<HTMLInputElement> {
  title?: string
  options: Array<{ label: string; value: string }>
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

const RadioGroupComponent = forwardRef<HTMLInputElement, RadioComponentProps>(
  ({ title, name, options, defaultValue, ...restProps }, radioRef) => {
    return (
      <RadioGroup>
        {title && <p className="item__title">{title}</p>}
        <div className="radio__item">
          {options.map((item, index) => {
            const { label, value } = item
            return (
              <Radio
                ref={radioRef}
                key={index}
                name={name}
                label={label}
                value={value}
                defaultChecked={defaultValue === value}
                {...restProps}
              />
            )
          })}
        </div>
      </RadioGroup>
    )
  },
)
export default RadioGroupComponent
