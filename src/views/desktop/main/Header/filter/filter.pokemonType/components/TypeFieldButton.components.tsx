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
    <button
      className="group w-8 text-center duration-200 ease-out cursor-pointer hover:scale-[1.4] active:scale-120 max-sm:w-6 max-sm:h-6 desktop-639:w-[1.5rem] desktop-639:h-[1.5rem]"
      aria-label={`포켓몬 필터 ${typeName}타입`}
    >
      <label
        htmlFor={`field-type-${typeValue}`}
        className="w-8 h-8 opacity-60 grayscale drop-shadow-[1px_2px_0px_var(--color-black-1)] block has-[:checked]:opacity-100 has-[:checked]:grayscale-0 has-[:disabled]:opacity-20 max-sm:w-6 max-sm:h-6 desktop-639:w-[1.5rem] desktop-639:h-[1.5rem] cursor-pointer"
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
        <ImageComponent
          alt={`${typeName} 타입 필터 선택`}
          height="100%"
          width="100%"
          src={`/assets/type/${typeValue.toLowerCase()}.svg`}
          fetchPriority="high"
          imageSize={{
            width: 32,
            height: 32,
          }}
        />
      </label>
      <span
        className="field__tooltip w-0 h-0 overflow-hidden text-xs leading-5 text-center text-[#142129] bg-[#f3f6f7] rounded-lg absolute left-1/2 top-10 -translate-x-1/2 group-hover:w-12 group-hover:h-5 group-hover:opacity-100"
        role="tooltip"
      >
        {typeName}
      </span>
    </button>
  )
}

export default memo(TypeFieldButtonComponents, isEqual)
