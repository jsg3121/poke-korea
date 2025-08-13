import { PokemonType } from '~/graphql/typeGenerated'
import { PokemonTypes } from '~/types/pokemonTypes.types'

interface TagComponentProps {
  type: PokemonType
}

const TagComponent = ({ type }: TagComponentProps) => {
  return (
    <span
      className={`w-[3.6rem] h-6 block px-2 rounded-[0.625rem] text-center font-semibold text-[0.85rem] leading-[calc(1.5rem+2px)] chip-type-${type.toLowerCase()}`}
    >
      {PokemonTypes[type]}
    </span>
  )
}

export default TagComponent
