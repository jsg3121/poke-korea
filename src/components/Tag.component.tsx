import { PokemonTypes } from '~/types/pokemonTypes.types'
import { PokemonType } from '~/graphql/typeGenerated'

interface TagComponentProps {
  type: PokemonType
}

const TagComponent = ({ type }: TagComponentProps) => {
  return (
    <span className={`type-tag chip-type-${type.toLowerCase()}`}>
      {PokemonTypes[type]}
    </span>
  )
}

export default TagComponent
