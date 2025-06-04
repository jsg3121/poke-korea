import { PokemonType } from '~/graphql/typeGenerated'
import { PokemonTypes } from '~/types/pokemonTypes.types'

interface TagComponentProps {
  type: PokemonType
}

const getTypeClasses = (type: PokemonType): string => {
  const baseClasses =
    'w-[3.6rem] h-6 px-2 rounded-[0.625rem] text-center flex items-center'

  switch (type) {
    case 'NORMAL':
      return `${baseClasses} bg-type-normal`
    case 'FIRE':
      return `${baseClasses} bg-type-fire`
    case 'WATER':
      return `${baseClasses} bg-type-water`
    case 'GRASS':
      return `${baseClasses} bg-type-grass`
    case 'ELECTRIC':
      return `${baseClasses} bg-type-electric`
    case 'ICE':
      return `${baseClasses} bg-type-ice`
    case 'FIGHTING':
      return `${baseClasses} bg-type-fighting`
    case 'POISON':
      return `${baseClasses} bg-type-poison`
    case 'GROUND':
      return `${baseClasses} bg-type-ground`
    case 'FLYING':
      return `${baseClasses} bg-type-flying`
    case 'PSYCHIC':
      return `${baseClasses} bg-type-psychic`
    case 'BUG':
      return `${baseClasses} bg-type-bug`
    case 'ROCK':
      return `${baseClasses} bg-type-rock`
    case 'GHOST':
      return `${baseClasses} bg-type-ghost`
    case 'DRAGON':
      return `${baseClasses} bg-type-dragon`
    case 'DARK':
      return `${baseClasses} bg-type-dark`
    case 'STEEL':
      return `${baseClasses} bg-type-steel`
    case 'FAIRY':
      return `${baseClasses} bg-type-fairy`
    default:
      return `${baseClasses} bg-type-normal`
  }
}

const TagComponent = ({ type }: TagComponentProps) => {
  return (
    <p className={getTypeClasses(type)}>
      <span className="w-full h-[1.3rem] text-[0.85rem] text-center leading-[calc(1.3rem+3px)] text-white m-0 drop-shadow-[0_0_1px_#000000]">
        {PokemonTypes[type]}
      </span>
    </p>
  )
}

export default TagComponent
