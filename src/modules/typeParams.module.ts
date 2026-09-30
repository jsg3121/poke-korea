import { PokemonTypes } from '~/types/pokemonTypes.types'
import { PokemonType } from '~/graphql/typeGenerated'

const SLUG_TO_TYPE: Record<string, PokemonType> = Object.fromEntries(
  Object.values(PokemonType).map((type) => [type.toLowerCase(), type]),
)

export const TYPE_SLUGS: ReadonlyArray<string> = Object.values(PokemonType).map(
  (type) => type.toLowerCase(),
)

export const parseTypeSlug = (slug: string): PokemonType | undefined =>
  SLUG_TO_TYPE[slug]

export const buildTypeSlug = (type: PokemonType): string => type.toLowerCase()

export const buildTypeDetailPath = (type: PokemonType): string =>
  `/type-effectiveness/${buildTypeSlug(type)}`

export const getTypeLabel = (type: PokemonType): string => PokemonTypes[type]

export const parseTypeLabel = (label: string): PokemonType | undefined =>
  Object.values(PokemonType).find((type) => PokemonTypes[type] === label.trim())
