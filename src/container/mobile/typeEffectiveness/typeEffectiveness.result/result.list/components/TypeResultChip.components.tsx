import ImageComponent from '~/components/Image.component'
import { PokemonType } from '~/graphql/typeGenerated'
import { CardColor, PokemonTypes } from '~/types/pokemonTypes.types'

interface TypeResultChipComponentsProps {
  typeLabel: PokemonTypes
  typeValue: PokemonType
}

const TypeResultChipComponents = ({
  typeLabel,
  typeValue,
}: TypeResultChipComponentsProps) => {
  return (
    <span
      style={{
        backgroundColor: CardColor[typeValue],
      }}
      className="min-w-16 h-10 rounded-2xl text-base leading-[calc(1.5rem+2px)] text-center shadow-[1px_1px_1px_var(--color-primary-3)] drop-shadow-[1px_2px_6px_var(--color-primary-1)] flex gap-1 py-2 pr-3 pl-2"
    >
      <i className="w-6 h-6 block drop-shadow-[1px_1px_1px_var(--color-primary-2)]">
        <ImageComponent
          alt={`${typeLabel} 타입 필터 선택`}
          height="1.5rem"
          width="1.5rem"
          src={`/assets/type/${typeValue.toLowerCase()}.svg`}
        />
      </i>
      {typeLabel}
    </span>
  )
}

export default TypeResultChipComponents
