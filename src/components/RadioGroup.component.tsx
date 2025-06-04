import { forwardRef, InputHTMLAttributes } from 'react'
import Radio from './Radio.component'

interface RadioComponentProps extends InputHTMLAttributes<HTMLInputElement> {
  title?: string
  options: Array<{ label: string; value: string }>
}

const RadioGroupComponent = forwardRef<HTMLInputElement, RadioComponentProps>(
  ({ title, name, options, defaultValue, ...restProps }, radioRef) => {
    return (
      <div className="w-full">
        {title && (
          <p className="text-[1.1rem] font-bold mb-4 pb-2 border-b border-[#333333]">
            {title}
          </p>
        )}
        <div className="grid grid-cols-[repeat(3,_auto)] gap-0">
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
      </div>
    )
  },
)
export default RadioGroupComponent
