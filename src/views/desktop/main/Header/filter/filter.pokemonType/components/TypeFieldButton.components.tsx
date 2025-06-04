import isEqual from 'fast-deep-equal'
import { InputHTMLAttributes, memo } from 'react'
import ImageComponent from '~/components/Image.component'
import { PokemonTypes } from '~/types/pokemonTypes.types'

interface TypeFieldButtonComponentsProps
  extends InputHTMLAttributes<HTMLInputElement> {
  typeValue: string
  typeName: PokemonTypes
}

const TypeFieldButtonComponents = ({
  typeName,
  typeValue,
  disabled,
  defaultChecked,
  ...restProps
}: TypeFieldButtonComponentsProps) => {
  return (
    <div
      className="w-8 text-center transition-transform duration-200 ease-out cursor-pointer hover:scale-140 hover:[&>label]:opacity-100 hover:[&>.field__tooltip]:w-12 hover:[&>.field__tooltip]:h-5 hover:[&>.field__tooltip]:opacity-100 active:scale-120 max-sm:w-6 max-sm:h-6"
      role="button"
      aria-label={`포켓몬 필터 ${typeName}타입`}
    >
      <input
        type="checkbox"
        id={`field-type-${typeValue}`}
        disabled={disabled}
        value={typeValue}
        checked={defaultChecked}
        className="hidden"
        {...restProps}
      />
      <label
        htmlFor={`field-type-${typeValue}`}
        className="w-8 h-8 opacity-60 grayscale drop-shadow-[1px_2px_0px_var(--color-black-1)] block has-[:checked]:opacity-100 has-[:checked]:grayscale-0 has-[:disabled]:opacity-20 max-sm:w-6 max-sm:h-6"
      >
        <ImageComponent
          alt={`${typeName} 타입 필터 선택`}
          height="100%"
          width="100%"
          src={`/assets/type/${typeValue.toLowerCase()}.svg`}
          loading="lazy"
        />
      </label>
      <span
        className="field__tooltip w-0 h-0 overflow-hidden text-xs leading-5 text-center text-[#142129] bg-[#f3f6f7] rounded-lg absolute left-1/2 top-10 -translate-x-1/2"
        role="tooltip"
      >
        {typeName}
      </span>
    </div>
  )
}

export default memo(TypeFieldButtonComponents, isEqual)
