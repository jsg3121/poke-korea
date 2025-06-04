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
      className="w-12 h-14 flex-shrink-0 text-center transition-transform duration-200 ease-out cursor-pointer"
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
        className="w-full h-14 opacity-70 block text-center has-[:checked]:opacity-100 has-[:disabled]:opacity-20"
      >
        <i className="w-8 h-8 opacity-60 grayscale drop-shadow-[1px_2px_0px_var(--color-black-1)] block mx-auto mb-2 has-[:checked]:grayscale-0">
          <ImageComponent
            alt={`${typeName} 타입 필터 선택`}
            height="100%"
            width="100%"
            src={`/assets/type/${typeValue.toLowerCase()}.svg`}
            loading="lazy"
          />
        </i>
        <span className="text-black has-[:checked]:font-bold">{typeName}</span>
      </label>
    </div>
  )
}

export default memo(TypeFieldButtonComponents, isEqual)
