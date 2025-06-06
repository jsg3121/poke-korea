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
      className="group w-12 h-14 flex-shrink-0 text-center transition-transform duration-200 ease-out cursor-pointer"
      role="button"
      aria-label={`포켓몬 필터 ${typeName}타입`}
    >
      <input
        type="checkbox"
        id={`field-type-${typeValue}`}
        disabled={disabled}
        value={typeValue}
        checked={defaultChecked}
        className="hidden peer"
        {...restProps}
      />
      <label
        htmlFor={`field-type-${typeValue}`}
        className="w-8 h-8 opacity-40 block text-center grayscale peer-checked:grayscale-0 peer-checked:opacity-70 peer-disabled:opacity-20 drop-shadow-[1px_2px_0px_var(--color-black-1)] mx-auto mb-2"
      >
        <ImageComponent
          alt={`${typeName} 타입 필터 선택`}
          height="100%"
          width="100%"
          src={`/assets/type/${typeValue.toLowerCase()}.svg`}
          loading="lazy"
        />
      </label>
      <span className="text-black peer-checked:font-bold opacity-40 peer-checked:opacity-70">
        {typeName}
      </span>
    </div>
  )
}

export default memo(TypeFieldButtonComponents, isEqual)
