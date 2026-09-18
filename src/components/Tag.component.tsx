import { PokemonTypes } from '~/types/pokemonTypes.types'
import { PokemonType } from '~/graphql/typeGenerated'

interface TagProps {
  type: PokemonType
}

const Tag = ({ type }: TagProps) => {
  return (
    <span className={`type-tag chip-type-${type.toLowerCase()}`}>
      {PokemonTypes[type]}
    </span>
  )
}

export default Tag
