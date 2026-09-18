import { PokemonType } from '~/graphql/typeGenerated'

export const toBooleanOrUndefined = (
  value: string | undefined,
): boolean | undefined => {
  return value === 'true' ? true : value === 'false' ? false : undefined
}

export const changeTypeArrayToString = (
  type: string | undefined,
): Array<PokemonType> => {
  return type ? (type.split(',') as Array<PokemonType>) : []
}

export const getGenerationParams = (generation: string | Array<string>) => {
  if (typeof generation === 'string') {
    return [parseInt(generation, 10)]
  } else {
    return generation.map((item) => {
      return parseInt(item, 10)
    })
  }
}
