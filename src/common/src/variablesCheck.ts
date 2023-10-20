type FilterTypes = {
  name?: string
  pokemonNumber?: number
  generation?: Array<string>
  type?: Array<string>
  isMega?: string
  isRegion?: string
  isEvolution?: string
}

export const variablesCheck = (filter: FilterTypes) => {
  const {
    name,
    pokemonNumber,
    generation = [],
    type = [],
    isMega,
    isRegion,
    isEvolution,
  } = filter

  const variable = {
    pokemonNumber,
    name,
    generation: generation.length === 0 ? undefined : generation,
    type: type.length === 0 ? undefined : type,
    isMega: isMega === 'true' ? true : isMega === 'false' ? false : undefined,
    isRegion:
      isRegion === 'true' ? true : isRegion === 'false' ? false : undefined,
    isEvolution:
      isEvolution === 'true'
        ? true
        : isEvolution === 'false'
        ? false
        : undefined,
  }

  return variable
}
