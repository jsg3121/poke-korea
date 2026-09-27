import Link from 'next/link'

import { PokemonTypes } from '~/types/pokemonTypes.types'
import { PokemonType } from '~/graphql/typeGenerated'
import { buildTypeDetailPath } from '~/modules/typeParams.module'

interface TypeNameLinkProps {
  type: PokemonType
  label?: string
}

const TYPE_COLOR_CLASS: Record<PokemonType, string> = {
  NORMAL: 'type-color-normal',
  FIRE: 'type-color-fire',
  WATER: 'type-color-water',
  ELECTRIC: 'type-color-electric',
  GRASS: 'type-color-grass',
  ICE: 'type-color-ice',
  FIGHTING: 'type-color-fighting',
  POISON: 'type-color-poison',
  GROUND: 'type-color-ground',
  FLYING: 'type-color-flying',
  PSYCHIC: 'type-color-psychic',
  BUG: 'type-color-bug',
  ROCK: 'type-color-rock',
  GHOST: 'type-color-ghost',
  DRAGON: 'type-color-dragon',
  DARK: 'type-color-dark',
  STEEL: 'type-color-steel',
  FAIRY: 'type-color-fairy',
}

const TypeNameLink = ({ type, label }: TypeNameLinkProps) => {
  const text = label ?? `${PokemonTypes[type]} 타입`

  return (
    <Link
      href={buildTypeDetailPath(type)}
      aria-label={`${PokemonTypes[type]} 타입 약점과 상성 보기`}
      className="hover:underline focus-visible:underline"
    >
      <b className={TYPE_COLOR_CLASS[type]}>{text}</b>
    </Link>
  )
}

export default TypeNameLink
