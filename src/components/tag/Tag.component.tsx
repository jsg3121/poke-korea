import { PokemonTypes } from '~/types/pokemonTypes.types'
import { PokemonType } from '~/graphql/typeGenerated'

const TYPE_COLOR: Record<PokemonType, string> = {
  NORMAL: 'bg-type-normal text-black-2',
  FIRE: 'bg-type-fire text-black-2',
  WATER: 'bg-type-water text-black-2',
  ELECTRIC: 'bg-type-electric text-black-2',
  GRASS: 'bg-type-grass text-black-2',
  ICE: 'bg-type-ice text-black-2',
  FIGHTING: 'bg-type-fighting text-white-1',
  POISON: 'bg-type-poison text-white-1',
  GROUND: 'bg-type-ground text-black-2',
  FLYING: 'bg-type-flying text-black-2',
  PSYCHIC: 'bg-type-psychic text-black-2',
  BUG: 'bg-type-bug text-black-2',
  ROCK: 'bg-type-rock text-white-1',
  GHOST: 'bg-type-ghost text-white-1',
  DRAGON: 'bg-type-dragon text-white-1',
  DARK: 'bg-type-dark text-white-1',
  STEEL: 'bg-type-steel text-black-2',
  FAIRY: 'bg-type-fairy text-black-2',
}

interface TagProps {
  type: PokemonType
}

const Tag = ({ type }: TagProps) => {
  return (
    <span
      className={`block text-center w-12 desktop:w-14 h-5 desktop:h-6 leading-[calc(1.25rem+2px)] desktop:leading-[calc(1.5rem+2px)] px-1.5 desktop:px-2 rounded-lg text-2xs desktop:text-xs font-semibold ${TYPE_COLOR[type]}`}
    >
      {PokemonTypes[type]}
    </span>
  )
}

export default Tag
